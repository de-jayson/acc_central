
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, MessageSquare, Send } from "lucide-react";

const contactFormSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

const faqs = [
  {
    question: "How do I add a new bank account?",
    answer: "Navigate to the 'Add Account' page from the sidebar. Fill in the required details such as account name, bank name, balance, and account type, then click 'Add Account'.",
  },
  {
    question: "Can I categorize my accounts?",
    answer: "Yes! Use the 'Categorize Tool' in the sidebar. Enter the account name and a description, and our AI will suggest a category for you.",
  },
  {
    question: "Is my data secure?",
    answer: "We prioritize your data security. For this demo application, data is stored locally in your browser. In a production environment, we would use industry-standard encryption and security practices.",
  },
  {
    question: "How can I change my password?",
    answer: "You can change your password on the 'Profile' page, accessible from the user menu in the top right corner of the dashboard.",
  },
  {
    question: "How do I change my username?",
    answer: "Navigate to the 'Profile' page. You can update your username there. Note that changing your username will update its association with your bank accounts.",
  },
  {
    question: "How do I customize application settings like theme?",
    answer: "Go to the 'Settings' page from the sidebar. There you can change the application theme (Light, Dark, System), and manage notification and data preferences.",
  },
];

export default function HelpSupportPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { subject: "", message: "" },
  });

  const onSubmitContact = async (values: z.infer<typeof contactFormSchema>) => {
    // Mock functionality: In a real app, this would send data to a backend.
    console.log("Support Request:", values);
    toast({
      title: "Message Sent (Mock)",
      description: "Your support request has been received. We'll get back to you shortly. (This is a mock action for the demo).",
    });
    form.reset();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Help & Support</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-accent" />
            Frequently Asked Questions (FAQs)
          </CardTitle>
          <CardDescription>Find answers to common questions about Account Central.</CardDescription>
        </CardHeader>
        <CardContent>
          {faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">No FAQs available at the moment.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-accent" />
            Contact Support
          </CardTitle>
          <CardDescription>Still need help? Send us a message.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitContact)} className="space-y-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Issue with account linking" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your issue or question in detail..." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
