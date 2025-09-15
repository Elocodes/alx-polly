'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import Link from 'next/link';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';

/**
 * @page RegisterPage
 * @description This page provides a user interface for new user registration.
 * It includes a form for users to enter their name, email, and password to create an account.
 * It uses the `useAuth` hook for the registration logic and handles form validation and submission.
 * Why: Provides a seamless way for new users to join the platform.
 *
 * @returns {JSX.Element} - The rendered registration form component.
 */
export default function RegisterPage() {
  // State hooks for managing form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  /**
   * @function handleSubmit
   * @description Handles the form submission for the registration page.
   * It validates that the passwords match, calls the register function from the AuthContext,
   * and redirects the user to the polls page upon successful registration.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default browser form submission behavior.

    // Edge case: Check if the entered passwords match before proceeding.
    if (password !== confirmPassword) {
      // In a real app, this should be a more user-friendly error message.
      console.error('Passwords do not match');
      // TODO: Handle password mismatch error (e.g., show a notification).
      return;
    }

    try {
      await register(name, email, password);
      // Redirect to the main polls page after a successful registration.
      router.push('/polls');
    } catch (error) {
      // Basic error handling. Should be improved for production.
      console.error('Registration failed:', error);
      // TODO: Handle registration errors (e.g., show a notification for existing email).
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  autoCorrect="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">
                Create Account
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
