const mongoose = require('mongoose');
const Emergency = require('../models/Emergency');
const Ambulance = require('../models/Ambulance');
const Hospital = require('../models/Hospital');
const DispatchLog = require('../models/DispatchLog');
const { pickBest } = require('./decisionEngine');
const { getIO } = require('./socket');

async function dispatchEmergency(emergencyId) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const emergency = await Emergency.findById(emergencyId).session(session);
    if (!emergency) throw new Error('Emergency not found');
    if (emergency.status && emergency.status !== 'PENDING') throw new Error('Emergency not dispatchable');

    const best = await pickBest(emergency);
    if (!best) throw new Error('No available ambulance/hospital');

    // Reserve ambulance and hospital within transaction
    const amb = await Ambulance.findById(best.ambulance._id).session(session);
    if (!amb) throw new Error('Ambulance disappeared');
    if (amb.status === 'busy' || amb.status === 'busy') throw new Error('Ambulance not available');
    amb.status = 'busy';
    await amb.save({ session });

    const hosp = await Hospital.findById(best.hospital._id).session(session);
    if (!hosp) throw new Error('Hospital disappeared');
    if (hosp.availableBeds <= 0) throw new Error('No beds available');
    hosp.availableBeds = hosp.availableBeds - 1;
    await hosp.save({ session });

    emergency.status = 'DISPATCHED';
    await emergency.save({ session });

    const log = await DispatchLog.create([
      {
        emergency: emergency._id,
        ambulance: amb._id,
        hospital: hosp._id,
        etaToEmergency: best.etaToEmergency.etaMinutes || best.etaToEmergency,
        etaToHospital: best.etaToHospital.etaMinutes || best.etaToHospital,
        totalETA: best.totalETA
      }
    ], { session });

    await session.commitTransaction();
    session.endSession();

    // emit realtime event
    try {
      const io = getIO();
      io.emit('dispatch.created', { dispatch: log[0], ambulance: amb, hospital: hosp, emergencyId: emergency._id });
    } catch (e) {
      // socket not initialized, ignore
    }

    return { success: true, dispatch: log[0], ambulance: amb, hospital: hosp };
  } catch (err) {
    await session.abortTransaction().catch(()=>{});
    session.endSession();
    throw err;
  }
}

module.exports = { dispatchEmergency };
