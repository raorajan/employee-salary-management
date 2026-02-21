const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Advance = require('../models/Advance');
const ActivityLog = require('../models/ActivityLog');
const { getNextEmployeeId, toFrontendEmployee } = require('../utils/helpers');

exports.list = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ employeeId: 1 });
    res.json(employees.map(toFrontendEmployee));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const employeeId = await getNextEmployeeId();
    const hourlyRate = Number(req.body.hourlyRate) || 150;
    const employee = new Employee({
      employeeId,
      name: req.body.name,
      email: req.body.email || '',
      department: req.body.department,
      role: req.body.role || '-',
      status: 'Active',
      hourlyRate,
      baseSalary: Math.round(hourlyRate * 176),
      address: req.body.address || '',
    });
    await employee.save();
    await ActivityLog.create({ message: `New employee added: ${employee.name}` });
    res.status(201).json(toFrontendEmployee(employee));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOneAndDelete({ employeeId: id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await Attendance.deleteMany({ employeeId: id });
    await Advance.deleteMany({ employeeId: id });
    await ActivityLog.create({ message: `Employee removed: ${employee.name}` });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
