// Using 'use client' for context providers that interact with localStorage and manage state.
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  signUp as signUpService,
  logIn as logInService,
  logOut as logOutService,
  getCurrentUser as getCurrentUserService,
  isAuthenticated as isAuthenticatedService,
  updateUsername as updateUsernameService,
  updatePassword as updatePasswordService,
  updateUserAvatar as updateUserAvatarService, // Import new service
} from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (username: string, password?: string) => Promise<User | void>;
  logIn: (username: string, password?: string) => Promise<User | void>;
  logOut: () => Promise<void>;
  updateUsername: (newUsername: string) => Promise<User | void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateAvatar: (avatarDataUrl: string) => Promise<User | void>; // Add new method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect runs only on the client after hydration
    const initializeAuth = () => {
      const currentUser = getCurrentUserService();
      setUser(currentUser);
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const signUp = async (username: string, password?: string) => {
    try {
      setIsLoading(true);
      const newUser = await signUpService(username, password);
      setUser(newUser);
      router.push('/dashboard'); // Redirect to dashboard after signup
      return newUser;
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error; // Rethrow to be caught by the form
    } finally {
      setIsLoading(false);
    }
  };

  const logIn = async (username: string, password?: string) => {
    try {
      setIsLoading(true);
      const loggedInUser = await logInService(username, password);
      setUser(loggedInUser);
      router.push('/dashboard'); // Redirect to dashboard after login
      return loggedInUser;
    } catch (error) {
      console.error("Log in failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    try {
      setIsLoading(true);
      await logOutService();
      setUser(null);
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Log out failed:", error);
      // Handle logout error if necessary
    } finally {
      setIsLoading(false);
    }
  };

  const updateUsername = useCallback(async (newUsername: string) => {
    if (!user) throw new Error("User not authenticated");
    setIsLoading(true);
    try {
      const updatedUser = await updateUsernameService(user.username, newUsername);
      setUser(updatedUser); // Update context state
      return updatedUser;
    } catch (error) {
      console.error("Update username failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    // currentPassword is not used in the mock service
    if (!user) throw new Error("User not authenticated");
    setIsLoading(true);
    try {
      await updatePasswordService(user.username, newPassword);
      // No user state change needed as password isn't stored in context
    } catch (error) {
      console.error("Update password failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateAvatar = useCallback(async (avatarDataUrl: string) => {
    if (!user) throw new Error("User not authenticated");
    setIsLoading(true);
    try {
      const updatedUser = await updateUserAvatarService(user.username, avatarDataUrl);
      setUser(updatedUser); // Update context state with the new avatar URL
      return updatedUser;
    } catch (error) {
      console.error("Update avatar failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);


  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user && isAuthenticatedService(), 
      isLoading, 
      signUp, 
      logIn, 
      logOut,
      updateUsername,
      updatePassword,
      updateAvatar // Provide new method
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
