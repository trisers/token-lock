"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BarChart2, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar: React.FC = () => {

  const { isOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed');
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  const navItems = [
    { icon: Home, name: 'Dashboard', href: '/dashboard' },
    { icon: BarChart2, name: 'Campaigns', href: '/campaign' },
    { icon: Settings, name: 'Settings', href: '/settings' },
    { icon: HelpCircle, name: 'How to use', href: '/help' },
  ];

  return (
    <div className={`flex flex-col bg-white text-gray-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} border-r`}>
      <div className="flex items-center gap-4 p-4 mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="36" viewBox="0 0 38 36" fill="none">
          <path d="M3.53306 1.00842C3.68975 0.844193 3.82459 0.72592 3.96019 0.725167C8.35059 0.715374 12.741 0.71688 17.2451 0.71688V7.63092H20.6472V24.7752H0.177734V7.65503H3.51196C3.51196 5.40559 3.51196 3.25785 3.53306 1.00842ZM6.95919 6.55969C6.9833 6.89567 7.00665 7.23166 7.03151 7.57518H13.7715V4.25827H6.95994V6.56044L6.95919 6.55969Z" fill="#4880FF" />
          <path d="M32.5922 35.1074H3.58008V28.2303H6.9128V31.6195H34.4236V7.65842H24.2408V4.25488H37.8444V35.1067C36.1291 35.1067 34.4198 35.1067 32.5922 35.1067V35.1074Z" fill="#4880FF" />
        </svg>
        {isOpen && <span className="font-bold">Tokenlock</span>}
      </div>
      <nav className="flex-grow mt-3">
        <ul className="space-y-2 mt-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center p-4 hover:bg-gray-100 hover:text-black ${
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
      <div className="mt-auto mb-4">
        <button
          onClick={handleLogout}
          className={`flex items-center p-4 hover:bg-gray-100 hover:text-black w-full ${
            isOpen ? 'justify-start space-x-4' : 'justify-center'
          }`}
        >
          <LogOut size={24} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;