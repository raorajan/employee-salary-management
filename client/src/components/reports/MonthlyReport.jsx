import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function MonthlyReport() {
  const { getMonthlyReportSummary } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const summary = getMonthlyReportSummary(selectedMonth);
  const monthLabel = new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const reportData = [
    { metric: 'Total Employees', value: String(summary.totalEmployees), change: '' },
    { metric: 'Average Attendance', value: summary.averageAttendance, change: '' },
    { metric: 'Total Payroll', value: summary.totalPayroll, change: '' },
    { metric: 'Pending Advances', value: summary.pendingAdvances, change: '' },
  ];

  const deptRows = [
    { dept: 'Engineering', ...summary.deptStats?.Engineering },
    { dept: 'Labour', ...summary.deptStats?.Labour },
    { dept: 'HR', ...summary.deptStats?.HR },
  ].filter((r) => r.emp !== undefined);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-lg font-semibold dark:text-gray-100">Monthly Summary ({monthLabel})</h3>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 text-sm"
        />
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {reportData.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {item.metric}
              </div>
              <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{item.value}</span>
                {item.change && (
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">{item.change}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[400px] text-left">
              <thead>
                <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="pb-2 font-semibold">Department</th>
                  <th className="pb-2 font-semibold text-right">Employees</th>
                  <th className="pb-2 font-semibold text-right">Attendance</th>
                  <th className="pb-2 font-semibold text-right">Payroll</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {deptRows.map((row, i) => (
                  <tr key={i} className="text-sm">
                    <td className="py-3 font-medium text-gray-900 dark:text-gray-200">{row.dept}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">{row.emp ?? 0}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">{row.att ?? '0%'}</td>
                    <td className="py-3 text-right font-medium text-indigo-600 dark:text-indigo-400">{row.pay ?? '₹0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
