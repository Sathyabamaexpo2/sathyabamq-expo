const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    doctorName: {
        type: String, 
        required: true,
        unique:true,
    },
    patientName: {
        type: String,
        required: true,
        unique:true,
    },
    files: [{
        filename: String,
        path: String,
    }]
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
