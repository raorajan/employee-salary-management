const mongoose = require('mongoose');

const salaryRecordSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, ref: 'Employee' },
  employeeName: { type: String, required: true },
  monthKey: { type: String, required: true },
  monthLabel: { type: String, required: true },
  totalHours: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Paid', enum: ['Paid'] },
  date: { type: String, required: true },
}, { timestamps: true });

salaryRecordSchema.index({ employeeId: 1, monthKey: 1 }, { unique: true });

module.exports = mongoose.model('SalaryRecord', salaryRecordSchema);
