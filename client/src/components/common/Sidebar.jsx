import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen, closeSidebar }) {
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Employees', path: '/employees' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Salaries', path: '/salaries' },
    { name: 'Reports', path: '/reports' },
  ];
  
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity md:hidden z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
      />
      <aside className={`fixed md:sticky top-0 md:top-24 left-0 h-full md:h-fit w-72 sm:w-64 max-w-[85vw] md:max-w-none bg-white dark:bg-gray-800 border-r md:border border-gray-200 dark:border-gray-700 transition-transform duration-300 transform z-50 md:z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:block rounded-none md:rounded-2xl md:ml-0 overflow-hidden shadow-lg md:shadow-sm`}>
        <nav className="h-full p-4 md:p-4">
          <ul className="space-y-1 text-sm">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) => `
                    flex items-center py-3.5 px-4 md:py-2.5 md:px-3 rounded-xl transition-all duration-200 min-h-[44px] md:min-h-0
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 active:bg-gray-200 dark:active:bg-gray-800'}
                  `}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
