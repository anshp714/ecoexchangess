'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/price-suggestion.ts';
import '@/ai/flows/image-based-waste-search.ts';
import '@/ai/flows/waste-analysis-from-image.ts';
import '@/ai/flows/help-chatbot.ts';
import '@/ai/flows/predict-future-purchases.ts';
