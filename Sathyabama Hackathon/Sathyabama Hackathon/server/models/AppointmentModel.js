const mongoose = require('mongoose');

const AppointmentDetailSchema = new mongoose.Schema({
  username: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorType: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
});

const AppointmentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  appointments: [AppointmentDetailSchema],
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
