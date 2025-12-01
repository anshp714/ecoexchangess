// src/ai/flows/price-suggestion.ts
'use server';
/**
 * @fileOverview A price suggestion AI agent for agricultural waste listings.
 *
 * - suggestPrice - A function that suggests a price for the waste.
 * - SuggestPriceInput - The input type for the suggestPrice function.
 * - SuggestPriceOutput - The return type for the suggestPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPriceInputSchema = z.object({
  wasteType: z.string().describe('The type of agricultural waste (e.g., corn stalks, rice husks).'),
  quality: z.string().describe('The quality of the waste (e.g., moisture content, purity).'),
  calorificValue: z.string().describe('The calorific value of the waste (e.g., BTU/lb or MJ/kg).'),
});
export type SuggestPriceInput = z.infer<typeof SuggestPriceInputSchema>;

const SuggestPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested price for the waste in INR per unit (e.g., per ton).'),
  confidenceScore: z.number().describe('A score between 0 and 1 indicating the AI model confidence in the suggested price.'),
});
export type SuggestPriceOutput = z.infer<typeof SuggestPriceOutputSchema>;

export async function suggestPrice(input: SuggestPriceInput): Promise<SuggestPriceOutput> {
  return suggestPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPricePrompt',
  input: {schema: SuggestPriceInputSchema},
  output: {schema: SuggestPriceOutputSchema},
  prompt: `You are an AI assistant that suggests prices for agricultural waste listings in India.

  Based on the waste type, quality, and calorific value, suggest a price in INR per ton and a confidence score for the suggested price. The confidence score should be between 0 and 1.

  Waste Type: {{{wasteType}}}
  Quality: {{{quality}}}
  Calorific Value: {{{calorificValue}}}

  Consider the current market prices for similar waste materials in the Indian market when suggesting the price. Return the suggested price and confidence score in JSON format.
  `, 
});

const suggestPriceFlow = ai.defineFlow(
  {
    name: 'suggestPriceFlow',
    inputSchema: SuggestPriceInputSchema,
    outputSchema: SuggestPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
