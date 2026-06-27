const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  type: { type: String, enum: ['overall', 'project'], required: true },
  projectId: { type: String, default: null },
  projectTitle: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
