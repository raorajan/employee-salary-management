import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../common/Modal';

export default function EmployeeList() {
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
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <h3 className="text-lg font-semibold dark:text-gray-100">Employee List</h3>
          <a href="#add-employee-form" className="text-sm px-4 py-2.5 sm:py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors min-h-[44px] sm:min-h-0 inline-flex items-center justify-center">Add Employee</a>
        </div>
        {employees.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">No employees yet. Add your first employee below.</div>
        ) : (
          <>
            <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {employees.map((emp) => (
                <div key={emp.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-200">{emp.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{emp.id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {emp.role} · {emp.department} · ₹{(emp.baseSalary || 0).toLocaleString()}/mo 
                        (₹{(() => {
                          const today = new Date();
                          const days = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                          return emp.baseSalary ? Math.round(emp.baseSalary / (days * 8)) : (emp.hourlyRate || 0);
                        })()}/hr)
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        emp.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {emp.status}
                      </span>
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
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Department</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold text-right">Status</th>
                    <th className="px-6 py-4 font-semibold w-12"></th>
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
                        <button
                          onClick={() => handleDelete(emp)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          aria-label="Remove employee"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
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
