"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, name: 'Dashboard', href: '/' },
    { icon: BarChart2, name: 'Campaigns', href: '/campaigns' },
    { icon: Settings, name: 'Settings', href: '/settings' },
    { icon: HelpCircle, name: 'How to use', href: '/help' },
    { icon: LogOut, name: 'Logout', href: '/logout' },
  ];

  return (
    <div className={`flex flex-col bg-white text-gray-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} border-r`}>
      <div className="flex items-center p-4 border-b mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded mr-2"></div>
        {isOpen && <span className="font-bold">Tokenlock</span>}
      </div>
      <nav className="flex-grow mt-10">
        <ul className="space-y-2 mt-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center p-4 hover:bg-gray-100 ${
                  isOpen ? 'justify-start space-x-4' : 'justify-center'
                } ${pathname === item.href ? 'bg-blue-600 text-white' : ''}`}
              >
                <item.icon size={24} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;