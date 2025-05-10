import type { User, BankAccount } from '@/types';
import { getItem, setItem, removeItem } from '@/lib/localStorageClient';
import { LOGGED_IN_USER_KEY, USERS_KEY, BANK_ACCOUNTS_KEY } from '@/constants/storageKeys';

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

  const newUser: User = { username, avatarDataUrl: undefined }; // Initialize avatarDataUrl
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

/**
 * Updates the username for the current user.
 * This also updates the userId for all associated bank accounts.
 * @param oldUsername The current username.
 * @param newUsername The new username.
 * @returns A Promise that resolves to the updated User object.
 */
export async function updateUsername(oldUsername: string, newUsername: string): Promise<User> {
  if (!newUsername || newUsername.trim().length < 3) {
    throw new Error("New username must be at least 3 characters.");
  }
  if (oldUsername === newUsername) {
    throw new Error("New username is the same as the current username.");
  }

  let users = getItem<User[]>(USERS_KEY) || [];
  const existingNewUser = users.find(u => u.username === newUsername);
  if (existingNewUser) {
    throw new Error("This username is already taken.");
  }

  const userIndex = users.findIndex(u => u.username === oldUsername);
  if (userIndex === -1) {
    throw new Error("Current user not found.");
  }

  // Preserve avatarDataUrl when updating username
  const currentAvatarDataUrl = users[userIndex].avatarDataUrl;
  users[userIndex].username = newUsername;
  // users[userIndex].avatarDataUrl remains currentAvatarDataUrl implicitly
  setItem(USERS_KEY, users);

  // Update logged-in user
  const loggedInUser = getCurrentUser();
  if (loggedInUser && loggedInUser.username === oldUsername) {
    loggedInUser.username = newUsername;
    // loggedInUser.avatarDataUrl remains the same
    setItem(LOGGED_IN_USER_KEY, loggedInUser);
  }

  // Update userId in bank accounts
  let bankAccounts = getItem<BankAccount[]>(BANK_ACCOUNTS_KEY) || [];
  bankAccounts = bankAccounts.map(account => {
    if (account.userId === oldUsername) {
      return { ...account, userId: newUsername };
    }
    return account;
  });
  setItem(BANK_ACCOUNTS_KEY, bankAccounts);

  return { username: newUsername, avatarDataUrl: currentAvatarDataUrl };
}

/**
 * Simulates updating the user's password.
 * In this demo, it does not actually store or change a password.
 * @param username The user's username.
 * @param newPassword The new password.
 * @returns A Promise that resolves when the "operation" is complete.
 */
export async function updatePassword(username: string, newPassword: string): Promise<void> {
  // This is a mock function for the demo.
  // In a real application, you would securely hash and store the new password
  // and potentially invalidate old sessions.
  if (!newPassword || newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }
  // No actual password change occurs in localStorage for this demo.
  return Promise.resolve();
}

/**
 * Updates the avatar for the current user.
 * @param username The username of the user.
 * @param avatarDataUrl The new avatar data URL.
 * @returns A Promise that resolves to the updated User object.
 */
export async function updateUserAvatar(username: string, avatarDataUrl: string): Promise<User> {
  let users = getItem<User[]>(USERS_KEY) || [];
  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    throw new Error("User not found.");
  }

  users[userIndex].avatarDataUrl = avatarDataUrl;
  setItem(USERS_KEY, users);

  const loggedInUser = getCurrentUser();
  if (loggedInUser && loggedInUser.username === username) {
    loggedInUser.avatarDataUrl = avatarDataUrl;
    setItem(LOGGED_IN_USER_KEY, loggedInUser);
    return loggedInUser;
  }
  // This case should ideally not happen if the logged-in user is the one being updated
  // but return the updated user from the list as a fallback.
  return users[userIndex];
}
