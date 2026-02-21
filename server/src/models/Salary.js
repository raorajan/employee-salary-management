const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  month: String,
  gross: Number,
  net: Number,
});

module.exports = mongoose.model('Salary', SalarySchema);
