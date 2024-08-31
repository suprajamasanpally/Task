const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  fields: { type: Array, default: [] }, // Add fields that the template might have
  selected: { type: Boolean, default: false }, // Flag to mark the selected template
});

module.exports = mongoose.model('Template', TemplateSchema);
