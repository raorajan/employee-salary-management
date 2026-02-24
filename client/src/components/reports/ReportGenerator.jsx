import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

const DEPARTMENTS = [
  { value: 'all', label: 'All Departments' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'labour', label: 'Labour' },
  { value: 'hr', label: 'HR' },
];

export default function ReportGenerator() {
  const { employees, getReportData } = useApp();
  const [reportType, setReportType] = useState('attendance');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [department, setDepartment] = useState('all');
  const [employee, setEmployee] = useState('all');
  const [generatedReport, setGeneratedReport] = useState(null);

  const filteredEmployees = useMemo(() => {
    if (department === 'all') return employees;
    return employees.filter((emp) => emp.department.toLowerCase() === department);
  }, [department, employees]);

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setEmployee('all');
  };

  const handleGenerate = () => {
    const data = getReportData(reportType, month, department, employee);
    setGeneratedReport({ type: reportType, month, department, employee, data });
  };

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report', desc: 'Daily attendance summary' },
    { value: 'salary', label: 'Salary Report', desc: 'Payroll and salary breakdown' },
    { value: 'leave', label: 'Leave Report', desc: 'Leave balances and history' },
    { value: 'overtime', label: 'Overtime Report', desc: 'Overtime hours and pay' },
  ];

  const monthLabel = new Date(month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold dark:text-gray-100">Generate Report</h3>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setReportType(type.value)}
                className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                  reportType === type.value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500'
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="font-medium text-sm text-gray-900 dark:text-gray-200">{type.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {DEPARTMENTS?.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
          <select
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">
              {department === 'all' ? 'All Employees' : `All in ${DEPARTMENTS.find((d) => d.value === department)?.label || department}`}
            </option>
            {filteredEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}{department === 'all' ? ` (${emp.department})` : ''}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Select an employee for an individual report, or &quot;All&quot; for department/company-wide
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors min-h-[44px]"
        >
          Generate Report
        </button>
        {generatedReport && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <h4 className="font-medium dark:text-gray-200 mb-3">{reportTypes.find((t) => t.value === generatedReport.type)?.label} - {monthLabel}</h4>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4 max-h-64 overflow-auto">
              {generatedReport.data?.length === 0 ? (
                <p className="text-sm text-gray-500">No data for this selection</p>
              ) : generatedReport.type === 'attendance' ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400">
                      <th className="pb-2">Employee</th>
                      <th className="pb-2">Present</th>
                      <th className="pb-2">Absent</th>
                      <th className="pb-2">Leave</th>
                      <th className="pb-2">Late</th>
                      <th className="pb-2">Total Hrs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {generatedReport.data?.map((row, i) => (
                      <tr key={i}>
                        <td className="py-2">{row.employee}</td>
                        <td className="py-2">{row.present}</td>
                        <td className="py-2">{row.absent}</td>
                        <td className="py-2">{row.leave}</td>
                        <td className="py-2">{row.late}</td>
                        <td className="py-2">{row.totalHours}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : generatedReport.type === 'overtime' ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400">
                      <th className="pb-2">Employee</th>
                      <th className="pb-2">Total Hours</th>
                      <th className="pb-2">OT Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {generatedReport.data?.map((row, i) => (
                      <tr key={i}>
                        <td className="py-2">{row.employee}</td>
                        <td className="py-2">{row.totalHours}h</td>
                        <td className="py-2">{row.overtimeHours}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : generatedReport.type === 'salary' ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400">
                      <th className="pb-2">Employee</th>
                      <th className="pb-2">Hours</th>
                      <th className="pb-2">Deductions</th>
                      <th className="pb-2">Net Pay</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {generatedReport.data?.map((row) => (
                      <tr key={row.id}>
                        <td className="py-2">{row.employeeName}</td>
                        <td className="py-2">{row.totalHours ?? '-'}h</td>
                        <td className="py-2 text-red-600 dark:text-red-400">
                          {row.deductions > 0 ? `-₹${row.deductions.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2 font-medium">₹{row.amount?.toLocaleString()}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            row.status === 'Paid' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : generatedReport.type === 'leave' ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400">
                      <th className="pb-2">Employee</th>
                      <th className="pb-2">Leave Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {generatedReport.data?.map((row, i) => (
                      <tr key={i}>
                        <td className="py-2">{row.employee}</td>
                        <td className="py-2">{row.leaveDays}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
