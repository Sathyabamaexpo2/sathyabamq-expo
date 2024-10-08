const nodemailer = require('nodemailer');
const Appointment = require('../models/AppointmentModel');

const bookAppointment = async (req, res) => {
  const { username, doctorName, doctorType, time, date, age, gender, bloodgroup, height, weight } = req.body;
  
  // Ensure the email is correctly retrieved from req.user
  const email = req.user?.email;
  console.log('Email from request:', email); // Log the email to debug

  // Check if the email is missing
  if (!email) {
      return res.status(400).json({ message: 'Email is required to book an appointment.' });
  }

  try {
      // Attempt to find user appointments by email
      let userAppointments = await Appointment.findOne({ email });
      console.log('Found user appointments:', userAppointments);

      // If no user appointments exist, create a new one
      if (!userAppointments) {
          userAppointments = new Appointment({ email, appointments: [] });
          console.log('Creating new user appointments document:', userAppointments);
      }

      const newAppointment = {
          username,
          doctorName,
          doctorType,
          time,
          date,
          age,
          gender,
          bloodgroup,
          height,
          weight,
          status: 'pending',
      };

      // Check for existing appointment
      const existingAppointment = userAppointments.appointments.find(app => 
          app.username === username && 
          app.doctorName === doctorName && 
          app.date === date && 
          app.time === time
      );

      if (existingAppointment) {
          return res.status(400).json({ message: 'This appointment already exists.' });
      }

      // Push the new appointment to the user's appointments
      userAppointments.appointments.push(newAppointment);
      console.log('Pushing appointment:', newAppointment);

      // Save user appointments
      await userAppointments.save();
      console.log('Saved user appointments:', userAppointments);

      res.status(200).json({ message: 'Appointment request sent successfully' });

  } catch (error) {
      console.error('Error processing appointment request:', error);
      if (error.code === 11000) {
          return res.status(400).json({ message: 'Duplicate appointment found.' });
      }
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
      username:appointment.username,
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

const getAppointmentsForDoctor = async (req, res) => {
  const { doctorName, doctorType } = req.params;

  try {
      const appointments = await Appointment.find({
          'appointments.doctorName': doctorName,
          'appointments.doctorType': doctorType,
      });

      res.status(200).json({ appointments });
  } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { username } = req.params;
  const { status } = req.body;

  try {
      const userAppointments = await Appointment.findOne({ 'appointments.username': username });
      
      if (!userAppointments) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      const appointment = userAppointments.appointments.find(app => app.username === username);
      if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      appointment.status = status;
      await userAppointments.save();

      res.status(200).json({ message: 'Appointment status updated', userAppointments });
  } catch (error) {
      res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};


module.exports = { bookAppointment,getAppointmentById,getAppointmentsForDoctor,updateAppointmentStatus};