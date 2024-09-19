// components/RouteGuard.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const checkAuth = async () => {
  try {
    const response = await fetch('/api/check-auth', {
      method: 'GET',
      credentials: 'include', 
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking auth:', error);
    return false;
  }
};

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(pathname);
    
    const authCheck = async () => {
      if (isPublicRoute) {
        setAuthorized(true);
        return;
      }

      const isAuth = await checkAuth();
      if (isAuth) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.push('/login?redirect=' + encodeURIComponent(pathname));
      }
    };

    authCheck();
  }, [pathname, router]);

  return authorized ? <>{children}</> : null;
};

export default RouteGuard;