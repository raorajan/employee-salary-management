const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, ref: 'Employee' },
  date: { type: String, required: true },
  status: { type: String, required: true, enum: ['present', 'absent', 'leave', 'late'] },
  overtimeHours: { type: Number, default: 0 },
  workedHours: { type: Number, default: null },
  paymentStatus: { type: String, default: 'unpaid', enum: ['unpaid', 'paid'] },
}, { timestamps: true });

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
