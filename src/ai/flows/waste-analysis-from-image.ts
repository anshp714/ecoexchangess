'use server';
/**
 * @fileOverview AI-powered waste analysis from an image.
 *
 * - analyzeWasteFromImage - Analyzes an image of agricultural waste to estimate waste type, quality, and calorific value.
 * - WasteAnalysisFromImageInput - The input type for the analyzeWasteFromImage function.
 * - WasteAnalysisFromImageOutput - The return type for the analyzeWasteFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WasteAnalysisFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of agricultural waste, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /*.refine(
        value => {
          try {
            const parts = value.split(',');
            if (parts.length !== 2) {
              return false;
            }
            const [mimeTypePart, dataPart] = parts;
            if (!mimeTypePart.startsWith('data:')) {
              return false;
            }
            const mimeType = mimeTypePart.substring(5, mimeTypePart.indexOf(';'));
            if (!mimeType) {
              return false;
            }
            if (!dataPart.startsWith('base64')) {
              return false;
            }
            const base64Data = dataPart.substring(7);
            const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');
            return true;
          } catch (e) {
            return false;
          }
        },
        {
          message: 'Invalid data URI format.  Must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.',
        }
      )*/
    ),
});
export type WasteAnalysisFromImageInput = z.infer<
  typeof WasteAnalysisFromImageInputSchema
>;

const WasteAnalysisFromImageOutputSchema = z.object({
  wasteType: z.string().describe('The type of agricultural waste.'),
  quality: z.string().describe('The quality of the agricultural waste.'),
  calorificValue: z
    .string()
    .describe('The estimated calorific value of the waste.'),
  confidenceScore: z
    .number()
    .describe(
      'A confidence score (0-1) indicating the accuracy of the analysis.'
    ),
});
export type WasteAnalysisFromImageOutput = z.infer<
  typeof WasteAnalysisFromImageOutputSchema
>;

export async function analyzeWasteFromImage(
  input: WasteAnalysisFromImageInput
): Promise<WasteAnalysisFromImageOutput> {
  return wasteAnalysisFromImageFlow(input);
}

const wasteAnalysisPrompt = ai.definePrompt({
  name: 'wasteAnalysisPrompt',
  input: {schema: WasteAnalysisFromImageInputSchema},
  output: {schema: WasteAnalysisFromImageOutputSchema},
  prompt: `You are an AI expert in agricultural waste analysis. Analyze the image of the waste provided and determine its type, quality, and calorific value. Provide a confidence score for your analysis.

Image: {{media url=photoDataUri}}

Waste Type: 
Quality: 
Calorific Value: 
Confidence Score: `,
});

const wasteAnalysisFromImageFlow = ai.defineFlow(
  {
    name: 'wasteAnalysisFromImageFlow',
    inputSchema: WasteAnalysisFromImageInputSchema,
    outputSchema: WasteAnalysisFromImageOutputSchema,
  },
  async input => {
    const {output} = await wasteAnalysisPrompt(input);
    return output!;
  }
);
