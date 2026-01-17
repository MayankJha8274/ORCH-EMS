
const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({
  id: String,
  location: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ["available", "busy"],
    default: "available"
  }
});

module.exports = mongoose.model("Ambulance", ambulanceSchema);
