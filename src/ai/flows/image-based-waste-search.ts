'use server';

/**
 * @fileOverview Implements image-based waste search using Genkit and the Gemini model.
 *
 * - imageBasedWasteSearch - The main function to perform the image-based waste search.
 * - ImageBasedWasteSearchInput - The input type for the imageBasedWasteSearch function.
 * - ImageBasedWasteSearchOutput - The return type for the imageBasedWasteSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageBasedWasteSearchInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of waste, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type ImageBasedWasteSearchInput = z.infer<typeof ImageBasedWasteSearchInputSchema>;

const ImageBasedWasteSearchOutputSchema = z.object({
  description: z.string().describe('A textual description of the waste in the image.'),
});
export type ImageBasedWasteSearchOutput = z.infer<typeof ImageBasedWasteSearchOutputSchema>;

export async function imageBasedWasteSearch(
  input: ImageBasedWasteSearchInput
): Promise<ImageBasedWasteSearchOutput> {
  return imageBasedWasteSearchFlow(input);
}

const prompt = ai.definePrompt({
    name: 'imageBasedWasteSearchPrompt',
    input: { schema: ImageBasedWasteSearchInputSchema },
    output: { schema: ImageBasedWasteSearchOutputSchema },
    prompt: `Describe the waste in this image. Focus on the type of waste, its quality, and potential uses.
    
    Image: {{media url=photoDataUri}}`
});

const imageBasedWasteSearchFlow = ai.defineFlow(
  {
    name: 'imageBasedWasteSearchFlow',
    inputSchema: ImageBasedWasteSearchInputSchema,
    outputSchema: ImageBasedWasteSearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
