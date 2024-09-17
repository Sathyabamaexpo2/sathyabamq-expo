const Appointment = require('../models/AppointmentModel');
const nodemailer = require('nodemailer');

const bookAppointment = async (req, res) => {
  const { doctorName, doctorType, time, date} = req.body;
  
  const email=req.user.email;

  try { 
    let userAppointments = await Appointment.findOne({email});

    if (!userAppointments) {
      userAppointments = new Appointment({ email, appointments: [] });
    }

    userAppointments.appointments.push({
      doctorName,
      doctorType,
      time,
      date,
      status: 'pending',
    });

    await userAppointments.save();

    res.status(200).json({
      message: 'Appointment request sent successfully',
    });

  } catch (error) {
    console.error('Error processing appointment request:', error);
    res.status(500).json({ message: 'Error processing appointment request', error: error.message });
  }
};


const getAppointmentById = async (req, res) => {

  const email=req.user.email

  if (!req.user.email || typeof req.user.email !== 'string') {
    return res.status(400).json({ message: 'Invalid email parameter' });
  }

  try {
    console.log('Querying appointments with Email:', req.user.email);

    const userAppointments = await Appointment.findOne({ email })

    console.log('Query result:', userAppointments);
    
    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this email' });
    }

    const userAppointmentData = userAppointments.appointments.map((appointment) => ({
      doctorName: appointment.doctorName,
      doctorType: appointment.doctorType,
      time: appointment.time,
      date: appointment.date,
      status: appointment.status
    }));

   console.log(userAppointmentData)

    res.status(200).json({ appointments: userAppointmentData });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};



module.exports = { bookAppointment,getAppointmentById };