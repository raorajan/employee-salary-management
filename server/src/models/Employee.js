const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  department: { type: String, required: true, enum: ['Engineering', 'Labour', 'HR'] },
  role: { type: String, default: '-' },
  status: { type: String, default: 'Active', enum: ['Active', 'On Leave'] },
  hourlyRate: { type: Number, required: true, default: 150 },
  baseSalary: { type: Number, default: 0 },
  address: { type: String, default: '' },
}, { timestamps: true });

employeeSchema.pre('save', function (next) {
  if (!this.baseSalary && this.hourlyRate) {
    this.baseSalary = Math.round(this.hourlyRate * 176);
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
