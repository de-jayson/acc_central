import type { BankAccount } from "@/types";
import { AccountType } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Landmark, CreditCard, TrendingUp, LandmarkIcon, PiggyBank, Home, HandCoins, FileQuestion, Edit3, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccounts } from "@/contexts/AccountContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react"; 
import { defaultCountry } from "@/constants/countries"; // defaultCountry is now Ghana (GHS)

interface AccountCardProps {
  account: BankAccount;
  onEdit?: (account: BankAccount) => void;
}

const accountTypeIcons: Record<AccountType, React.ElementType> = {
  [AccountType.CHECKING]: Landmark,
  [AccountType.SAVINGS]: PiggyBank,
  [AccountType.CREDIT_CARD]: CreditCard,
  [AccountType.INVESTMENT]: TrendingUp,
  [AccountType.LOAN]: HandCoins,
  [AccountType.MORTGAGE]: Home,
  [AccountType.OTHER]: FileQuestion,
};

export const AccountCard = React.memo(function AccountCardComponent({ account, onEdit }: AccountCardProps) {
  const { toast } = useToast();
  const { deleteAccount: deleteAccountContext, isLoading } = useAccounts();

  const IconComponent = accountTypeIcons[account.accountType] || LandmarkIcon;

  const formatCurrency = (amount: number, currencyCode: string = defaultCountry.currencyCode) => {
    const effectiveCurrencyCode = currencyCode || defaultCountry.currencyCode;
    const locale = effectiveCurrencyCode === "GHS" ? 'en-GH' : 'en-US'; // Use appropriate locale
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency: effectiveCurrencyCode }).format(amount);
    } catch (error) {
      console.warn(`Invalid currency code: ${effectiveCurrencyCode}. Displaying with symbol.`);
      return `${defaultCountry.currencySymbol}${amount.toFixed(2)}`;
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccountContext(account.id);
      toast({
        title: "Account Deleted",
        description: `Account "${account.accountName}" has been successfully deleted.`,
      });
    } catch (error: any) {
      toast({
        title: "Error Deleting Account",
        description: error.message || "Could not delete the account.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-primary">{account.accountName}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{account.bankName} - {account.accountType}</CardDescription>
          </div>
          <IconComponent className="h-8 w-8 text-accent" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="text-3xl font-bold text-foreground">
          {formatCurrency(account.balance, account.currencyCode)}
        </div>
        {account.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2" title={account.description}>
            {account.description}
          </p>
        )}
        {account.category && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Category: {account.category}</Badge>
            {account.categoryConfidence !== undefined && (
              <Badge variant="outline" className="text-xs">
                Confidence: {(account.categoryConfidence * 100).toFixed(0)}%
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4 border-t">
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(account)} aria-label={`Edit account ${account.accountName}`}>
            <Edit3 className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isLoading} aria-label={`Delete account ${account.accountName}`}>
              <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the account
                "{account.accountName}" and remove its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
                {isLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
});
