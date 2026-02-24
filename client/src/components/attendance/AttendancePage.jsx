import React, { useState, useEffect } from 'react';
import AttendanceSummary from './AttendanceSummary';
import AttendanceCalendar from './AttendanceCalendar';
import AttendanceMarker from './AttendanceMarker';
import OvertimeTracker from './OvertimeTracker';

export default function AttendancePage() {
  const { employees } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]?.id || '');

  // Update selected employee if employees list changes (e.g. initial load)
  useEffect(() => {
    if (!selectedEmployee && employees.length > 0) {
      setSelectedEmployee(employees[0].id);
    }
  }, [employees, selectedEmployee]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Attendance</h1>
      </div>
      <AttendanceSummary />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <AttendanceCalendar 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
            selectedEmployee={selectedEmployee}
            onEmployeeSelect={setSelectedEmployee}
          />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <AttendanceMarker 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate}
            onDateReset={() => setSelectedDate(new Date().toISOString().slice(0, 10))} 
            selectedEmployee={selectedEmployee}
            onEmployeeSelect={setSelectedEmployee}
          />
          <OvertimeTracker />
        </div>
      </div>
    </div>
  );
}
