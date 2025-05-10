
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccounts } from "@/contexts/AccountContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AccountType, type BankAccount } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3 } from "lucide-react";
import { defaultCountry } from "@/constants/countries";
import React from "react";

const formSchema = z.object({
  accountName: z.string().min(2, { message: "Account name must be at least 2 characters." }),
  bankName: z.string().min(2, { message: "Bank name must be at least 2 characters." }),
  balance: z.coerce.number().min(0, { message: "Balance must be a non-negative number." }),
  accountType: z.nativeEnum(AccountType, { errorMap: () => ({ message: "Please select an account type." }) }),
  description: z.string().optional(),
  // Category fields are not directly editable in this form but are preserved
  category: z.string().optional(),
  categoryConfidence: z.number().optional(),
});

interface EditAccountFormProps {
  initialData: BankAccount;
}

export function EditAccountForm({ initialData }: EditAccountFormProps) {
  const { updateAccount, isLoading } = useAccounts();
  const { toast } = useToast();
  const router = useRouter();
  const currencySymbol = defaultCountry.currencySymbol;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: initialData.accountName,
      bankName: initialData.bankName,
      balance: initialData.balance,
      accountType: initialData.accountType,
      description: initialData.description || "",
      category: initialData.category,
      categoryConfidence: initialData.categoryConfidence,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Preserve existing category info if not changed by another process
      const accountUpdates: Partial<BankAccount> = {
        ...values,
        category: initialData.category, // Keep original category data
        categoryConfidence: initialData.categoryConfidence, // Keep original confidence
      };

      await updateAccount(initialData.id, accountUpdates);
      toast({
        title: "Account Updated",
        description: `Account "${values.accountName}" has been successfully updated.`,
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Failed to Update Account",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <Edit3 className="h-7 w-7 mr-2 text-accent" />
          Edit Account: {initialData.accountName}
        </CardTitle>
        <CardDescription>Update the details for this account. Currency is fixed at {defaultCountry.currencyCode} ({currencySymbol}).</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., My Checking Account" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GCB, Ecobank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance ({currencySymbol})</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {currencySymbol}
                      </span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                        className="pl-8 md:pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Enter the current balance of this account in {defaultCountry.currencyCode}.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(AccountType).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Primary account for daily expenses, long-term savings goal..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
