const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, default: '' },
  credentialUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
