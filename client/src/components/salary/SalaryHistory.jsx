import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';

const PAYMENT_DATES = [
  { value: '5', label: '5th' },
  { value: '10', label: '10th' },
  { value: '15', label: '15th' },
  { value: '20', label: '20th' },
];

export default function SalaryHistory() {
  const { employees, salaryHistory, processPayroll } = useApp();
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processMonth, setProcessMonth] = useState(new Date().toISOString().slice(0, 7));
  const [paymentDay, setPaymentDay] = useState('10');
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterMonth, setFilterMonth] = useState('');

  const filteredHistory = filterMonth 
    ? salaryHistory.filter(item => item.monthKey === filterMonth)
    : salaryHistory;

  const getPaymentDate = () => {
    if (useCustomDate) return customDate;
    const [y, m] = processMonth.split('-').map(Number);
    const day = Math.min(parseInt(paymentDay, 10), new Date(y, m, 0).getDate());
    return `${processMonth}-${String(day).padStart(2, '0')}`;
  };

  const [processing, setProcessing] = useState(false);
  const handleProcess = async () => {
    setProcessing(true);
    try {
      await processPayroll(processMonth, getPaymentDate());
      setShowProcessModal(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
            <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100 whitespace-nowrap">Salary History</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="flex-1 sm:w-40 px-3 py-2 sm:py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[40px] sm:min-h-0"
              />
              {filterMonth && (
                <button
                  onClick={() => setFilterMonth('')}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Clear filter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowProcessModal(true)}
            className="w-full md:w-auto text-sm px-4 py-2.5 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors min-h-[44px] sm:min-h-[40px] font-medium"
          >
            Process Payroll
          </button>
        </div>
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {filterMonth 
              ? `No salary records found for ${new Date(filterMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.`
              : 'No salary records yet. Process payroll to add records.'}
          </div>
        ) : (
          <>
            <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {filteredHistory.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-200">{item.monthLabel}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.employeeName}</div>
                      {item.totalHours != null && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.totalHours}h worked</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-indigo-600 dark:text-indigo-400">₹{item.amount.toLocaleString()}</div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {item.status}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Paid {item.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Month</th>
                    <th className="px-6 py-4 font-semibold">Employee</th>
                    <th className="px-6 py-4 font-semibold">Hours</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Paid On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">{item.monthLabel}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.employeeName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.totalHours ?? '-'}h</td>
                      <td className="px-6 py-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">₹{item.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {showProcessModal && (
        <Modal
          title="Process Payroll"
          onClose={() => setShowProcessModal(false)}
          onConfirm={handleProcess}
          confirmLabel={processing ? 'Processing...' : 'Process'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <input
                type="month"
                value={processMonth}
                onChange={(e) => setProcessMonth(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Date</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PAYMENT_DATES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => { setPaymentDay(d.value); setUseCustomDate(false); }}
                    className={`px-3 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors min-h-[40px] sm:min-h-0 ${
                      !useCustomDate && paymentDay === d.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setUseCustomDate(true)}
                  className={`px-3 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors min-h-[40px] sm:min-h-0 ${
                    useCustomDate ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Custom
                </button>
              </div>
              {useCustomDate && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 text-base sm:text-sm"
                />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Payment = Working Hours × Hourly Rate (8h/day + overtime). Labour defaults to 4h overtime/day.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
