const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    type: String,
    file: String
});

const DocumentUploadSchema = new mongoose.Schema({
    email: { type: String, required: true },
    identification: DocumentSchema,
    birthCertificate: DocumentSchema,
    addressVerification: DocumentSchema,
    educationalCredentials: DocumentSchema,
    resume: String
});

const DocumentUploadModel = mongoose.model('DocumentUpload', DocumentUploadSchema);
module.exports = DocumentUploadModel;
