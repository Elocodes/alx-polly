'use client';

import { useEffect } from 'react';
import { useAuth } from './context/auth-context';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return <>{children}</>;
}
