import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import EmployeeList from './components/employees/EmployeeList'
import EmployeeForm from './components/employees/EmployeeForm'
import AttendancePage from './components/attendance/AttendancePage'
import SalariesPage from './components/salary/SalariesPage'
import ReportsPage from './components/reports/ReportsPage'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading, apiError } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex pt-0 md:pt-6 relative px-3 sm:px-4 md:px-6 gap-4 md:gap-6 min-h-0">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
        <main className="flex-1 min-w-0 w-full overflow-x-hidden pb-6 sm:pb-8 md:pb-12 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-30">
              <div className="text-indigo-600 dark:text-indigo-400 font-medium">Loading...</div>
            </div>
          )}
          {apiError && (
            <div className="mx-4 mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              Backend error: {apiError}. Make sure the server is running on port 4000.
            </div>
          )}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={
              <div className="space-y-4 sm:space-y-6">
                <EmployeeList />
                <EmployeeForm />
              </div>
            } />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/salaries" element={<SalariesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
