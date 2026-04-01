'use server';
/**
 * @fileOverview Predicts future purchases for a buyer based on their history.
 *
 * - predictFuturePurchases - Predicts future items a buyer might need.
 * - PredictFuturePurchasesInput - The input type for the function.
 * - PredictFuturePurchasesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PurchaseHistoryItemSchema = z.object({
  item: z.string().describe('The type of waste purchased.'),
  quantity: z.number().describe('The quantity purchased (in tons).'),
  date: z.string().describe('The date of the purchase (YYYY-MM-DD).'),
});

const PredictFuturePurchasesInputSchema = z.object({
  purchaseHistory: z.array(PurchaseHistoryItemSchema).describe('The buyer\'s past purchase history.'),
});
export type PredictFuturePurchasesInput = z.infer<typeof PredictFuturePurchasesInputSchema>;

const PredictedItemSchema = z.object({
    item: z.string().describe('The predicted item the user will need.'),
    reasoning: z.string().describe('A brief explanation for the prediction.'),
    confidence: z.number().min(0).max(1).describe('The confidence level of the prediction.'),
});

const PredictFuturePurchasesOutputSchema = z.object({
  predictions: z.array(PredictedItemSchema).describe('A list of predicted future purchases.'),
});
export type PredictFuturePurchasesOutput = z.infer<typeof PredictFuturePurchasesOutputSchema>;


export async function predictFuturePurchases(
  input: PredictFuturePurchasesInput
): Promise<PredictFuturePurchasesOutput> {
  return predictFuturePurchasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFuturePurchasesPrompt',
  input: { schema: PredictFuturePurchasesInputSchema },
  output: { schema: PredictFuturePurchasesOutputSchema },
  prompt: `You are an AI purchasing assistant for an agricultural waste marketplace. Your task is to analyze a buyer's purchase history and predict what items they are likely to need in the near future.

Analyze the provided purchase history for patterns, frequency, and seasonality.

Purchase History (JSON):
{{{json purchaseHistory}}}

Based on this history, predict up to 3 items the user might need next. For each prediction, provide a confidence score (0 to 1) and a short, clear reasoning. For example, if a user buys corn stover every month, you could predict they will need it again soon.
`,
});

const predictFuturePurchasesFlow = ai.defineFlow(
  {
    name: 'predictFuturePurchasesFlow',
    inputSchema: PredictFuturePurchasesInputSchema,
    outputSchema: PredictFuturePurchasesOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
