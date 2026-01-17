const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  caller: String,
  severity: Number, // 1–10 ( emergency level )
  location: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    default: "PENDING"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Emergency", emergencySchema);
