const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const SalaryRecord = require('../models/SalaryRecord');
const Advance = require('../models/Advance');
const ActivityLog = require('../models/ActivityLog');
const whatsappService = require('../services/whatsappService');
const { toFrontendSalaryRecord, STANDARD_HOURS, getMonthLabel, STANDARD_MONTHLY_HOURS, getDaysInMonth } = require('../utils/helpers');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function getTotalHoursForPeriod(employeeId, monthKey) {
  const records = await Attendance.find({
    employeeId,
    date: new RegExp(`^${monthKey}`),
    status: { $in: ['present', 'late'] },
    paymentStatus: { $ne: 'paid' },
  });

  return records.reduce((acc, a) => {
    const reg = a.workedHours !== undefined && a.workedHours !== null ? a.workedHours : STANDARD_HOURS;
    const ot = a.overtimeHours || 0;
    acc.regular += reg;
    acc.overtime += ot;
    acc.total += (reg + ot);
    return acc;
  }, { total: 0, regular: 0, overtime: 0 });
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

      const hoursBreakdown = await getTotalHoursForPeriod(eId, mKey);
      if (hoursBreakdown.total <= 0) continue;

      const daysInMonth = getDaysInMonth(mKey);
      const hourlyRate = emp.baseSalary 
        ? Math.floor(emp.baseSalary / (daysInMonth * 8)) 
        : (emp.hourlyRate || 150);

      const regularPay = Math.floor(hoursBreakdown.regular * hourlyRate);
      const overtimePay = Math.floor(hoursBreakdown.overtime * hourlyRate);
      const grossPay = regularPay + overtimePay;

      const pendingAdvances = await Advance.find({ employeeId: eId, status: 'Pending' });
      const advanceDeduction = pendingAdvances.reduce((s, a) => s + a.amount, 0);
      const netSalary = Math.max(0, grossPay - advanceDeduction);
      
      try {
        const record = await SalaryRecord.create({
          employeeId: eId,
          employeeName: emp.name,
          monthKey: mKey,
          monthLabel,
          totalHours: hoursBreakdown.total,
          amount: netSalary,
          status: 'Paid',
          date: payDateStr,
        });
        newRecords.push(record);

        await Attendance.updateMany(
          { 
            employeeId: eId, 
            date: new RegExp(`^${mKey}`), 
            paymentStatus: { $ne: 'paid' } 
          },
          { paymentStatus: 'paid' }
        );

        // Send WhatsApp notification
        if (emp.mobile) {
          whatsappService.sendSalaryAlert({
            employeeName: emp.name,
            mobile: emp.mobile,
            monthLabel,
            netSalary,
            regularHours: hoursBreakdown.regular,
            overtimeHours: hoursBreakdown.overtime,
            regularPay,
            overtimePay,
            advances: advanceDeduction,
            paymentDate: payDateStr
          });
          // Add a small delay between messages (2 seconds)
          await sleep(2000);
        }


      } catch (err) {
        if (err.code === 11000) {
          console.log(`Skipping duplicate salary record for ${eId} - ${mKey}`);
          continue;
        }
        throw err;
      }
    }
    // For employees who already had a record, but might have had missing paymentStatus updates 
    // or newly added records/advances, we perform a cleanup update.
    const allEmployeeIds = employees.map(e => e.employeeId.trim());
    await Attendance.updateMany(
      { 
        employeeId: { $in: allEmployeeIds }, 
        date: new RegExp(`^${monthKey.trim()}`), 
        paymentStatus: { $ne: 'paid' } 
      },
      { paymentStatus: 'paid' }
    );

    await Advance.updateMany(
      { employeeId: { $in: allEmployeeIds }, status: 'Pending' },
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
