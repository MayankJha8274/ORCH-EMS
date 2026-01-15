
const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({
  location: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ["AVAILABLE", "BUSY"],
    default: "AVAILABLE"
  }
});

module.exports = mongoose.model("Ambulance", ambulanceSchema);
