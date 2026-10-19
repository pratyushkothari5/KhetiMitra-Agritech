const mongoose = require('mongoose');
module.exports = mongoose.model('Farm', new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: String,
  areaAcres: { type: Number, min: 0, default: 1 },
  soilType: { type: String, enum: ['Black', 'Red', 'Alluvial', 'Sandy', 'Loamy'], default: 'Black' }
}, { timestamps: true }));
