const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors=require('cors');
const path = require('path');
const appointmentRoutes = require('./routes/appointmentRoutes');
const {checkAndUpdateAppointments} = require('./controllers/appointmentController');

dotenv.config(); 
connectDB(); 


const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

   
 

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use('/api/user/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/user/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
        
          console.error(err);
          res.status(err.status).end();
      }
  });
});

app.use('/api/user', authRoutes);
app.use('/api/user', appointmentRoutes);


setInterval(checkAndUpdateAppointments, 24 * 60 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`  );
});