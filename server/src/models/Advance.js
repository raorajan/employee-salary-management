const mongoose = require('mongoose');

const advanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, ref: 'Employee' },
  employeeName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Deducted'] },
}, { timestamps: true });

module.exports = mongoose.model('Advance', advanceSchema);
