const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    doctorName: {
        type: String, 
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    files: [{
        filename: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        extractedText: { // Store the extracted text from the file
            type: String,
            default: '' // Initialize as an empty string in case no text is extracted
        }
    }]
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
