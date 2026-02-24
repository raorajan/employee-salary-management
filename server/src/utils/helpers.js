const Employee = require('../models/Employee');

async function getNextEmployeeId() {
  const last = await Employee.findOne().sort({ employeeId: -1 });
  if (!last) return 'EMP001';
  const num = parseInt(last.employeeId.replace('EMP', ''), 10) + 1;
  return `EMP${String(num).padStart(3, '0')}`;
}

function toFrontendEmployee(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o.employeeId,
    employeeId: o.employeeId,
    name: o.name,
    email: o.email || '',
    department: o.department,
    role: o.role || '-',
    status: o.status || 'Active',
    hourlyRate: o.hourlyRate,
    baseSalary: o.baseSalary,
    address: o.address || '',
  };
}

function toFrontendAttendance(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    employeeId: o.employeeId,
    date: o.date,
    status: o.status,
    overtimeHours: o.overtimeHours ?? 0,
    workedHours: o.workedHours,
  };
}

function toFrontendSalaryRecord(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o._id.toString(),
    employeeId: o.employeeId,
    employeeName: o.employeeName,
    monthKey: o.monthKey,
    monthLabel: o.monthLabel,
    totalHours: o.totalHours,
    amount: o.amount,
    status: o.status,
    date: o.date,
  };
}

function toFrontendAdvance(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o._id.toString(),
    employeeId: o.employeeId,
    employeeName: o.employeeName,
    amount: o.amount,
    date: o.date,
    status: o.status,
  };
}

const STANDARD_HOURS = 8;
const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const STANDARD_MONTHLY_HOURS = 240;


function getMonthLabel(monthKey) {
  const [y, m] = monthKey.split('-').map(Number);
  return `${MONTHS[m]} ${y}`;
}

function getDaysInMonth(monthKey) {
  const [y, m] = monthKey.split('-').map(Number);
  // Date(y, m, 0) returns the last day of the month before m (where m is 1-indexed)
  // Since m in getMonthLabel/monthKey seems to be 1-indexed (based on MONTHS array starting with empty string)
  // we use m (next month) and day 0 to get current month's last day.
  return new Date(y, m, 0).getDate();
}

module.exports = {
  getNextEmployeeId,
  toFrontendEmployee,
  toFrontendAttendance,
  toFrontendSalaryRecord,
  toFrontendAdvance,
  getDaysInMonth,
  STANDARD_HOURS,
  STANDARD_MONTHLY_HOURS,
  getMonthLabel,
};
