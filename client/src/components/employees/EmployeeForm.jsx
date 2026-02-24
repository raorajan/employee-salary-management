import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function EmployeeForm({ editingEmployee, onCancel }) {
  const { addEmployee, updateEmployee, DEPARTMENTS } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: '',
    address: '',
    hourlyRate: 0,
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name,
        email: editingEmployee.email || '',
        department: editingEmployee.department,
        role: editingEmployee.role,
        address: editingEmployee.address || '',
        hourlyRate: editingEmployee.baseSalary || 0,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        role: '',
        address: '',
        hourlyRate: 0,
      });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          department: formData.department,
          role: formData.role.trim() || '-',
          address: formData.address.trim(),
          hourlyRate: Number(formData.hourlyRate),
        });
        onCancel();
      } else {
        await addEmployee({
          name: formData.name.trim(),
          email: formData.email.trim(),
          department: formData.department,
          role: formData.role.trim() || '-',
          address: formData.address.trim(),
          hourlyRate: Number(formData.hourlyRate) || 150,
        });
      }
      setFormData({ name: '', email: '', department: 'Engineering', role: '', address: '', hourlyRate: 0 });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (editingEmployee) {
      onCancel();
    } else {
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        role: '',
        address: '',
        hourlyRate: 0,
      });
    }
  };

  return (
    <div id="add-employee-form" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden scroll-mt-20">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
        {editingEmployee && (
          <button 
            onClick={onCancel}
            className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline shrink-0 min-h-[36px] flex items-center"
          >
            Cancel Edit
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base sm:text-sm"
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base sm:text-sm"
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base sm:text-sm min-h-[44px] sm:min-h-0"
            >
              {DEPARTMENTS?.map((d) => (
                <option key={d.value} value={d.label}>{d.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base sm:text-sm"
              placeholder="Enter role"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Salary <span className="text-xs font-normal text-gray-400">(8hrs/day, e.g. 13000)</span></label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-base sm:text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base sm:text-sm"
            rows="3"
            placeholder="Enter full address"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors min-h-[44px] sm:min-h-0"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 sm:py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-md shadow-indigo-200 dark:shadow-none font-medium min-h-[44px] sm:min-h-0 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
