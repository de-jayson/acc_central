"use client";

import { AccountCard } from "@/components/dashboard/AccountCard";
import { Button } from "@/components/ui/button";
import { useAccounts } from "@/contexts/AccountContext";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultCountry } from "@/constants/countries";

export default function DashboardPage() {
  const { user } = useAuth();
  const { accounts, isLoading: accountsLoading, fetchAccounts } = useAccounts();

  // Calculate total balance only for USD accounts for simplicity
  const usdAccounts = accounts.filter(acc => (acc.currencyCode || defaultCountry.currencyCode) === 'USD');
  const totalUsdBalance = usdAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const hasOnlyUsdAccounts = accounts.every(acc => (acc.currencyCode || defaultCountry.currencyCode) === 'USD');
  const hasMixedCurrencies = accounts.length > 0 && !hasOnlyUsdAccounts;

  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
     try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
    } catch (error) {
      console.warn(`Invalid currency code: ${currencyCode} in DashboardPage. Defaulting to USD display.`);
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: defaultCountry.currencyCode }).format(amount);
    }
  };
  
  const handleEditAccount = (account: any) => {
    console.log("Editing account:", account);
    alert(`Edit functionality for "${account.accountName}" is not yet implemented.`);
  };

  if (accountsLoading && accounts.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Welcome, {user?.username || "User"}!</h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your accounts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/dashboard/add-account">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Account
            </Link>
          </Button>
          <Button variant="outline" onClick={fetchAccounts} disabled={accountsLoading} aria-label="Refresh accounts">
            <RefreshCw className={`h-5 w-5 ${accountsLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {accounts.length > 0 && (
         <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-primary mb-1">
              {hasOnlyUsdAccounts ? "Total Portfolio Value" : "Total USD Portfolio Value"}
            </h2>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(totalUsdBalance, 'USD')}</p>
            <p className="text-sm text-muted-foreground">
              {accounts.length} account(s) managed.
              {hasMixedCurrencies && " Showing sum for USD accounts only."}
              {accounts.length > 0 && usdAccounts.length === 0 && !hasOnlyUsdAccounts && " No USD accounts to summarize."}
            </p>
        </div>
      )}

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} onEdit={handleEditAccount} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow">
          <img src="https://picsum.photos/seed/emptyState/300/200" alt="No accounts" data-ai-hint="empty state illustration" className="mx-auto mb-6 rounded-md" />
          <h2 className="text-2xl font-semibold text-primary mb-2">No Accounts Yet</h2>
          <p className="text-muted-foreground mb-6">
            Get started by adding your first bank account.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/dashboard/add-account">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Account
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card p-4 rounded-lg shadow space-y-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-end gap-2 pt-2 border-t">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
