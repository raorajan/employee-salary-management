const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true, enum: ['Engineering', 'Labour', 'HR'] },
  role: { type: String, default: '-' },
  status: { type: String, default: 'Active', enum: ['Active', 'On Leave'] },
  hourlyRate: { type: Number, default: 0 },
  baseSalary: { type: Number, required: true, default: 0 },
  mobile: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
