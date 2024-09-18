const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors=require('cors');
const path = require('path');
const appointmentRoutes = require('./routes/appointmentRoutes');

dotenv.config(); 
connectDB(); 


const app = express();
app.use(express.json());
 
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
