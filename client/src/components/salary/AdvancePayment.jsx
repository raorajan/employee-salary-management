import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdvancePayment() {
  const { employees, advances, requestAdvance } = useApp();
  const [amount, setAmount] = useState('');
  const [employee, setEmployee] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const handleRequest = async () => {
    if (!employee || !amount || Number(amount) <= 0) return;
    setSubmitting(true);
    try {
      await requestAdvance({ employeeId: employee, amount: Number(amount) });
      setAmount('');
      setEmployee('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">Advance Payment</h3>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
          <select
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min={1}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleRequest}
          disabled={!employee || !amount || Number(amount) <= 0 || submitting}
          className="w-full py-3 sm:py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors min-h-[44px] sm:min-h-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Request Advance'}
        </button>
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Advances</div>
          {advances.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No advances yet</p>
          ) : (
            <ul className="space-y-2">
              {advances.slice(0, 5).map((a) => (
                <li key={a.id} className="flex justify-between items-center text-sm p-2 rounded bg-gray-50 dark:bg-gray-900/50">
                  <span className="truncate">{a.employeeName}</span>
                  <span className="font-medium shrink-0">₹{a.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
