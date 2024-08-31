const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
    name: String,
    date: Date
});

const EducationalInfoSchema = new mongoose.Schema({
    email: { type: String, required: true },
    highestQualification: String,
    course: String,
    fieldOfStudy: String,
    university: String,
    gpa: String,
    completionDate: Date,
    certifications: [CertificationSchema]
});

const EducationalInfoModel = mongoose.model('educationalinfos', EducationalInfoSchema);
module.exports=EducationalInfoModel;
