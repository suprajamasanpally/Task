const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
  company: String,
  startDate: Date,
  endDate: Date,
  jobTitle: String,
  description: String,
  industry: String,
  domain: String,
  currentStatus: String
});

const ProfessionalInfoSchema = new mongoose.Schema({
  email: {type: String, required: true},
  employers: [EmployerSchema]
});

const ProfessionalInfoModel = mongoose.model('professionalinfos', ProfessionalInfoSchema);
module.exports = ProfessionalInfoModel;
