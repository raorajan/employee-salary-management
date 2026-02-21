import React from 'react';
import ReportGenerator from './ReportGenerator';
import MonthlyReport from './MonthlyReport';
import ExportButtons from './ExportButtons';

export default function ReportsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Reports</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <ReportGenerator />
        </div>
        <div>
          <ExportButtons />
        </div>
      </div>
      <MonthlyReport />
    </div>
  );
}
