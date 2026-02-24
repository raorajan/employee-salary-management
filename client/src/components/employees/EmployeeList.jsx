import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';

export default function EmployeeList({ onEdit }) {
  const { employees, removeEmployee } = useApp();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (emp) => setDeleteTarget(emp);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeEmployee(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">Employee List</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{employees.length} employee{employees.length !== 1 ? 's' : ''}</p>
          </div>
          <a 
            href="#add-employee-form" 
            className="text-sm px-4 py-2.5 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors min-h-[44px] sm:min-h-0 inline-flex items-center justify-center gap-1.5 font-medium shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">Add Employee</span>
            <span className="sm:hidden">Add</span>
          </a>
        </div>

        {/* Empty State */}
        {employees.length === 0 ? (
          <div className="p-10 sm:p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No employees yet. Add your first employee below.</p>
          </div>
        ) : (
          <>
            {/* ===== MOBILE CARD VIEW ===== */}
            <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {employees.map((emp) => {
                const hourlyRate = emp.baseSalary ? (Math.round((emp.baseSalary / 240) * 100) / 100) : (emp.hourlyRate || 0);
                return (
                  <div key={emp.id} className="p-4 active:bg-gray-50 dark:active:bg-gray-900/30 transition-colors">
                    {/* Top row: name + status */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{emp.name}</div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">{emp.id}</div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide shrink-0 ${
                        emp.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {emp.status}
                      </span>
                    </div>

                    {/* Info pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {emp.department}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {emp.role}
                      </span>
                    </div>

                    {/* Salary + Actions row */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/50">
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">₹{(emp.baseSalary || 0).toLocaleString()}</span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">/mo</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">(₹{hourlyRate}/hr)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(emp)}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                          aria-label="Edit employee"
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(emp)}
                          className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                          aria-label="Remove employee"
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== DESKTOP TABLE VIEW ===== */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Department</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold text-right">Status</th>
                    <th className="px-6 py-4 font-semibold w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">{emp.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{emp.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{emp.role}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          emp.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit(emp)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                            aria-label="Edit employee"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(emp)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            aria-label="Remove employee"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {deleteTarget && (
        <Modal
          title="Remove Employee"
          onClose={() => !deleting && setDeleteTarget(null)}
          onConfirm={confirmDelete}
          confirmLabel={deleting ? 'Removing...' : 'Remove'}
          confirmClass="bg-red-600 hover:bg-red-700"
        >
          Are you sure you want to remove <strong>{deleteTarget.name}</strong>? Attendance and advance records for this employee will also be removed.
        </Modal>
      )}
    </>
  );
}
