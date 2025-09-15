'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Define the user type, allowing it to be a Supabase user or null for unauthenticated state.
type User = SupabaseUser | null;

/**
 * @type AuthContextType
 * @description Defines the shape of the authentication context.
 * It includes the user's state, authentication functions (login, register, logout),
 * and a loading state to manage UI during async operations.
 */
type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

// Create a React context for authentication. It will hold the user session and auth methods.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @provider AuthProvider
 * @description This component provides the authentication context to its children.
 * It manages the user's authentication state, including fetching the current user,
 * and handling login, registration, and logout operations.
 * The state is shared across the application via the AuthContext.
 *
 * @param {{ children: ReactNode }} props - The props for the component.
 * @param {ReactNode} props.children - The child components that need access to the auth context.
 * @returns {JSX.Element} - The provider component that wraps the application.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetches the current user from Supabase on initial component mount.
    // This ensures the user state is initialized correctly.
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    fetchUser();

    // Sets up a listener for authentication state changes (e.g., login, logout).
    // This keeps the application's user state in sync with the Supabase auth state.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup function to unsubscribe from the auth listener when the component unmounts.
    // This is crucial to prevent memory leaks.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * @function login
   * @description Handles the user login process using email and password.
   * It communicates with Supabase to sign in the user.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // In a real-world app, you might want to show a user-friendly error message.
      console.error('Login failed:', error);
      throw error;
    }
    setIsLoading(false);
  };

  /**
   * @function register
   * @description Handles the user registration process.
   * It creates a new user in Supabase with the provided details.
   * @param {string} name - The user's full name.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    if (error) {
      console.error('Registration failed:', error);
      throw error;
    }
    setIsLoading(false);
  };

  /**
   * @function logout
   * @description Logs the user out of the application.
   * It clears the user's session in Supabase.
   */
  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
      throw error;
    }
    // After signing out, explicitly set the user to null.
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * @hook useAuth
 * @description A custom hook to easily access the authentication context.
 * It provides a convenient way for components to get the user's state and auth functions.
 * Throws an error if used outside of an AuthProvider, ensuring context is available.
 * @returns {AuthContextType} - The authentication context.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error is a safeguard to ensure the hook is used correctly within the component tree.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
