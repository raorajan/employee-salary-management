import React from 'react';
import { useApp } from '../../context/AppContext';

export default function AttendanceSummary() {
  const { getTodayStats } = useApp();
  const stats = getTodayStats();

  const items = [
    { label: 'Present Today', value: String(stats.present), color: 'bg-green-500' },
    { label: 'Absent', value: String(stats.absent), color: 'bg-red-500' },
    { label: 'On Leave', value: String(stats.leave), color: 'bg-amber-500' },
    { label: 'Late', value: String(stats.late), color: 'bg-orange-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{item.label}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold dark:text-white">{item.value}</span>
            <div className={`h-2 w-2 rounded-full shrink-0 ${item.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
