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
import { useToast } from "@/hooks/use-toast";
import { categorizeAccount, CategorizeAccountOutput } from "@/ai/flows/categorize-account";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  accountName: z.string().min(2, { message: "Account name must be at least 2 characters." }),
  accountDescription: z.string().min(5, { message: "Description must be at least 5 characters for effective categorization." }),
});

export function CategorizeAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CategorizeAccountOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: "",
      accountDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const aiResponse = await categorizeAccount(values);
      setResult(aiResponse);
      toast({
        title: "Categorization Successful",
        description: `Account AI suggested category: ${aiResponse.category}`,
      });
    } catch (error: any) {
      console.error("AI Categorization error:", error);
      toast({
        title: "Categorization Failed",
        description: error.message || "The AI model could not categorize this account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <Sparkles className="h-7 w-7 mr-2 text-accent" />
          AI Account Categorizer
        </CardTitle>
        <CardDescription>
          Let AI help you categorize your bank accounts based on their name and description.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Platinum Rewards Card, Emergency Fund" {...field} />
                  </FormControl>
                  <FormDescription>Enter the official name of the account.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Used for all travel expenses and dining out. Points are redeemed for flights."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide a detailed description of the account's purpose or features.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? "Categorizing..." : "Categorize with AI"}
              {!isLoading && <Bot className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </Form>
      </CardContent>
      {result && (
        <CardFooter className="flex flex-col items-start gap-4 pt-6 border-t">
          <h3 className="text-lg font-semibold text-primary">AI Categorization Result:</h3>
          <div className="space-y-2 w-full p-4 bg-secondary/50 rounded-md">
            <p className="text-md">
              <span className="font-medium">Suggested Category:</span>{" "}
              <Badge variant="default" className="text-md bg-primary text-primary-foreground">{result.category}</Badge>
            </p>
            <div>
              <span className="font-medium">Confidence Score:</span>{" "}
              <span className="text-muted-foreground">({(result.confidence * 100).toFixed(0)}%)</span>
              <Progress value={result.confidence * 100} className="w-full h-2 mt-1" />
            </div>
          </div>
           <p className="text-xs text-muted-foreground">
            You can use this category when adding or editing your account details.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
