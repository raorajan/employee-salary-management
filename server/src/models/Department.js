const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('Department', DepartmentSchema);
