const Advance = require('../models/Advance');
const Employee = require('../models/Employee');
const ActivityLog = require('../models/ActivityLog');
const { toFrontendAdvance } = require('../utils/helpers');

exports.list = async (req, res) => {
  try {
    const advances = await Advance.find().sort({ createdAt: -1 });
    res.json(advances.map(toFrontendAdvance));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { employeeId, amount } = req.body;
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    const advance = await Advance.create({
      employeeId,
      employeeName: employee.name,
      amount: Number(amount),
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    });
    await ActivityLog.create({
      message: `Advance requested: ${employee.name} - ₹${Number(amount).toLocaleString()}`,
    });
    res.status(201).json(toFrontendAdvance(advance));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
