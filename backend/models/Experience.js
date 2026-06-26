const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  org: { type: String, default: '' },
  period: { type: String, default: '' },
  desc: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
