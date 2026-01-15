
const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: String,
  location: {
    lat: Number,
    lng: Number
  },
  totalBeds: Number,
  availableBeds: Number
});

module.exports = mongoose.model("Hospital", hospitalSchema);

