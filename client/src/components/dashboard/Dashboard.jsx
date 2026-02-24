import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Dashboard() {
  const { employees, getTodayStats, salaryHistory, advances, activityLog, getOvertimeThisWeek } = useApp();
  const todayStats = getTodayStats();

  const pendingSalaries = employees.filter((emp) => {
    const monthKey = new Date().toISOString().slice(0, 7);
    const paid = salaryHistory.some((s) => s.employeeId === emp.id && s.monthKey === monthKey);
    return !paid;
  }).length;

  const pendingAdvances = advances.filter(a => a.status === 'Pending');
  const totalPendingAmount = pendingAdvances.reduce((s, a) => s + a.amount, 0);

  const stats = [
    { 
      label: 'Employees', 
      value: employees.length, 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      label: 'Present', 
      value: todayStats.present, 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    { 
      label: 'On Leave', 
      value: todayStats.leave, 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-rose-500 to-rose-600',
      bgLight: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400'
    },
    { 
      label: 'Pending Pay', 
      value: pendingSalaries, 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
  ];

  const recentActivity = activityLog.slice(0, 6);
  const attendanceTotal = todayStats.present + todayStats.absent + todayStats.leave + todayStats.late;

  const attendanceRows = [
    { label: 'Present', count: todayStats.present, color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Absent', count: todayStats.absent, color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' },
    { label: 'On Leave', count: todayStats.leave, color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400' },
    { label: 'Late', count: todayStats.late, color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Title - mobile friendly */}
      <div className="flex items-center justify-between pt-2 sm:pt-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stat Cards - 2x2 grid on mobile, 4 col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3.5 sm:p-5 relative overflow-hidden"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${stat.bgLight} ${stat.textColor} flex items-center justify-center mb-2.5 sm:mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl sm:text-3xl font-bold dark:text-white leading-none">{stat.value}</div>
            <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</div>
            {/* Decorative gradient accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${stat.gradient} opacity-[0.04] rounded-bl-full`} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Attendance Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">Today's Attendance</h3>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
              {attendanceTotal}/{todayStats.total} marked
            </span>
          </div>
          <div className="p-4 sm:p-5">
            {/* Visual progress bar */}
            {attendanceTotal > 0 && (
              <div className="flex h-3 rounded-full overflow-hidden mb-5 bg-gray-100 dark:bg-gray-700">
                {attendanceRows.map((row, i) => (
                  row.count > 0 && (
                    <div 
                      key={i}
                      className={`${row.color} transition-all duration-500`}
                      style={{ width: `${(row.count / attendanceTotal) * 100}%` }}
                    />
                  )
                ))}
              </div>
            )}
            <div className="space-y-3">
              {attendanceRows.map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{row.label}</span>
                  </div>
                  <span className={`text-sm font-semibold ${row.textColor}`}>{row.count}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Employees</span>
                <span className="text-sm font-bold dark:text-white">{todayStats.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">No recent activity</div>
            ) : (
              recentActivity.map((item) => (
                <div key={item.id} className="px-4 sm:px-5 py-3 flex items-start gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
                    {item.message?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-snug break-words">{item.message}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString('en-IN', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      }) : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Info Row - Pending Advances */}
      {totalPendingAmount > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Pending Advances</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{pendingAdvances.length} advance(s) awaiting deduction</div>
              </div>
            </div>
            <div className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
              ₹{totalPendingAmount.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
