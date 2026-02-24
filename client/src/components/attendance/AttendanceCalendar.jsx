import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AttendanceCalendar({ selectedDate, onDateSelect, selectedEmployee, onEmployeeSelect }) {
  const { employees, getAttendanceByDayForMonth } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const markedDates = getAttendanceByDayForMonth(year, month, selectedEmployee || null);

  const handleDayClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">Monthly Calendar</h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center"
              aria-label="Previous month"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[100px] sm:min-w-[120px] text-center">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center"
              aria-label="Next month"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        {employees.length > 0 && (
          <select
            value={selectedEmployee}
            onChange={(e) => onEmployeeSelect(e.target.value)}
            className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        )}
      </div>
      <div className="p-4 sm:p-6">
        {employees.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Add employees to view attendance calendar.</p>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
              {DAYS.map((d, i) => (
                <div key={d} className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                  <span className="hidden sm:inline">{d}</span>
                  <span className="sm:hidden">{DAYS_SHORT[i]}</span>
                </div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {days.map((day) => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const record = markedDates[day];
                const status = record?.status;
                const dotClass = status === 'present' ? 'bg-green-500' : status === 'absent' ? 'bg-red-500' : status === 'leave' ? 'bg-amber-500' : status === 'late' ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600';
                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 shadow-sm' 
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-200'}`}>{day}</span>
                    {status && (
                      <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${dotClass}`} title={status} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 sm:gap-6 text-xs">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Present</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> Absent</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> Leave</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500" /> Late</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
