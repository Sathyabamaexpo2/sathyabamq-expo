const mongoose = require('mongoose');

// Define the schema for the report
const reportSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    files: [
        {
            filename: {
                type: String,
                required: true,
            },
            path: {
                type: String,
                required: true,
            },
            extractedText: {
                type: String,
                default: '', // Stores extracted text, defaulting to empty if none is available
            },
        },
    ],
});

// Create the model
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
