import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="p-2 -ml-2 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-2xl font-semibold">AttendSalary</div>
            <div className="hidden sm:inline text-sm text-gray-500">Employee management</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="px-3 py-2 sm:py-1.5 rounded-md bg-indigo-600 text-white text-sm min-h-[36px] sm:min-h-0 hover:bg-indigo-700 active:bg-indigo-800 transition-colors">New</button>
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 hidden sm:block">
              {user?.email || user?.mobile || 'Admin'}
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              title="Logout"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
