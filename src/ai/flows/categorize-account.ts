// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview AI agent that categorizes a bank account based on its name and description.
 *
 * - categorizeAccount - A function that categorizes a bank account.
 * - CategorizeAccountInput - The input type for the categorizeAccount function.
 * - CategorizeAccountOutput - The return type for the categorizeAccount function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeAccountInputSchema = z.object({
  accountName: z.string().describe('The name of the bank account.'),
  accountDescription: z.string().describe('A description of the bank account.'),
});

export type CategorizeAccountInput = z.infer<typeof CategorizeAccountInputSchema>;

const CategorizeAccountOutputSchema = z.object({
  category: z.string().describe('The category of the bank account.'),
  confidence: z.number().describe('A confidence score between 0 and 1 indicating the certainty of the categorization.'),
});

export type CategorizeAccountOutput = z.infer<typeof CategorizeAccountOutputSchema>;

export async function categorizeAccount(input: CategorizeAccountInput): Promise<CategorizeAccountOutput> {
  return categorizeAccountFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeAccountPrompt',
  input: {schema: CategorizeAccountInputSchema},
  output: {schema: CategorizeAccountOutputSchema},
  prompt: `You are a personal finance expert. Your task is to categorize bank accounts based on their name and description.

  Here are some example categories: ["Savings", "Checking", "Credit Card", "Investment", "Loan", "Mortgage", "Other"]

  Given the following account information, determine the most appropriate category and provide a confidence score. The confidence score should be a number between 0 and 1. Think step by step.
  
  Account Name: {{{accountName}}}
  Account Description: {{{accountDescription}}}
  
  Respond in JSON format with the category and confidence score.
  `,
});

const categorizeAccountFlow = ai.defineFlow(
  {
    name: 'categorizeAccountFlow',
    inputSchema: CategorizeAccountInputSchema,
    outputSchema: CategorizeAccountOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
