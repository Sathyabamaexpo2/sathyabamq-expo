const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
   files:[{
    filename: String,
    path: String,
   }]
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
