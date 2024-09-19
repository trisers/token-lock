// src/app/components/Header.tsx
import React from 'react';
import { Menu } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center p-4 border-b bg-gray-50">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold">
          {pathname === '/dashboard' ? 'Dashboard' :
           pathname === '/campaign' ? 'Campaigns' :
           pathname === '/settings' ? 'Settings' :
           pathname === '/help' ? 'How to use' :
           'Token Lock'}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="mr-2">🇺🇸</span>
          <span>English</span>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  );
};

export default Header;