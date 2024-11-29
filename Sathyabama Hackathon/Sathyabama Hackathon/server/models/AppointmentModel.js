const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  email: { type: String, required: true },
  appointments: [
    {
      username: { type: String, required: true },
      doctorName: { type: String, required: true },
      doctorType: { type: String, required: true },
      time: { type: String, required: true },
      date: { type: String, required: true },
      age: { type: Number },
      gender: { type: String },
      bloodgroup: { type: String },
      height: { type: Number },
      weight: { type: Number },
      status: { type: String, default: 'pending' },
      image:{filename:String,path:String}
    }
  ]
});
// appointmentSchema.methods.checkExpiredAppointments = async function() {
//   const now = new Date();
//   const currentDate = now.toISOString().split('T')[0];
//   const currentTime = now.toISOString().split('T')[1].split('.')[0]; 
//   this.appointments = this.appointments.filter((appointment) => {
//     if (appointment.date < currentDate) {
//       return false;
//     } else if (appointment.date === currentDate && appointment.time < currentTime) {
//       return false; 
//     }
//     return true;
//   });

//   // Save the updated appointments
//   await this.save();
// };

// // Create and export the model
const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
