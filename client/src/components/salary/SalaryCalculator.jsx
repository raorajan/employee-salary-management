import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function SalaryCalculator() {
  const { employees, attendance, advances, salaryHistory, getTotalHoursForPeriod, getSalaryCalculation, processPayroll } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [monthKey, setMonthKey] = useState(new Date().toISOString().slice(0, 7));
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalHours, setTotalHours] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [processing, setProcessing] = useState(false);

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
    ? getSalaryCalculation(selectedEmployee, totalHours, deductions, monthKey)
    : null;

  const hasExistingPayment = useMemo(() => {
    return salaryHistory.some(s => s.employeeId === selectedEmployee && s.monthKey === monthKey);
  }, [salaryHistory, selectedEmployee, monthKey]);

  const handleProcess = async () => {
    if (!selectedEmployee || !calc) return;
    setProcessing(true);
    try {
      await processPayroll(monthKey, paymentDate, [selectedEmployee]);
      setSelectedEmployee('');
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">Salary Calculator</h3>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Payment = (Normal + OT Hours) × Hourly Rate. Rate = Salary / 240</p>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
            <input
              type="month"
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-base sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-base sm:text-sm"
            >
              <option value="">Select employee</option>
              {employees.map((e) => {
                const derivedRate = e.baseSalary ? (e.baseSalary / 240) : (e.hourlyRate || 0);
                const displayRate = Math.round(derivedRate * 100) / 100;
                return (
                  <option key={e.id} value={e.id}>
                    {e.name} (₹{(e.baseSalary || 0).toLocaleString()}/mo · ₹{displayRate}/hr)
                  </option>
                );
              })}
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-base sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deductions (₹)</label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-base sm:text-sm"
                />
                <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 italic">Includes pending advances</p>
              </div>
            </div>
            {calc && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Hours × Rate (₹{calc.hourlyRate}/hr)</span>
                  <span className="font-semibold">₹{calc.grossPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 text-xs sm:text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Deductions</span>
                  <span className="font-medium text-red-500">
                    {deductions > 0 ? `-₹${deductions.toLocaleString()}` : '₹0'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">Net Payable</span>
                  <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    ₹{calc.netSalary.toLocaleString()}
                  </span>
                </div>
                
                {calc.netSalary > 0 && !hasExistingPayment ? (
                  <div className="mt-5 sm:mt-6 p-3.5 sm:p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 mb-1">Payment Date</label>
                        <input
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          className="w-full px-3 py-2.5 sm:py-2 bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        />
                      </div>
                      <button
                        onClick={handleProcess}
                        disabled={processing}
                        className="sm:flex-[2] h-[44px] sm:h-[42px] px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <>
                            <span>Process Payroll</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/50 flex items-center gap-3 text-green-700 dark:text-green-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold italic">Payroll already settled for this period</span>
                  </div>
                )}
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
