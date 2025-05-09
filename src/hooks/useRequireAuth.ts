"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * A custom hook to protect routes that require authentication.
 * If the user is not authenticated and authentication is not loading,
 * it redirects them to the login page.
 * 
 * @param redirectUrl The URL to redirect to if not authenticated (default: '/login').
 * @returns The current authentication loading state.
 */
export function useRequireAuth(redirectUrl: string = '/login'): { isLoading: boolean } {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectUrl]);

  return { isLoading };
}
