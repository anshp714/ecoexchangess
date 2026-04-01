// src/ai/flows/waste-analysis-from-image.ts
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import materialProperties from '@/data/material_properties.json';

const WasteAnalysisFromImageInputSchema = z.object({
  photoDataUri: z.string().describe('A photo of agricultural waste as a data URI.'),
});
export type WasteAnalysisFromImageInput = z.infer<typeof WasteAnalysisFromImageInputSchema>;

const WasteAnalysisFromImageOutputSchema = z.object({
  wasteType: z.string().describe('The type of agricultural waste.'),
  quality: z.string().describe('The quality (e.g. Dry, Moisture level).'),
  calorificValue: z.string().describe('The estimated calorific value of the waste.'),
  confidenceScore: z.number().describe('A confidence score (0-1).'),
});
export type WasteAnalysisFromImageOutput = z.infer<typeof WasteAnalysisFromImageOutputSchema>;

export async function analyzeWasteFromImage(input: WasteAnalysisFromImageInput): Promise<WasteAnalysisFromImageOutput> {
  return wasteAnalysisFromImageFlow(input);
}

const wasteAnalysisPrompt = ai.definePrompt({
  name: 'wasteAnalysisPrompt',
  input: {
    schema: WasteAnalysisFromImageInputSchema.extend({
      propertyCatalog: z.string().optional()
    })
  },
  output: {schema: WasteAnalysisFromImageOutputSchema},
  prompt: `You are an AI expert in agricultural waste analysis. 
  
  REFERENCE PROPERTY CATALOG:
  {{{propertyCatalog}}}

  TASK:
  1. Analyze the provided image to identify the type and quality of waste.
  2. Cross-reference the identified waste type with the REFERENCE PROPERTY CATALOG above.
  3. If found in the catalog, use the EXACT typical calorific value and scientific properties from the catalog in your output.
  4. If not found, provide a best-effort scientific estimate.

  Image: {{media url=photoDataUri}}

  Return the wasteType, quality, calorificValue, and confidenceScore in JSON format.
  `, 
});

const wasteAnalysisFromImageFlow = ai.defineFlow(
  {
    name: 'wasteAnalysisFromImageFlow',
    inputSchema: WasteAnalysisFromImageInputSchema,
    outputSchema: WasteAnalysisFromImageOutputSchema,
  },
  async (input: WasteAnalysisFromImageInput) => {
    // Inject our material property dataset as context for the vision model
    const catalogStr = materialProperties.map(p => 
        `- ${p.wasteType}: ${p.typicalCalorificValue}, Ash: ${p.ashContent}`
    ).join('\n');

    const {output} = await wasteAnalysisPrompt({
        ...input,
        propertyCatalog: catalogStr
    });
    return output!;
  }
);

