const mongoose = require('mongoose');
module.exports = mongoose.model('Order', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, qty: { type: Number, min: 1, default: 1 } }],
  total: Number,
  status: { type: String, enum: ['pending', 'approved', 'shipped', 'delivered', 'rejected'], default: 'pending' }
}, { timestamps: true }));
