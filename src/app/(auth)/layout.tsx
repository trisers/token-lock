// src/app/(auth)/layout.tsx

import AuthenticatedLayout from '../components/AuthenticatedLayout';
import RouteGuard from '../components/RouteGuard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </RouteGuard>
  );
}
