const mongoose = require('mongoose');
module.exports = mongoose.model('Crop', new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  name: { type: String, required: true },
  season: { type: String, enum: ['Kharif', 'Rabi', 'Zaid'], default: 'Rabi' },
  sownOn: Date,
  status: { type: String, enum: ['planned', 'growing', 'harvested'], default: 'planned' },
  expectedYield: { type: Number, default: 0 },
  soilPh: Number, soilNitrogen: Number, soilMoisture: Number
}, { timestamps: true }));
