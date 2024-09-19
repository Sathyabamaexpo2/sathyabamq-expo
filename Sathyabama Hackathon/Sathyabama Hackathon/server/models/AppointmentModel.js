const mongoose = require('mongoose');

const appointmentDetailSchema = new mongoose.Schema({
  username: { type: String, required: true },
  doctorName: { type: String, required: true },
  age:{type:Number, required: true},
  gender:{type:String, required: true},
  bloodgroup:{type:String, required: true},
  height:{type:String, required: true},
  weight:{type:String, required: true},
  doctorType: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
});

const appointmentSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
  },
  appointments: [appointmentDetailSchema], // Embedded documents
});

appointmentSchema.index({ email: 1 }, { unique: true, sparse: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
