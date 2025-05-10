import type { BankAccount } from '@/types';
import { getItem, setItem } from '@/lib/localStorageClient';
import { BANK_ACCOUNTS_KEY } from '@/constants/storageKeys';
import { getCurrentUser } from './authService';
import { defaultCountry } from '@/constants/countries'; // defaultCountry is now Ghana (GHS)

/**
 * Retrieves all bank accounts for the current user from localStorage.
 * @returns A Promise that resolves to an array of BankAccount objects.
 */
export async function getAccounts(): Promise<BankAccount[]> {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  const allAccounts = getItem<BankAccount[]>(BANK_ACCOUNTS_KEY) || [];
  return allAccounts.filter(acc => acc.userId === currentUser.username)
    .map(acc => ({
      ...acc, 
      currencyCode: acc.currencyCode || defaultCountry.currencyCode, 
      country: acc.country || defaultCountry.code, // Default country if missing
    }));
}

/**
 * Adds a new bank account for the current user to localStorage.
 * @param accountData Partial data for the new bank account. Currency is GHS. Country is Ghana.
 * @returns A Promise that resolves to the newly created BankAccount object.
 */
export async function addAccount(accountData: Omit<BankAccount, 'id' | 'userId' | 'currencyCode' | 'country'> & Partial<Pick<BankAccount, 'currencyCode' | 'country'>>): Promise<BankAccount> {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('User not authenticated');

  const allAccounts = getItem<BankAccount[]>(BANK_ACCOUNTS_KEY) || [];

  const newAccount: BankAccount = {
    id: Date.now().toString(), // Simple unique ID
    userId: currentUser.username,
    ...accountData,
    currencyCode: defaultCountry.currencyCode, // Always GHS
    country: defaultCountry.code, // Always Ghana
  };

  allAccounts.push(newAccount);
  setItem(BANK_ACCOUNTS_KEY, allAccounts);
  return newAccount;
}

/**
 * Updates an existing bank account in localStorage.
 * @param accountId The ID of the account to update.
 * @param updates Partial data containing the updates for the account. Currency remains GHS.
 * @returns A Promise that resolves to the updated BankAccount object or throws an error if not found.
 */
export async function updateAccount(accountId: string, updates: Partial<Omit<BankAccount, 'currencyCode' | 'country'>>): Promise<BankAccount> {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('User not authenticated');
  
  const allAccounts = getItem<BankAccount[]>(BANK_ACCOUNTS_KEY) || [];
  const accountIndex = allAccounts.findIndex(acc => acc.id === accountId && acc.userId === currentUser.username);

  if (accountIndex === -1) {
    throw new Error('Account not found or not owned by user.');
  }

  allAccounts[accountIndex] = { 
    ...allAccounts[accountIndex], 
    ...updates,
    currencyCode: defaultCountry.currencyCode, // Ensure currencyCode remains GHS
    country: allAccounts[accountIndex].country || defaultCountry.code, // Ensure country remains or defaults
  };
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
