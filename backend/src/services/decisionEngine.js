const Ambulance = require('../models/Ambulance');
const Hospital = require('../models/Hospital');
const { getETA } = require('./routing/routingAdapter');

async function pickBest(emergency) {
  const ambulances = await Ambulance.find({ status: 'available' });
  const hospitals = await Hospital.find({ availableBeds: { $gt: 0 } });

  let best = null;
  let minTotalETA = Infinity;

  for (const amb of ambulances) {
    const etaToEmerg = await getETA(amb.location, emergency.location);
    for (const hosp of hospitals) {
      const etaToHosp = await getETA(emergency.location, hosp.location);
      const total = etaToEmerg.etaMinutes + etaToHosp.etaMinutes;
      if (total < minTotalETA) {
        minTotalETA = total;
        best = {
          ambulance: amb,
          hospital: hosp,
          etaToEmergency: etaToEmerg,
          etaToHospital: etaToHosp,
          totalETA: total
        };
      }
    }
  }

  return best;
}

module.exports = { pickBest };
