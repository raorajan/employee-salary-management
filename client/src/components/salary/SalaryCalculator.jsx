import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function SalaryCalculator() {
  const { employees, attendance, advances, getTotalHoursForPeriod, getSalaryCalculation } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [monthKey, setMonthKey] = useState(new Date().toISOString().slice(0, 7));
  const [totalHours, setTotalHours] = useState(0);
  const [deductions, setDeductions] = useState(0);

  const emp = employees.find((e) => e.id === selectedEmployee);
  const hoursFromAttendance = getTotalHoursForPeriod(selectedEmployee, monthKey);

  useEffect(() => {
    if (selectedEmployee) {
      setTotalHours(hoursFromAttendance);
      
      // Automatically factor in pending advances
      const pendingAdvances = advances.filter(a => a.employeeId === selectedEmployee && a.status === 'Pending');
      const advanceSum = pendingAdvances.reduce((sum, a) => sum + a.amount, 0);
      setDeductions(advanceSum);
    } else {
      setTotalHours(0);
      setDeductions(0);
    }
  }, [selectedEmployee, monthKey, hoursFromAttendance, advances]);

  const calc = selectedEmployee && emp
    ? getSalaryCalculation(selectedEmployee, totalHours, deductions)
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold dark:text-gray-100">Salary Calculator</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">8h standard + overtime per day. Payment = Hours × Rate</p>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
            <input
              type="month"
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.name} (₹{e.hourlyRate ?? Math.round((e.baseSalary || 40000) / 176)}/hr)</option>
              ))}
            </select>
          </div>
        </div>
        {selectedEmployee && emp && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Working Hours</label>
                <input
                  type="number"
                  value={totalHours}
                  onChange={(e) => setTotalHours(Math.max(0, Number(e.target.value) || 0))}
                  step={0.5}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deductions (₹)</label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 italic">Includes pending advances</p>
              </div>
            </div>
            {calc && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Hours × Rate (₹{calc.hourlyRate}/hr)</span>
                  <span className="font-medium">₹{calc.grossPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Deductions</span>
                  <span className="font-medium text-red-600">-₹{(deductions || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="font-semibold text-gray-900 dark:text-white">Net Pay</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₹{calc.netSalary.toLocaleString()}</span>
                </div>
              </div>
            )}
          </>
        )}
        {!selectedEmployee && employees.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Select an employee to calculate salary</p>
        )}
        {employees.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Add employees first</p>
        )}
      </div>
    </div>
  );
}
