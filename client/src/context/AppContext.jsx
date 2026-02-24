import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { api } from '../api/client';

const DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'labour', label: 'Labour' },
  { value: 'hr', label: 'HR' },
];

const STANDARD_HOURS = 8;

const AppContext = createContext(null);

let activityCounter = 0;

function generateEmployeeId() {
  return `EMP${Date.now().toString().slice(-3)}`;
}

const USE_API = import.meta.env.VITE_USE_API !== 'false';

export function AppProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(USE_API);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!USE_API) return;
    const fetchAll = async () => {
      try {
        setApiError(null);
        setLoading(true);
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
        const emp = await api.employees.create({
          ...data,
          hourlyRate: data.hourlyRate // This is actually the monthly salary from the form
        });
        await refetch();
        return emp.id || emp.employeeId;
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
    }
    const id = generateEmployeeId();
    const monthlySalary = Number(data.hourlyRate) || 0;
    const derivedRate = monthlySalary > 0 ? (monthlySalary / 240) : 150;
    const emp = { 
        id, 
        name: data.name, 
        department: data.department, 
        role: data.role || '-', 
        status: 'Active', 
        hourlyRate: derivedRate, 
        baseSalary: monthlySalary 
    };
    setEmployees((prev) => [...prev, emp]);
    logActivity(`New employee added: ${emp.name} (Monthly: ₹${monthlySalary})`);
    return id;
  }, [logActivity, refetch]);

  const removeEmployee = useCallback(async (id) => {
    if (USE_API) {
      try {
        await api.employees.remove(id);
        await refetch();
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
    } else {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      logActivity(`Employee removed: ${id}`);
    }
  }, [logActivity, refetch]);

  const updateEmployee = useCallback(async (id, data) => {
    if (USE_API) {
      try {
        await api.employees.update(id, data);
        await refetch();
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
    } else {
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
      logActivity(`Employee updated: ${data.name}`);
    }
  }, [logActivity, refetch]);

  const markAttendance = useCallback(async (employeeId, date, status, overtimeHours = 0, workedHours = null) => {
    const data = { employeeId, date, status, overtimeHours, workedHours };
    if (USE_API) {
      try {
        await api.attendance.mark(data);
        await refetch();
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
    } else {
      setAttendance((prev) => {
        const filtered = prev.filter((a) => !(a.employeeId === employeeId && a.date === date));
        return [...filtered, { ...data, paymentStatus: 'unpaid' }];
      });
      const emp = employees.find(e => e.id === employeeId);
      logActivity(`Attendance: ${emp?.name || employeeId} marked ${status}`);
    }
  }, [employees, logActivity, refetch]);

  const getTotalHoursForPeriod = useCallback((employeeId, monthKey) => {
    return attendance
      .filter((a) => a.employeeId === employeeId && a.date.startsWith(monthKey) && a.paymentStatus !== 'paid')
      .reduce((sum, a) => {
        if (a.status === 'present' || a.status === 'late') {
          const hours = a.workedHours !== undefined && a.workedHours !== null ? a.workedHours : STANDARD_HOURS;
          return sum + hours + (a.overtimeHours || 0);
        }
        return sum;
      }, 0);
  }, [attendance]);

  const processPayroll = useCallback(async (monthKey, paymentDate, employeeIds) => {
    if (USE_API) {
      try {
        await api.salary.process({ monthKey, paymentDate, employeeIds });
        await refetch();
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
    } else {
        // Offline logic
        const targetEmps = employeeIds ? employees.filter(e => employeeIds.includes(e.id)) : employees;
        const newRecords = [];
        targetEmps.forEach(emp => {
            const totalHours = getTotalHoursForPeriod(emp.id, monthKey);
            if (totalHours <= 0) return;

            const daysInMonth = new Date(monthKey.split('-')[0], monthKey.split('-')[1], 0).getDate();
            const hourlyRate = emp.baseSalary ? (emp.baseSalary / 240) : (emp.hourlyRate || 150);
            const grossPay = Math.round(totalHours * hourlyRate);
            
            const pendingAdvances = advances.filter(a => a.employeeId === emp.id && a.status === 'Pending');
            const deduction = pendingAdvances.reduce((s, a) => s + a.amount, 0);

            const record = {
                id: `sal-${Date.now()}-${emp.id}`,
                employeeId: emp.id,
                employeeName: emp.name,
                monthKey,
                monthLabel: new Date(monthKey + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
                totalHours,
                amount: Math.max(0, grossPay - deduction),
                status: 'Paid',
                date: paymentDate
            };
            newRecords.push(record);
        });

        if (newRecords.length > 0) {
            setSalaryHistory(prev => [...newRecords, ...prev]);
            // Mark attendance as paid
            const paidIds = newRecords.map(r => r.employeeId);
            setAttendance(prev => prev.map(a => 
                (paidIds.includes(a.employeeId) && a.date.startsWith(monthKey)) 
                ? { ...a, paymentStatus: 'paid' } 
                : a
            ));
            // Deduct advances
            setAdvances(prev => prev.map(a => 
                (paidIds.includes(a.employeeId) && a.status === 'Pending') 
                ? { ...a, status: 'Deducted' } 
                : a
            ));
            logActivity(`Payroll processed for ${newRecords.length} employees`);
        }
    }
  }, [employees, attendance, advances, getTotalHoursForPeriod, logActivity, refetch]);
  
  const getAttendanceByDayForMonth = useCallback((year, month, employeeId) => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const dayMap = {};
    
    attendance.forEach((a) => {
      if (a.date.startsWith(monthStr) && (!employeeId || a.employeeId === employeeId)) {
        const day = parseInt(a.date.split('-')[2], 10);
        dayMap[day] = a;
      }
    });
    
    return dayMap;
  }, [attendance]);

  const getOvertimeThisWeek = useCallback(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekRecords = attendance.filter(a => {
      const recordDate = new Date(a.date);
      return recordDate >= startOfWeek && a.overtimeHours > 0;
    });

    return weekRecords.map(a => {
      const emp = employees.find(e => e.id === a.employeeId);
      return {
        name: emp?.name || 'Unknown',
        date: new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        overtimeHours: a.overtimeHours
      };
    });
  }, [attendance, employees]);

  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayAtt = attendance.filter((a) => a.date === today);
    return {
      present: todayAtt.filter((a) => a.status === 'present').length,
      absent: todayAtt.filter((a) => a.status === 'absent').length,
      leave: todayAtt.filter((a) => a.status === 'leave').length,
      late: todayAtt.filter((a) => a.status === 'late').length,
      total: employees.length,
    };
  }, [attendance, employees]);

  const getSalaryCalculation = useCallback((employeeId, totalHours, deductions, customMonthKey) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return null;

    const monthKey = customMonthKey || new Date().toISOString().slice(0, 7);
    const daysInMonth = new Date(monthKey.split('-')[0], monthKey.split('-')[1], 0).getDate();
    
    let hourlyRate = emp.hourlyRate || 150;
    if (emp.baseSalary) {
      hourlyRate = emp.baseSalary / 240;
    }

    const grossPay = Math.round((totalHours || 0) * hourlyRate);
    const net = grossPay - (deductions || 0);
    return { 
        totalHours: totalHours || 0, 
        hourlyRate: Math.round(hourlyRate * 100) / 100, 
        grossPay, 
        netSalary: Math.max(0, net) 
    };
  }, [employees]);

  const requestAdvance = useCallback(async (data) => {
    if (USE_API) {
      await api.advances.create(data);
      await refetch();
    } else {
      const id = `adv-${Date.now()}`;
      const emp = employees.find(e => e.id === data.employeeId);
      setAdvances(prev => [{ ...data, id, employeeName: emp?.name, status: 'Pending' }, ...prev]);
      logActivity(`Advance requested: ₹${data.amount} for ${emp?.name}`);
    }
  }, [employees, logActivity, refetch]);

  const getReportData = useCallback((reportType, monthKey, department, employeeId) => {
    const targetEmployees = employees.filter((emp) => {
      const matchDept = department === 'all' || emp.department.toLowerCase() === department.toLowerCase();
      const matchEmp = employeeId === 'all' || emp.id === employeeId;
      return matchDept && matchEmp;
    });

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
  }, [employees, attendance, salaryHistory, advances, getTotalHoursForPeriod, getSalaryCalculation]);

  const getMonthlyReportSummary = useCallback((monthKey) => {
    const deptStats = {};
    const monthAttendance = attendance.filter((a) => a.date.startsWith(monthKey));
    const monthSalaries = salaryHistory.filter((s) => s.monthKey === monthKey);

    DEPARTMENTS?.forEach((d) => {
      const deptEmps = employees.filter((e) => e.department === d.label);
      const empIds = deptEmps.map((e) => e.id);
      const att = monthAttendance.filter((a) => empIds.includes(a.employeeId));
      const present = att.filter((a) => a.status === 'present' || a.status === 'late').length;
      const totalDays = deptEmps.length * 30; // Approximation
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

  const value = useMemo(() => ({
    employees,
    attendance,
    salaryHistory,
    advances,
    activityLog,
    loading,
    apiError,
    DEPARTMENTS,
    addEmployee,
    markAttendance,
    processPayroll,
    getSalaryCalculation,
    getTotalHoursForPeriod,
    requestAdvance,
    getReportData,
    getMonthlyReportSummary,
    getTodayStats,
    removeEmployee,
    updateEmployee,
    getAttendanceByDayForMonth,
    getOvertimeThisWeek,
    refetch
  }), [
    employees, attendance, salaryHistory, advances, activityLog, loading, apiError,
    addEmployee, markAttendance, processPayroll, getSalaryCalculation,
    getTotalHoursForPeriod, requestAdvance, getReportData, getMonthlyReportSummary, getTodayStats, removeEmployee, updateEmployee, getAttendanceByDayForMonth, getOvertimeThisWeek, refetch
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
