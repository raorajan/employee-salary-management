import React from 'react';
import { useApp } from '../../context/AppContext';

export default function OvertimeTracker() {
  const { getOvertimeThisWeek } = useApp();
  const overtimeEntries = getOvertimeThisWeek();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">Overtime This Week</h3>
      </div>
      <div className="p-4 sm:p-5">
        {overtimeEntries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No overtime records</p>
        ) : (
          <ul className="space-y-3">
            {overtimeEntries.map((entry, i) => (
              <li key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-200">{entry.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{entry.date}</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{entry.overtimeHours}h</span>
                  <span className="text-gray-500 dark:text-gray-400">1.5x</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
