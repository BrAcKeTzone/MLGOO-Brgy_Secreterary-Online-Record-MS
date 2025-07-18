const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const settingRoutes = require('./routes/settingRoutes');
const userListRoutes = require('./routes/userListRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const reportRoutes = require('./routes/reportRoutes'); 
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const logRoutes = require('./routes/logRoutes');


const app = express();

// Configure CORS for frontend
app.use(cors(
//   {
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }
));

app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/users', userListRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reports', reportRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/logs', logRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Brgy Secretary Online Record MS API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
