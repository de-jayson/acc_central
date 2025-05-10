
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccounts } from '@/contexts/AccountContext';
import { EditAccountForm } from '@/components/dashboard/EditAccountForm';
import type { BankAccount } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

export default function EditAccountPage() {
  const params = useParams();
  const router = useRouter();
  const { getAccountById, isLoading: accountsLoading } = useAccounts();
  const [account, setAccount] = useState<BankAccount | null | undefined>(undefined); // undefined for loading, null if not found

  const accountId = typeof params.accountId === 'string' ? params.accountId : undefined;

  useEffect(() => {
    if (accountId) {
      const foundAccount = getAccountById(accountId);
      setAccount(foundAccount);
    } else {
        // If no accountId, or invalid, redirect or show error.
        // For simplicity, we'll let the UI handle "not found" if account becomes null.
        // Consider redirecting if accountId is definitively missing/invalid.
        setAccount(null); 
    }
  }, [accountId, getAccountById]);

  if (accountsLoading || account === undefined) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-1/4 ml-auto" />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Account Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The account you are trying to edit does not exist or you do not have permission to edit it.
        </p>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  return <EditAccountForm initialData={account} />;
}
