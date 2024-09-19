"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarProvider } from "../contexts/SidebarContext";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isPublicRoute) {
        setIsAuthenticated(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/check-auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [pathname, isPublicRoute]);

  useEffect(() => {
    if (!isLoading && isAuthenticated === false && !isPublicRoute) {
      router.push('/login?redirect=' + encodeURIComponent(pathname));
    }
  }, [isLoading, isAuthenticated, isPublicRoute, pathname, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}