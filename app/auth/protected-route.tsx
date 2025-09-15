'use client';

import { useEffect } from 'react';
import { useAuth } from './context/auth-context';
import { useRouter } from 'next/navigation';

/**
 * @component ProtectedRoute
 * @description A client-side component that guards routes requiring authentication.
 * It checks for an active user session and redirects to the login page if the user is not authenticated.
 * This is essential for securing parts of the application that should only be accessible to logged-in users.
 *
 * @param {{ children: React.ReactNode }} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to render if the user is authenticated.
 * @returns {JSX.Element | null} - It renders a loading state, the children components, or nothing while redirecting.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page if the user is not authenticated and the loading process is complete.
    // This effect runs whenever the loading state or user object changes.
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  // While the authentication status is loading, or if there's no user,
  // display a loading message. This prevents a flash of content for unauthenticated users.
  if (isLoading || !user) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  // If the user is authenticated, render the protected content.
  return <>{children}</>;
}
