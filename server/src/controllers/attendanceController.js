const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const ActivityLog = require('../models/ActivityLog');
const { toFrontendAttendance } = require('../utils/helpers');

exports.list = async (req, res) => {
  try {
    const { employeeId, date, month } = req.query;
    let query = {};
    if (employeeId) query.employeeId = employeeId;
    if (date) query.date = date;
    if (month) query.date = new RegExp(`^${month}`);
    const records = await Attendance.find(query).sort({ date: -1 });
    res.json(records.map(toFrontendAttendance));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.mark = async (req, res) => {
  try {
    const { employeeId, date, status, overtimeHours = 0, workedHours } = req.body;
    const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().slice(0, 10);
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    let finalWorkedHours = workedHours;
    if (finalWorkedHours === null || finalWorkedHours === undefined) {
      finalWorkedHours = (status === 'present' || status === 'late') ? 8 : 0;
    }
    const record = await Attendance.findOneAndUpdate(
      { employeeId, date: dateStr },
      { status, overtimeHours: Number(overtimeHours) || 0, workedHours: finalWorkedHours },
      { new: true, upsert: true }
    );
    await ActivityLog.create({
      message: `Attendance marked: ${employee.name} - ${status}${overtimeHours ? ` (${overtimeHours}h OT)` : ''}`,
    });
    res.json(toFrontendAttendance(record));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
