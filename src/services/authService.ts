import type { User } from '@/types';
import { getItem, setItem, removeItem } from '@/lib/localStorageClient';
import { LOGGED_IN_USER_KEY, USERS_KEY } from '@/constants/storageKeys';

/**
 * Simulates signing up a new user.
 * In a real app, this would involve hashing passwords and a database.
 * For this app, we store user details (username only) in localStorage.
 * @param username The username for the new account.
 * @param password The password for the new account (simulated, not securely stored).
 * @returns A Promise that resolves to the new User object or throws an error.
 */
export async function signUp(username: string, password?: string): Promise<User> {
  // Password is not used for storage in this simplified example for security reasons.
  // We only demonstrate the flow.
  if (!username) {
    throw new Error('Username is required.');
  }

  const users = getItem<User[]>(USERS_KEY) || [];
  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    throw new Error('Username already exists.');
  }

  const newUser: User = { username };
  users.push(newUser);
  setItem(USERS_KEY, users);
  
  // Automatically log in the new user
  setItem(LOGGED_IN_USER_KEY, newUser);
  return newUser;
}

/**
 * Simulates logging in an existing user.
 * @param username The username to log in with.
 * @param password The password to log in with (simulated).
 * @returns A Promise that resolves to the User object or throws an error.
 */
export async function logIn(username: string, password?: string): Promise<User> {
  // Password is not used for validation in this simplified example.
  if (!username) {
    throw new Error('Username is required.');
  }

  const users = getItem<User[]>(USERS_KEY) || [];
  const user = users.find(u => u.username === username);

  if (!user) {
    throw new Error('Invalid username or password.'); // Generic error
  }

  // Simulate successful login
  setItem(LOGGED_IN_USER_KEY, user);
  return user;
}

/**
 * Logs out the current user by clearing their session from localStorage.
 * @returns A Promise that resolves when logout is complete.
 */
export async function logOut(): Promise<void> {
  removeItem(LOGGED_IN_USER_KEY);
}

/**
 * Retrieves the currently logged-in user from localStorage.
 * @returns The User object if logged in, otherwise null.
 */
export function getCurrentUser(): User | null {
  return getItem<User>(LOGGED_IN_USER_KEY);
}

/**
 * Checks if a user is currently authenticated.
 * @returns True if a user is logged in, false otherwise.
 */
export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}
