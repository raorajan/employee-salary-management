import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Dashboard() {
  const { employees, getTodayStats, salaryHistory, advances, activityLog } = useApp();
  const todayStats = getTodayStats();

  const pendingSalaries = employees.filter((emp) => {
    const monthKey = new Date().toISOString().slice(0, 7);
    const paid = salaryHistory.some((s) => s.employeeId === emp.id && s.monthKey === monthKey);
    return !paid;
  }).length;

  const stats = [
    { label: 'Total Employees', value: String(employees.length), color: 'bg-blue-500' },
    { label: 'Present Today', value: String(todayStats.present), color: 'bg-green-500' },
    { label: 'On Leave', value: String(todayStats.leave), color: 'bg-red-500' },
    { label: 'Pending Salaries', value: String(pendingSalaries), color: 'bg-amber-500' },
  ];

  const recentActivity = activityLog.slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold dark:text-white">{stat.value}</span>
              <div className={`h-2 w-2 rounded-full ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[280px] sm:min-h-[300px]">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Attendance Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Present</span>
              <span className="font-medium">{todayStats.present}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Absent</span>
              <span className="font-medium">{todayStats.absent}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">On Leave</span>
              <span className="font-medium">{todayStats.leave}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Late</span>
              <span className="font-medium">{todayStats.late}</span>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>{todayStats.total}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[280px] sm:min-h-[300px]">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
          ) : (
            <ul className="space-y-4">
              {recentActivity.map((item) => (
                <li key={item.id} className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 shrink-0">
                    {item.message?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-medium dark:text-gray-200">{item.message}</div>
                    <div className="text-gray-500 text-xs">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
