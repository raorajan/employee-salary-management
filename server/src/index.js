require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const advanceRoutes = require('./routes/advanceRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rajan:kumar@cluster0.vvtoxbl.mongodb.net/attendance_db?retryWrites=true&w=majority';

app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes (will add authentication middleware later)
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/advances', advanceRoutes);
app.use('/api/activity', activityRoutes);

app.get('/api', (req, res) => res.json({ ok: true, message: 'AttendSalary API' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
