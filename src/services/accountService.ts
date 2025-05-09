import type { BankAccount } from '@/types';
import { getItem, setItem } from '@/lib/localStorageClient';
import { BANK_ACCOUNTS_KEY } from '@/constants/storageKeys';
import { getCurrentUser } from './authService';

/**
 * Retrieves all bank accounts for the current user from localStorage.
 * @returns A Promise that resolves to an array of BankAccount objects.
 */
export async function getAccounts(): Promise<BankAccount[]> {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  const allAccounts = getItem<BankAccount[]>(BANK_ACCOUNTS_KEY) || [];
  return allAccounts.filter(acc => acc.userId === currentUser.username);
}

/**
 * Adds a new bank account for the current user to localStorage.
 * @param accountData Partial data for the new bank account.
 * @returns A Promise that resolves to the newly created BankAccount object.
 */
export async function addAccount(accountData: Omit<BankAccount, 'id' | 'userId'>): Promise<BankAccount> {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('User not authenticated');

  const accounts = await getAccounts(); // Gets accounts for current user, but we need all to add
  const allAccounts = getItem<BankAccount[]>(BANK_ACCOUNTS_KEY) || [];


  const newAccount: BankAccount = {
    ...accountData,
    id: Date.now().toString(), // Simple unique ID
    userId: currentUser.username,
  };

  allAccounts.push(newAccount);
  setItem(BANK_ACCOUNTS_KEY, allAccounts);
  return newAccount;
}

/**
 * Updates an existing bank account in localStorage.
 * @param accountId The ID of the account to update.
 * @param updates Partial data containing the updates for the account.
 * @returns A Promise that resolves to the updated BankAccount object or throws an error if not found.
 */
export async function updateAccount(accountId: string, updates: Partial<BankAccount>): Promise<BankAccount> {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('User not authenticated');
  
  const allAccounts = getItem<BankAccount[]>(BANK_ACCOUNTS_KEY) || [];
  const accountIndex = allAccounts.findIndex(acc => acc.id === accountId && acc.userId === currentUser.username);

  if (accountIndex === -1) {
    throw new Error('Account not found or not owned by user.');
  }

  allAccounts[accountIndex] = { ...allAccounts[accountIndex], ...updates };
  setItem(BANK_ACCOUNTS_KEY, allAccounts);
  return allAccounts[accountIndex];
}

/**
 * Deletes a bank account from localStorage.
 * @param accountId The ID of the account to delete.
 * @returns A Promise that resolves when the account is deleted or throws an error if not found.
 */
export async function deleteAccount(accountId: string): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('User not authenticated');

  let allAccounts = getItem<BankAccount[]>(BANK_ACCOUNTS_KEY) || [];
  const initialLength = allAccounts.length;
  allAccounts = allAccounts.filter(acc => !(acc.id === accountId && acc.userId === currentUser.username));

  if (allAccounts.length === initialLength) {
    throw new Error('Account not found or not owned by user.');
  }
  
  setItem(BANK_ACCOUNTS_KEY, allAccounts);
}
