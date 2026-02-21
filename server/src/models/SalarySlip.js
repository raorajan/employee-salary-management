const mongoose = require('mongoose');

const SalarySlipSchema = new mongoose.Schema({
  salary: { type: mongoose.Schema.Types.ObjectId, ref: 'Salary' },
  generatedAt: Date,
});

module.exports = mongoose.model('SalarySlip', SalarySlipSchema);
