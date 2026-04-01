// src/ai/flows/predict-future-purchases.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import marketPrices from '@/data/market_prices.json';

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

const PredictFuturePurchasesPromptInputSchema = z.object({
  summary: z.string().describe('An aggregated summary of the buyer purchase history.'),
  seasonalContext: z.string().optional().describe('Information about currently available seasonal materials.'),
});

const prompt = ai.definePrompt({
  name: 'predictFuturePurchasesPrompt',
  input: { schema: PredictFuturePurchasesPromptInputSchema },
  output: { schema: PredictFuturePurchasesOutputSchema },
  prompt: `You are an AI purchasing assistant for an agricultural waste marketplace. Your task is to analyze a buyer's aggregated purchase history and predict what items they are likely to need in the near future.

Aggregated Purchase Summary (Item, Total Quantity, Latest Purchase Date):
{{{summary}}}

Seasonal Market Context (Currently trending/available materials):
{{{seasonalContext}}}

Based on this aggregated data and the current season, predict up to 3 items the user might need next. 
- If a user frequently buys Rice Husk, and it's Post-Kharif season (peak availability), mention this.
- If they buy Bagasse, note its year-round availability.
For each prediction, provide a confidence score (0 to 1) and a short, clear reasoning.
`,
});

const predictFuturePurchasesFlow = ai.defineFlow(
  {
    name: 'predictFuturePurchasesFlow',
    inputSchema: PredictFuturePurchasesInputSchema,
    outputSchema: PredictFuturePurchasesOutputSchema,
  },
  async (input: PredictFuturePurchasesInput) => {
    // 1. Pre-aggregate data to avoid context overflow and improve LLM reasoning
    const aggregatedMap = new Map<string, { quantity: number; latestDate: string }>();
    for (const item of input.purchaseHistory) {
      const existing = aggregatedMap.get(item.item);
      if (existing) {
        existing.quantity += item.quantity;
        if (new Date(item.date) > new Date(existing.latestDate)) {
           existing.latestDate = item.date;
        }
      } else {
        aggregatedMap.set(item.item, { quantity: item.quantity, latestDate: item.date });
      }
    }
    
    // 2. Create a compact text summary for the LLM
    const summary = Array.from(aggregatedMap.entries())
      .map(([item, data]) => `- ${item}: Total ${data.quantity.toFixed(1)} tons, Last purchased ${data.latestDate}`)
      .join('\n');

    // 3. Inject seasonal context from our dataset
    const currentMonth = new Date().getMonth(); // 0-11
    let seasonalContext = "Current Season Availability: ";
    if (currentMonth >= 9 || currentMonth <= 1) {
        seasonalContext += "High availability of Rice Husk and Corn Stover (Post-Kharif).";
    } else if (currentMonth >= 3 && currentMonth <= 5) {
        seasonalContext += "High availability of Wheat Straw (Post-Rabi).";
    } else {
        seasonalContext += "Sugarcane Bagasse and Sawdust are available year-round.";
    }

    const { output } = await prompt({ summary, seasonalContext });
    return output!;
  }
);

