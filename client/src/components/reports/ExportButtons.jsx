import React from 'react';

export default function ExportButtons() {
  const formats = [
    { label: 'PDF', icon: '📄', desc: 'Download as PDF' },
    { label: 'Excel', icon: '📊', desc: 'Export to .xlsx' },
    { label: 'CSV', icon: '📋', desc: 'Export to .csv' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold dark:text-gray-100">Export</h3>
      </div>
      <div className="p-4 sm:p-5 space-y-2">
        {formats.map((fmt) => (
          <button
            key={fmt.label}
            type="button"
            className="w-full flex items-center gap-3 p-3 sm:p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left min-h-[52px]"
          >
            <span className="text-xl">{fmt.icon}</span>
            <div>
              <div className="font-medium text-sm text-gray-900 dark:text-gray-200">{fmt.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{fmt.desc}</div>
            </div>
            <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
