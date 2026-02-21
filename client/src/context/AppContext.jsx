import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { api } from '../api/client';

const DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'labour', label: 'Labour' },
  { value: 'hr', label: 'HR' },
];

const STANDARD_HOURS = 8;
const LABOUR_OVERTIME_DEFAULT = 4;

const INITIAL_EMPLOYEES = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', role: 'Senior Developer', status: 'Active', hourlyRate: 250, baseSalary: 44000, email: 'john@example.com', address: '123 Main St' },
  { id: 'EMP002', name: 'Jane Smith', department: 'HR', role: 'UI Lead', status: 'Active', hourlyRate: 225, baseSalary: 39600, email: 'jane@example.com', address: '456 Oak Ave' },
  { id: 'EMP003', name: 'Mike Johnson', department: 'HR', role: 'Manager', status: 'On Leave', hourlyRate: 280, baseSalary: 49280, email: 'mike@example.com', address: '789 Pine Rd' },
  { id: 'EMP004', name: 'Sarah Wilson', department: 'Labour', role: 'Labourer', status: 'Active', hourlyRate: 150, baseSalary: 21600, email: 'sarah@example.com', address: '321 Elm St' },
];

const INITIAL_ATTENDANCE = [
  { employeeId: 'EMP001', date: '2025-02-03', status: 'present', overtimeHours: 2 },
  { employeeId: 'EMP001', date: '2025-02-05', status: 'absent', overtimeHours: 0 },
  { employeeId: 'EMP001', date: '2025-02-07', status: 'leave', overtimeHours: 0 },
  { employeeId: 'EMP001', date: '2025-02-12', status: 'present', overtimeHours: 4 },
  { employeeId: 'EMP001', date: '2025-02-15', status: 'late', overtimeHours: 0 },
  { employeeId: 'EMP001', date: '2025-02-20', status: 'present', overtimeHours: 4 },
  { employeeId: 'EMP002', date: '2025-02-20', status: 'present', overtimeHours: 1.5 },
  { employeeId: 'EMP003', date: '2025-02-19', status: 'leave', overtimeHours: 0 },
  { employeeId: 'EMP004', date: '2025-02-21', status: 'present', overtimeHours: 4 },
];

const INITIAL_SALARY_HISTORY = [
  { id: 'sh1', employeeId: 'EMP001', employeeName: 'John Doe', monthKey: '2025-02', monthLabel: 'February 2025', totalHours: 46, amount: 11500, status: 'Paid', date: '2025-02-05' },
  { id: 'sh2', employeeId: 'EMP001', employeeName: 'John Doe', monthKey: '2025-01', monthLabel: 'January 2025', totalHours: 176, amount: 44000, status: 'Paid', date: '2025-01-10' },
  { id: 'sh3', employeeId: 'EMP002', employeeName: 'Jane Smith', monthKey: '2025-02', monthLabel: 'February 2025', totalHours: 76, amount: 17100, status: 'Paid', date: '2025-02-10' },
];

const INITIAL_ADVANCES = [
  { id: 'adv1', employeeId: 'EMP002', employeeName: 'Jane Smith', amount: 5000, date: '2025-02-15', status: 'Pending' },
  { id: 'adv2', employeeId: 'EMP003', employeeName: 'Mike Johnson', amount: 3000, date: '2025-02-10', status: 'Deducted' },
];

const AppContext = createContext(null);

let employeeCounter = 5;
let activityCounter = 0;

function generateEmployeeId() {
  return `EMP${String(employeeCounter++).padStart(3, '0')}`;
}

function generateId(prefix) {
  return `${prefix}${Date.now()}`;
}

const USE_API = import.meta.env.VITE_USE_API !== 'false';

