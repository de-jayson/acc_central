// @ts-nocheck
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
import { PlusCircle } from "lucide-react";
import { countries, defaultCountry, type CountryInfo } from "@/constants/countries";
import React, { useState } from "react";

const formSchema = z.object({
  accountName: z.string().min(2, { message: "Account name must be at least 2 characters." }),
  bankName: z.string().min(2, { message: "Bank name must be at least 2 characters." }),
  balance: z.coerce.number().min(0, { message: "Balance must be a non-negative number." }),
  accountType: z.nativeEnum(AccountType, { errorMap: () => ({ message: "Please select an account type." }) }),
  country: z.string().min(2, { message: "Please select a country."}), // Country code
  currencyCode: z.string().min(3, { message: "Currency code is required." }),
  description: z.string().optional(),
});

export function AddAccountForm() {
  const { addAccount, isLoading } = useAccounts();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>(defaultCountry.currencySymbol);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: "",
      bankName: "",
      balance: 0,
      country: defaultCountry.code,
      currencyCode: defaultCountry.currencyCode,
      description: "",
    },
  });

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = countries.find(c => c.code === countryCode);
    if (selectedCountry) {
      form.setValue("currencyCode", selectedCountry.currencyCode);
      setSelectedCurrencySymbol(selectedCountry.currencySymbol);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // The Omit type for addAccount is Omit<BankAccount, 'id' | 'userId'>
      // Ensure `values` matches this, specifically `currencyCode` and `country` are part of `BankAccount`
      const accountData: Omit<BankAccount, 'id' | 'userId'> = {
        accountName: values.accountName,
        bankName: values.bankName,
        balance: values.balance,
        accountType: values.accountType,
        currencyCode: values.currencyCode,
        country: values.country,
        description: values.description,
      };
      await addAccount(accountData);
      toast({
        title: "Account Added",
        description: `Account "${values.accountName}" has been successfully added.`,
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Failed to Add Account",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <PlusCircle className="h-7 w-7 mr-2 text-accent" />
          Add New Bank Account
        </CardTitle>
        <CardDescription>Fill in the details below to add a new account to your dashboard.</CardDescription>
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
                      <Input placeholder="e.g., Chase, Bank of America" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleCountryChange(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country: CountryInfo) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name} ({country.currencyCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Balance ({selectedCurrencySymbol})</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {selectedCurrencySymbol}
                        </span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                          className="pl-8" // Adjust padding for symbol
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Enter the current balance of this account.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
             {/* Hidden field for currencyCode, managed by country selection */}
            <FormField
                control={form.control}
                name="currencyCode"
                render={({ field }) => (
                    <FormItem className="hidden">
                        <FormLabel>Currency Code</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly />
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
                {isLoading ? "Adding Account..." : "Add Account"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
