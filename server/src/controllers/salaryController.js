const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const SalaryRecord = require('../models/SalaryRecord');
const Advance = require('../models/Advance');
const ActivityLog = require('../models/ActivityLog');
const { toFrontendSalaryRecord, STANDARD_HOURS, getMonthLabel } = require('../utils/helpers');

async function getTotalHoursForPeriod(employeeId, monthKey) {
  const records = await Attendance.find({
    employeeId,
    date: new RegExp(`^${monthKey}`),
    status: { $in: ['present', 'late'] },
  });
  return records.reduce((sum, a) => {
    const hours = a.workedHours !== undefined && a.workedHours !== null ? a.workedHours : STANDARD_HOURS;
    return sum + hours + (a.overtimeHours || 0);
  }, 0);
}

exports.list = async (req, res) => {
  try {
    const { month } = req.query;
    let query = {};
    if (month) query.monthKey = month;
    const records = await SalaryRecord.find(query).sort({ date: -1 });
    res.json(records.map(toFrontendSalaryRecord));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.processPayroll = async (req, res) => {
  try {
    const { monthKey, paymentDate, employeeIds } = req.body;
    const payDateStr = paymentDate || new Date().toISOString().slice(0, 10);
    const monthLabel = getMonthLabel(monthKey);
    const employees = employeeIds?.length
      ? await Employee.find({ employeeId: { $in: employeeIds } })
      : await Employee.find();
    const newRecords = [];
    for (const emp of employees) {
      const eId = emp.employeeId.trim();
      const mKey = monthKey.trim();
      
      const existing = await SalaryRecord.findOne({ employeeId: eId, monthKey: mKey });
      if (existing) continue;

      const totalHours = await getTotalHoursForPeriod(eId, mKey);
      if (totalHours <= 0) continue;

      const hourlyRate = emp.hourlyRate ?? Math.round((emp.baseSalary || 40000) / 176);
      const grossPay = Math.round(totalHours * hourlyRate);
      const pendingAdvances = await Advance.find({ employeeId: eId, status: 'Pending' });
      const advanceDeduction = pendingAdvances.reduce((s, a) => s + a.amount, 0);
      const netSalary = Math.max(0, grossPay - advanceDeduction);
      
      try {
        const record = await SalaryRecord.create({
          employeeId: eId,
          employeeName: emp.name,
          monthKey: mKey,
          monthLabel,
          totalHours,
          amount: netSalary,
          status: 'Paid',
          date: payDateStr,
        });
        newRecords.push(record);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`Skipping duplicate salary record for ${eId} - ${mKey}`);
          continue;
        }
        throw err;
      }
    }
    const paidEmployeeIds = newRecords.map((r) => r.employeeId);
    await Advance.updateMany(
      { employeeId: { $in: paidEmployeeIds }, status: 'Pending' },
      { status: 'Deducted' }
    );
    await ActivityLog.create({
      message: `Payroll processed for ${monthLabel}: ${newRecords.length} employee(s), paid on ${payDateStr}`,
    });
    res.status(201).json(newRecords.map(toFrontendSalaryRecord));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
