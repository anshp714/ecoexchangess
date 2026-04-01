'use server';
/**
 * @fileOverview A simple AI help chatbot for EcoExchange.
 *
 * - helpChat - A function that responds to user queries.
 * - HelpChatInput - The input type for the helpChat function.
 * - HelpChatOutput - The return type for the helpChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HelpChatInputSchema = z.object({
  query: z.string().describe("The user's question about the EcoExchange platform."),
});
export type HelpChatInput = z.infer<typeof HelpChatInputSchema>;

const HelpChatOutputSchema = z.object({
  response: z.string().describe("The AI's helpful response."),
});
export type HelpChatOutput = z.infer<typeof HelpChatOutputSchema>;

export async function helpChat(input: HelpChatInput): Promise<HelpChatOutput> {
  return helpChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'helpChatPrompt',
  input: {schema: HelpChatInputSchema},
  output: {schema: HelpChatOutputSchema},
  prompt: `You are an AI assistant for EcoExchange, a marketplace for agricultural waste. Your goal is to provide helpful and concise answers to user questions about the platform.

  User Question: {{{query}}}

  Answer the question clearly and directly.
  `,
});

const helpChatFlow = ai.defineFlow(
  {
    name: 'helpChatFlow',
    inputSchema: HelpChatInputSchema,
    outputSchema: HelpChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
