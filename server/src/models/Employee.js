const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  department: { type: String, required: true, enum: ['Engineering', 'Labour', 'HR'] },
  role: { type: String, default: '-' },
  status: { type: String, default: 'Active', enum: ['Active', 'On Leave'] },
  hourlyRate: { type: Number, default: 0 },
  baseSalary: { type: Number, required: true, default: 0 },
  address: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
