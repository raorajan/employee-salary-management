const mongoose = require('mongoose');

const OvertimeSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  hours: Number,
  date: Date,
});

module.exports = mongoose.model('Overtime', OvertimeSchema);