export function AppProvider({ children }) {
  const [employees, setEmployees] = useState(USE_API ? [] : INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState(USE_API ? [] : INITIAL_ATTENDANCE);
  const [salaryHistory, setSalaryHistory] = useState(USE_API ? [] : INITIAL_SALARY_HISTORY);
  const [advances, setAdvances] = useState(USE_API ? [] : INITIAL_ADVANCES);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(USE_API);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!USE_API) return;
    const fetchAll = async () => {
      try {
        setApiError(null);
        const [empRes, attRes, salRes, advRes, actRes] = await Promise.all([
          api.employees.list(),
          api.attendance.list(),
          api.salary.list(),
          api.advances.list(),
          api.activity.list().catch(() => []),
        ]);
        setEmployees(Array.isArray(empRes) ? empRes.map((e) => ({ ...e, id: e.id || e.employeeId })) : []);
        setAttendance(Array.isArray(attRes) ? attRes : []);
        setSalaryHistory(Array.isArray(salRes) ? salRes : []);
        setAdvances(Array.isArray(advRes) ? advRes : []);
        setActivityLog(Array.isArray(actRes) ? actRes : []);
      } catch (err) {
        setApiError(err.message);
        setEmployees([]);
        setAttendance([]);
        setSalaryHistory([]);
        setAdvances([]);
        setActivityLog([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const refetch = useCallback(async () => {
    if (!USE_API) return;
    try {
      const [empRes, attRes, salRes, advRes, actRes] = await Promise.all([
        api.employees.list(),
        api.attendance.list(),
        api.salary.list(),
        api.advances.list(),
        api.activity.list().catch(() => []),
      ]);
      setEmployees(Array.isArray(empRes) ? empRes.map((e) => ({ ...e, id: e.id || e.employeeId })) : []);
      setAttendance(Array.isArray(attRes) ? attRes : []);
      setSalaryHistory(Array.isArray(salRes) ? salRes : []);
      setAdvances(Array.isArray(advRes) ? advRes : []);
      setActivityLog(Array.isArray(actRes) ? actRes : []);
    } catch (_) {}
  }, []);

  const logActivity = useCallback((message) => {
    setActivityLog((prev) => [{ id: ++activityCounter, message, timestamp: new Date() }, ...prev].slice(0, 20));
  }, []);

  const addEmployee = useCallback(async (data) => {
    if (USE_API) {
      try {
        const emp = await api.employees.create(data);
        await refetch();
        return emp.id || emp.employeeId;
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
    }
    const id = generateEmployeeId();
    const hourlyRate = Number(data.hourlyRate) || 150;
    const emp = { id, name: data.name, department: data.department, role: data.role || '-', status: 'Active', hourlyRate, baseSalary: Math.round(hourlyRate * 176), email: data.email || '', address: data.address || '' };
    setEmployees((prev) => [...prev, emp]);
    logActivity(`New employee added: ${emp.name}`);
    return id;
  }, [logActivity, refetch]);

  const removeEmployee = useCallback(async (employeeId) => {
    if (USE_API) {
      try {
        await api.employees.remove(employeeId);
        await refetch();
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
      return;
    }
    setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
    setAttendance((prev) => prev.filter((a) => a.employeeId !== employeeId));
    setAdvances((prev) => prev.filter((a) => a.employeeId !== employeeId));
  }, [refetch]);

  const markAttendance = useCallback(async (employeeId, date, status, overtimeHours = 0, workedHours = null) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
    if (USE_API) {
      try {
        await api.attendance.mark({ employeeId, date: dateStr, status, overtimeHours, workedHours });
        await refetch();
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
      return;
    }
    const emp = employees.find((e) => e.id === employeeId);
    let finalWorkedHours = workedHours;
    if (finalWorkedHours === null) finalWorkedHours = (status === 'present' || status === 'late') ? STANDARD_HOURS : 0;
    setAttendance((prev) => {
      const filtered = prev.filter((a) => !(a.employeeId === employeeId && a.date === dateStr));
      return [...filtered, { employeeId, date: dateStr, status, overtimeHours, workedHours: finalWorkedHours }];
    });
    logActivity(`Attendance marked: ${emp?.name} - ${status}${overtimeHours ? ` (${overtimeHours}h OT)` : ''}`);
  }, [employees, logActivity, refetch]);

  const addAdvance = useCallback(async (employeeId, amount) => {
    if (USE_API) {
      try {
        await api.advances.create({ employeeId, amount });
        await refetch();
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
      return;
    }
    const emp = employees.find((e) => e.id === employeeId);
    const adv = { id: generateId('adv'), employeeId, employeeName: emp?.name || 'Unknown', amount: Number(amount), date: new Date().toISOString().slice(0, 10), status: 'Pending' };
    setAdvances((prev) => [...prev, adv]);
    logActivity(`Advance requested: ${emp?.name} - ₹${Number(amount).toLocaleString()}`);
  }, [employees, logActivity, refetch]);

  const getTotalHoursForPeriod = useCallback((employeeId, monthKey) => {
    const monthAttendance = attendance.filter((a) => a.employeeId === employeeId && a.date.startsWith(monthKey));
    return monthAttendance.reduce((sum, a) => {
      if (a.status === 'present' || a.status === 'late') {
        const hours = a.workedHours !== undefined && a.workedHours !== null ? a.workedHours : STANDARD_HOURS;
        return sum + hours + (a.overtimeHours || 0);
      }
      return sum;
    }, 0);
  }, [attendance]);

  const processPayroll = useCallback(async (monthKey, paymentDate, employeeIds = null) => {
    if (USE_API) {
      try {
        await api.salary.process({ monthKey, paymentDate, employeeIds });
        await refetch();
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
      return;
    }
    const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [y, m] = monthKey.split('-').map(Number);
    const monthLabel = `${MONTHS[m]} ${y}`;
    const payDateStr = paymentDate || new Date().toISOString().slice(0, 10);

    const toProcess = employeeIds ? employees.filter((e) => employeeIds.includes(e.id)) : employees;
    const newRecords = [];
    const advIdsToDeduct = new Set();

    toProcess.forEach((emp) => {
      const existing = salaryHistory.find((s) => s.employeeId === emp.id && s.monthKey === monthKey);
      if (existing) return;

      const totalHours = getTotalHoursForPeriod(emp.id, monthKey);
      if (totalHours <= 0) return;

      const hourlyRate = emp.hourlyRate ?? Math.round((emp.baseSalary || 40000) / 176);
      const grossPay = Math.round(totalHours * hourlyRate);
      const pendingAdvances = advances.filter((a) => a.employeeId === emp.id && a.status === 'Pending');
      const advanceDeduction = pendingAdvances.reduce((sum, a) => sum + a.amount, 0);
      const netSalary = Math.max(0, grossPay - advanceDeduction);

      newRecords.push({
        id: generateId('sh'),
        employeeId: emp.id,
        employeeName: emp.name,
        monthKey,
        monthLabel,
        totalHours,
        amount: netSalary,
        status: 'Paid',
        date: payDateStr,
      });

      pendingAdvances.forEach((a) => advIdsToDeduct.add(a.id));
    });

    if (newRecords.length > 0) {
      setSalaryHistory((prev) => [...prev, ...newRecords]);
    }
    if (advIdsToDeduct.size > 0) {
      setAdvances((prev) =>
        prev.map((a) => (advIdsToDeduct.has(a.id) ? { ...a, status: 'Deducted' } : a))
      );
    }

    logActivity(`Payroll processed for ${monthLabel}: ${newRecords.length} employee(s), paid on ${payDateStr}`);
  }, [employees, advances, salaryHistory, getTotalHoursForPeriod, logActivity, refetch]);

  const getAttendanceForDate = useCallback((dateStr) => {
    return attendance.filter((a) => a.date === dateStr);
  }, [attendance]);

  const getAttendanceForMonth = useCallback((year, month) => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return attendance.filter((a) => a.date.startsWith(prefix));
  }, [attendance]);

  const getAttendanceByDayForMonth = useCallback((year, month, employeeId = null) => {
    let list = getAttendanceForMonth(year, month);
    if (employeeId) list = list.filter((a) => a.employeeId === employeeId);
    const map = {};
    list.forEach((a) => {
      const day = parseInt(a.date.split('-')[2], 10);
      map[day] = a;
    });
    return map;
  }, [getAttendanceForMonth]);

  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayAttendance = attendance.filter((a) => a.date === today);
    const present = todayAttendance.filter((a) => a.status === 'present').length;
    const leave = todayAttendance.filter((a) => a.status === 'leave').length;
    const late = todayAttendance.filter((a) => a.status === 'late').length;
    // Absent is anyone who is not present, late, or on leave
    const absent = employees.length - (present + late + leave);
    return { present, absent, leave, late, total: employees.length };
  }, [attendance, employees]);

  const getOvertimeThisWeek = useCallback(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startStr = startOfWeek.toISOString().slice(0, 10);
    return attendance
      .filter((a) => a.date >= startStr && (a.overtimeHours || 0) > 0)
      .map((a) => ({
        ...a,
        name: employees.find((e) => e.id === a.employeeId)?.name || 'Unknown',
      }))
      .sort((x, y) => y.date.localeCompare(x.date));
  }, [attendance, employees]);

  const getSalaryCalculation = useCallback((employeeId, totalHours, deductions) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return null;
    const hourlyRate = emp.hourlyRate ?? Math.round((emp.baseSalary || 40000) / 176);
    const grossPay = Math.round((totalHours || 0) * hourlyRate);
    const net = grossPay - (deductions || 0);
    return { totalHours: totalHours || 0, hourlyRate, grossPay, netSalary: Math.max(0, net) };
  }, [employees]);

  const getReportData = useCallback((reportType, monthKey, department, employeeId) => {
    const empList = department === 'all'
      ? employees
      : employees.filter((e) => e.department.toLowerCase() === department);
    const targetEmployees = employeeId === 'all' ? empList : empList.filter((e) => e.id === employeeId);

    if (reportType === 'attendance') {
      const monthAttendance = attendance.filter((a) => a.date.startsWith(monthKey));
      return targetEmployees.map((emp) => {
        const empAtt = monthAttendance.filter((a) => a.employeeId === emp.id);
        const present = empAtt.filter((a) => a.status === 'present' || a.status === 'late').length;
        const absent = empAtt.filter((a) => a.status === 'absent').length;
        const leave = empAtt.filter((a) => a.status === 'leave').length;
        const late = empAtt.filter((a) => a.status === 'late').length;
        const totalHours = empAtt.reduce((s, a) => {
          if (a.status === 'present' || a.status === 'late') {
            const hours = a.workedHours !== undefined && a.workedHours !== null ? a.workedHours : STANDARD_HOURS;
            return s + hours + (a.overtimeHours || 0);
          }
          return s;
        }, 0);
        return { employee: emp.name, present, absent, leave, late, totalHours, total: empAtt.length };
      });
    }

    if (reportType === 'overtime') {
      const monthAttendance = attendance.filter((a) => a.date.startsWith(monthKey));
      return targetEmployees.map((emp) => {
        const empAtt = monthAttendance.filter((a) => a.employeeId === emp.id);
        const totalWorkingHours = empAtt.reduce((s, a) => {
          if (a.status === 'present' || a.status === 'late') {
            const hours = a.workedHours !== undefined && a.workedHours !== null ? a.workedHours : STANDARD_HOURS;
            return s + hours + (a.overtimeHours || 0);
          }
          return s;
        }, 0);
        const overtimeHours = empAtt.reduce((s, a) => s + (a.overtimeHours || 0), 0);
        return { employee: emp.name, totalHours: totalWorkingHours, overtimeHours, entries: empAtt.length };
      });
    }

    if (reportType === 'salary') {
      return targetEmployees.map((emp) => {
        const existing = salaryHistory.find((s) => s.employeeId === emp.id && s.monthKey === monthKey);
        if (existing) return existing;

        const totalHours = getTotalHoursForPeriod(emp.id, monthKey);
        const pendingAdvances = advances.filter((a) => a.employeeId === emp.id && a.status === 'Pending');
        const advanceDeduction = pendingAdvances.reduce((sum, a) => sum + a.amount, 0);
        
        const calculation = getSalaryCalculation(emp.id, totalHours, advanceDeduction);
        return {
          id: `proj-${emp.id}-${monthKey}`,
          employeeId: emp.id,
          employeeName: emp.name,
          monthKey,
          totalHours,
          amount: calculation?.netSalary || 0,
          deductions: advanceDeduction,
          status: 'Projected',
          date: '-',
        };
      });
    }

    if (reportType === 'leave') {
      const monthAttendance = attendance.filter((a) => a.date.startsWith(monthKey) && a.status === 'leave');
      return targetEmployees.map((emp) => {
        const leaveDays = monthAttendance.filter((a) => a.employeeId === emp.id).length;
        return { employee: emp.name, leaveDays };
      });
    }

    return [];
  }, [employees, attendance, salaryHistory]);

  const getMonthlyReportSummary = useCallback((monthKey) => {
    const deptStats = {};
    const monthAttendance = attendance.filter((a) => a.date.startsWith(monthKey));
    const monthSalaries = salaryHistory.filter((s) => s.monthKey === monthKey);

    DEPARTMENTS.forEach((d) => {
      const deptEmps = employees.filter((e) => e.department === d.label);
      const empIds = deptEmps.map((e) => e.id);
      const att = monthAttendance.filter((a) => empIds.includes(a.employeeId));
      const present = att.filter((a) => a.status === 'present' || a.status === 'late').length;
      const totalDays = deptEmps.length * new Date(monthKey + '-01').getDate();
      const payroll = monthSalaries.filter((s) => empIds.includes(s.employeeId)).reduce((s, r) => s + r.amount, 0);
      deptStats[d.label] = {
        emp: deptEmps.length,
        att: totalDays > 0 ? Math.round((present / totalDays) * 100) + '%' : '0%',
        pay: `₹${(payroll / 100000).toFixed(1)}L`,
      };
    });

    const pendingAdvances = advances.filter((a) => a.status === 'Pending').reduce((s, a) => s + a.amount, 0);
    const totalPayroll = monthSalaries.reduce((s, r) => s + r.amount, 0);
    const avgAtt = employees.length > 0 && monthAttendance.length > 0
      ? Math.round((monthAttendance.filter((a) => a.status === 'present' || a.status === 'late').length / monthAttendance.length) * 100) + '%'
      : '0%';

    return {
      totalEmployees: employees.length,
      averageAttendance: avgAtt,
      totalPayroll: `₹${(totalPayroll / 100000).toFixed(1)}L`,
      pendingAdvances: `₹${pendingAdvances.toLocaleString()}`,
      deptStats,
    };
  }, [employees, attendance, salaryHistory, advances]);

  const value = useMemo(
    () => ({
      employees,
      attendance,
      salaryHistory,
      advances,
      activityLog,
      loading,
      apiError,
      refetch,
      DEPARTMENTS,
      STANDARD_HOURS,
      LABOUR_OVERTIME_DEFAULT,
      addEmployee,
      removeEmployee,
      markAttendance,
      addAdvance,
      processPayroll,
      getTotalHoursForPeriod,
      getAttendanceForDate,
      getAttendanceForMonth,
      getAttendanceByDayForMonth,
      getTodayStats,
      getOvertimeThisWeek,
      getSalaryCalculation,
      getReportData,
      getMonthlyReportSummary,
      logActivity,
    }),
    [
      employees,
      attendance,
      salaryHistory,
      advances,
      activityLog,
      loading,
      apiError,
      refetch,
      addEmployee,
      removeEmployee,
      markAttendance,
      addAdvance,
      processPayroll,
      getAttendanceForDate,
      getAttendanceForMonth,
      getAttendanceByDayForMonth,
      getTodayStats,
      getOvertimeThisWeek,
      getSalaryCalculation,
      getReportData,
      getMonthlyReportSummary,
      logActivity,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
