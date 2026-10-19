const mongoose = require('mongoose');
module.exports = mongoose.model('Post', new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: String, text: { type: String, required: true, maxlength: 500 },
  kind: { type: String, enum: ['question', 'tip'], default: 'question' }
}, { timestamps: true }));
