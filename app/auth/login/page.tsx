'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import Link from 'next/link';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';

/**
 * @page LoginPage
 * @description This page provides a user interface for authentication.
 * It includes a form for users to enter their email and password to sign in.
 * It leverages the `useAuth` hook to access the login functionality and handles form submission.
 * Why: Centralizes the user login experience, providing a clear entry point for users.
 *
 * @returns {JSX.Element} - The rendered login form component.
 */
export default function LoginPage() {
  // State hooks for managing form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  /**
   * @function handleSubmit
   * @description Handles the form submission for the login page.
   * It prevents the default form submission, calls the login function from the AuthContext,
   * and redirects the user to the polls page upon successful authentication.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default browser form submission behavior.
    try {
      await login(email, password);
      // Redirect to the main polls page after a successful login.
      router.push('/polls');
    } catch (error) {
      // Basic error handling. In a production app, this should be more user-friendly.
      // For example, displaying a toast notification with the error message.
      console.error('Login failed:', error);
      // TODO: Handle login errors (e.g., show a notification to the user).
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium leading-none">
                    Password
                  </label>
                  {/* Link to a password reset page, a common feature in authentication flows. */}
                  <Link
                    href="/auth/reset-password"
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">
                Sign In
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-medium underline-offset-4 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
