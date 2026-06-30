const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  cat: { type: String, required: true },
  items: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
