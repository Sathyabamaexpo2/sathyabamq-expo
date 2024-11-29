

const mongoose = require('mongoose');

const extractedTextSchema = new mongoose.Schema({
    doctorName: { type: String, required: true },
    patientName: { type: String, required: true },
    extractedText: { type: String, required: true },
    date: { type: String, default: 'Not Available' },
    bloodSugarF: { type: String, default: 'Not Available' },
    bloodSugarPP: { type: String, default: 'Not Available' },
    bloodUrea: { type: String, default: 'Not Available' },
    serumCreatine: { type: String, default: 'Not Available' },
}, { timestamps: true });

const ExtractedText = mongoose.model('ExtractedText', extractedTextSchema);

module.exports = ExtractedText;
