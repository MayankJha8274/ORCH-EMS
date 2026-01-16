const mongoose = require('mongoose');

const DispatchLogSchema = new mongoose.Schema({
  emergencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Emergency' },
  ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  eta: Number,
  timestamp: { type: Date, default: Date.now },
  outcome: String
});

module.exports = mongoose.model('DispatchLog', DispatchLogSchema);
