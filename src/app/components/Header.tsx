// src/app/components/Header.tsx

import React, { useState, useEffect } from 'react';
import { Menu, User, X } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const { toggleSidebar, isOpen } = useSidebar();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('/api/check-auth');
        if (response.ok) {
          const data = await response.json();
          if (data.username) {
            setUsername(data.username);
          }
        }
      } catch (error) {
        console.error('Error fetching authentication status:', error);
      }
    };

    fetchUsername();
  }, []);

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <header className="flex justify-between items-center p-4 border-b bg-gray-50">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4">
          {isOpen ? <Menu size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-semibold">
          {pathname === '/dashboard' ? 'Dashboard' :
           pathname === '/campaign' ? 'Campaigns' :
           pathname === '/settings' ? 'Settings' :
           pathname === '/howtouse' ? 'How to use' :
           pathname === '/purchaseLimit' ? 'Purchase Limit' :
           pathname === '/PurchaseHistory' ? 'Purchase History' :
           'Token Lock'}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="mr-2">🇺🇸</span>
          <span>English</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full mr-2 flex items-center justify-center">
            {username ? (
              <span className="text-white font-bold">{getInitial(username)}</span>
            ) : (
              <User size={20} className="text-white" />
            )}
          </div>
          {username && <span>{username}</span>}
        </div>
      </div>
    </header>
  );
};

export default Header;