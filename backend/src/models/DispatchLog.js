const mongoose = require('mongoose');

const dispatchLogSchema = new mongoose.Schema({
  emergency: { type: mongoose.Schema.Types.ObjectId, ref: 'Emergency' },
  ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  etaToEmergency: Number,
  etaToHospital: Number,
  totalETA: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DispatchLog', dispatchLogSchema);
