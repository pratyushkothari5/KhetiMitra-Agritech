const mongoose = require('mongoose');
module.exports = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true }, category: { type: String, default: 'General' },
  price: { type: Number, required: true, min: 0 }, unit: { type: String, default: 'kg' },
  emoji: { type: String, default: '🌱' }, stock: { type: Number, default: 100 }
}, { timestamps: true }));
