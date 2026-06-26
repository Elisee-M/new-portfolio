const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  tech: { type: String, default: '' },
  image: { type: String, default: '' },
  demo: { type: String, default: '' },
  source: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
