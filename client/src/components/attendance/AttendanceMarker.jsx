import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const STANDARD_HOURS = 8;
const LABOUR_OVERTIME_DEFAULT = 4;

export default function AttendanceMarker() {
  const { employees, markAttendance } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [status, setStatus] = useState('present');
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [workedHours, setWorkedHours] = useState(STANDARD_HOURS);
  const [message, setMessage] = useState('');

  const selectedEmp = employees.find((e) => e.id === selectedEmployee);
  const isLabour = selectedEmp?.department === 'Labour';
  const showOvertime = selectedEmployee && (status === 'present' || status === 'late');
  const showWorkedHours = selectedEmployee && status === 'late';

  useEffect(() => {
    if (showOvertime && isLabour) setOvertimeHours(LABOUR_OVERTIME_DEFAULT);
    else if (showOvertime && !isLabour) setOvertimeHours(0);
    
    // Reset worked hours to standard when switching away from late or changing employee
    if (!showWorkedHours) setWorkedHours(STANDARD_HOURS);
  }, [selectedEmployee, status, isLabour, showOvertime, showWorkedHours]);

  const handleMark = async () => {
    if (!selectedEmployee) {
      setMessage('Please select an employee');
      return;
    }
    try {
      const today = new Date().toISOString().slice(0, 10);
      await markAttendance(
        selectedEmployee,
        today,
        status,
        showOvertime ? overtimeHours : 0,
        showWorkedHours ? workedHours : null
      );
      setMessage('Attendance marked successfully');
      setSelectedEmployee('');
      setOvertimeHours(isLabour ? LABOUR_OVERTIME_DEFAULT : 0);
      setWorkedHours(STANDARD_HOURS);
    } catch {
      setMessage('Failed to mark attendance');
    }
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">Mark Attendance</h3>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base sm:text-sm"
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            {[
              { value: 'present', label: 'Present', color: 'border-green-500' },
              { value: 'absent', label: 'Absent', color: 'border-red-500' },
              { value: 'leave', label: 'Leave', color: 'border-amber-500' },
              { value: 'late', label: 'Late', color: 'border-orange-500' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all min-h-[44px] sm:min-h-0 ${
                  status === opt.value
                    ? `${opt.color} bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400`
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {showWorkedHours && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hours Worked (for Late status)
            </label>
            <input
              type="number"
              min={0}
              max={STANDARD_HOURS}
              step={0.5}
              value={workedHours}
              onChange={(e) => setWorkedHours(Math.max(0, Math.min(STANDARD_HOURS, Number(e.target.value) || 0)))}
              className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base sm:text-sm"
              placeholder="e.g. 6"
            />
          </div>
        )}
        {showOvertime && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Overtime (hours) {isLabour ? `— Labour default ${LABOUR_OVERTIME_DEFAULT}h` : ''}
            </label>
            <input
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(Math.max(0, Math.min(24, Number(e.target.value) || 0)))}
              className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base sm:text-sm"
            />
          </div>
        )}
        {message && (
          <p className={`text-sm ${message.includes('success') ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={handleMark}
          className="w-full py-3 sm:py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors min-h-[44px] sm:min-h-0"
        >
          Mark Attendance
        </button>
      </div>
    </div>
  );
}
