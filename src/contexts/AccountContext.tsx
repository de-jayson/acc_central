// Using 'use client' for context providers that interact with localStorage and manage state.
"use client";

import type { BankAccount } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getAccounts as getAccountsService,
  addAccount as addAccountService,
  updateAccount as updateAccountService,
  deleteAccount as deleteAccountService,
} from '@/services/accountService';
import { useAuth } from './AuthContext';

interface AccountContextType {
  accounts: BankAccount[];
  isLoading: boolean;
  fetchAccounts: () => Promise<void>;
  addAccount: (accountData: Omit<BankAccount, 'id' | 'userId'>) => Promise<BankAccount | void>;
  updateAccount: (accountId: string, updates: Partial<BankAccount>) => Promise<BankAccount | void>;
  deleteAccount: (accountId: string) => Promise<void>;
  getAccountById: (accountId: string) => BankAccount | undefined;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authIsLoading } = useAuth();

  const fetchAccounts = useCallback(async () => {
    if (!user) {
      setAccounts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userAccounts = await getAccountsService();
      setAccounts(userAccounts);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      setAccounts([]); // Reset accounts on error
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Fetch accounts when user is authenticated and auth loading is complete
    if (!authIsLoading) {
        fetchAccounts();
    }
  }, [user, authIsLoading, fetchAccounts]);

  const addAccount = async (accountData: Omit<BankAccount, 'id' | 'userId'>) => {
    setIsLoading(true);
    try {
      const newAccount = await addAccountService(accountData);
      if (newAccount) {
        setAccounts(prev => [...prev, newAccount]);
        return newAccount;
      }
    } catch (error) {
      console.error("Failed to add account:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccount = async (accountId: string, updates: Partial<BankAccount>) => {
    setIsLoading(true);
    try {
      const updatedAccount = await updateAccountService(accountId, updates);
      if (updatedAccount) {
        setAccounts(prev => prev.map(acc => acc.id === accountId ? updatedAccount : acc));
        return updatedAccount;
      }
    } catch (error) {
      console.error("Failed to update account:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAccount = async (accountId: string) => {
    setIsLoading(true);
    try {
      await deleteAccountService(accountId);
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } catch (error) {
      console.error("Failed to delete account:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountById = (accountId: string) => {
    return accounts.find(acc => acc.id === accountId);
  };


  return (
    <AccountContext.Provider value={{ accounts, isLoading, fetchAccounts, addAccount, updateAccount, deleteAccount, getAccountById }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccounts = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
};
