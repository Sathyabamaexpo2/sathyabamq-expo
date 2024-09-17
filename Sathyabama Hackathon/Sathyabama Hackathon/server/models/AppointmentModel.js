const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  appointments: [
    {
      doctorName: String,
      doctorType: String,
      time: String,
      date: String,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
      },
    },
  ],
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
