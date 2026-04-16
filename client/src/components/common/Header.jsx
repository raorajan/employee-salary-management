import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import WhatsAppManager from './WhatsAppManager';

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
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
              <div className="text-2xl font-semibold">RanjitEnterprises</div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 hidden sm:block">
                {user?.email || user?.mobile || 'Admin'}
              </div>

              <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />

              <button 
                onClick={() => setShowWhatsApp(true)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600 dark:text-green-400"
                title="WhatsApp Status"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.341-4.444 9.814-9.885 9.815M12 2C6.41 2 2.01 6.36 2 11.83a10.03 10.03 0 001.53 5.37L2 22l4.89-1.28a9.8 9.8 0 005.11 1.43c5.526 0 9.998-4.464 10-10 .002-2.712-1.05-5.263-2.96-7.17C17.13 3.06 14.58 2 12 2z" />
                </svg>
              </button>

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
      {showWhatsApp && <WhatsAppManager onClose={() => setShowWhatsApp(false)} />}
    </>
  );
}
