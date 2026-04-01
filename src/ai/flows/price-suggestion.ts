// src/ai/flows/price-suggestion.ts
'use server';
/**
 * @fileOverview A price suggestion AI agent for agricultural waste listings.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getMarketPriceRef, getMaterialProps } from '@/lib/data-utils';

const SuggestPriceInputSchema = z.object({
  wasteType: z.string().describe('The type of agricultural waste (e.g., corn stalks, rice husks).'),
  quality: z.string().describe('The quality of the waste (e.g., moisture content, purity).'),
  calorificValue: z.string().describe('The calorific value of the waste (e.g., BTU/lb or MJ/kg).'),
  location: z.string().optional().describe('The location of the waste to determine regional pricing.'),
});
export type SuggestPriceInput = z.infer<typeof SuggestPriceInputSchema>;

const SuggestPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested price for the waste in INR per unit (e.g., per ton).'),
  confidenceScore: z.number().describe('A score between 0 and 1 indicating the AI model confidence in the suggested price.'),
  reasoning: z.string().optional().describe('Brief reasoning for the price based on market data.'),
});
export type SuggestPriceOutput = z.infer<typeof SuggestPriceOutputSchema>;

export async function suggestPrice(input: SuggestPriceInput): Promise<SuggestPriceOutput> {
  return suggestPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPricePrompt',
  input: {
    schema: SuggestPriceInputSchema.extend({
      marketRef: z.string().optional(),
      materialRef: z.string().optional()
    })
  },
  output: {schema: SuggestPriceOutputSchema},
  prompt: `You are an AI assistant that suggests prices for agricultural waste listings in India.
  
  Market Reference Data for this region/type:
  {{{marketRef}}}

  Material reference properties:
  {{{materialRef}}}

  Based on the waste type, quality, and calorific value provided below, suggest a specific price in INR per ton and a confidence score. 
  - Adjust the baseline price higher if the quality is excellent.
  - Penalize price if high moisture or low calorific value is detected.
  - Anchor your suggestion to the reference rates provided.

  User Inputs:
  Waste Type: {{{wasteType}}}
  Quality: {{{quality}}}
  Calorific Value: {{{calorificValue}}}
  Location: {{{location}}}

  Return the suggested price in INR (number only), a confidence score, and a short reasoning in JSON format.
  `, 
});

const suggestPriceFlow = ai.defineFlow(
  {
    name: 'suggestPriceFlow',
    inputSchema: SuggestPriceInputSchema,
    outputSchema: SuggestPriceOutputSchema,
  },
  async (input: SuggestPriceInput) => {
    // 1. Retrieve real-world reference data from our datasets (Async Live Fetch)
    const marketRefData = await getMarketPriceRef(input.wasteType, input.location || 'India');
    const materialRefData = getMaterialProps(input.wasteType);

    const marketRefStr = marketRefData 
        ? `In ${marketRefData.region}, ${marketRefData.wasteType} is trading at approximately ₹${marketRefData.pricePerTon}/ton (${marketRefData.season} rates).`
        : "No specific regional market data found. Use a national average of ₹3,000/ton as base.";

    const materialRefStr = materialRefData 
        ? `Typical properties: ${materialRefData.typicalCalorificValue}, typical ash content ${materialRefData.ashContent}.`
        : "No specific material properties found. Assume standard biomass values.";

    // 2. Call the AI with the infused context (RAG-like approach)
    const {output} = await prompt({
        ...input,
        marketRef: marketRefStr,
        materialRef: materialRefStr
    });
    return output!;
  }
);

