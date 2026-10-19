const mongoose = require('mongoose');
module.exports = mongoose.model('WeatherData', new mongoose.Schema({
  location: { type: String, required: true }, date: { type: String, required: true },
  tempC: Number, rainProb: Number, humidity: Number
}, { timestamps: true }));
