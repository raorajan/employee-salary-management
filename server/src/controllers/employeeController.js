const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Advance = require('../models/Advance');
const ActivityLog = require('../models/ActivityLog');
const { getNextEmployeeId, toFrontendEmployee, getDaysInMonth } = require('../utils/helpers');

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
    const monthlySalary = Number(req.body.hourlyRate) || 0;
    
    // We store the monthly salary as baseSalary. 
    // hourlyRate is stored as a derived value for convenience (Salary / (Days * 8))
    const derivedHourlyRate = monthlySalary > 0 ? (monthlySalary / 240) : 0;
    
    const employee = new Employee({
      employeeId,
      name: req.body.name,
      email: req.body.email || '',
      department: req.body.department,
      role: req.body.role || '-',
      status: 'Active',
      hourlyRate: derivedHourlyRate,
      baseSalary: monthlySalary,
      address: req.body.address || '',
    });
    await employee.save();
    await ActivityLog.create({ message: `New employee added: ${employee.name} (Monthly: ₹${monthlySalary})` });
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

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    if (updates.hourlyRate !== undefined) {
      const monthlySalary = Number(updates.hourlyRate) || 0;
      updates.baseSalary = monthlySalary;
      updates.hourlyRate = monthlySalary > 0 ? (monthlySalary / 240) : 0;
    }

    const employee = await Employee.findOneAndUpdate(
      { employeeId: id },
      { $set: updates },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await ActivityLog.create({ message: `Employee updated: ${employee.name}` });
    res.json(toFrontendEmployee(employee));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
