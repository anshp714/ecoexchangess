'use server'

import { z } from 'zod';
import { db } from '@/lib/firebase-admin';

// Strict validation ensures no bad data corrupts the database
const ListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  location: z.string().min(3, "Location is required"),
  wasteType: z.string().optional(),
  quality: z.string().optional(),
  calorificValue: z.string().optional(),
  suggestedPriceInr: z.number().optional(),
  aiConfidenceScore: z.number().optional()
});

export type ListingData = z.infer<typeof ListingSchema>;

export async function saveListing(data: ListingData) {
  try {
    // 1. Validate incoming data payload
    const parsed = ListingSchema.safeParse(data);
    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.errors.map(e => e.message).join(', ') 
      };
    }

    const listingData = parsed.data;

    // 2. Perform database insert
    const firestore = db();
    const docRef = await firestore.collection('listings').add({
      ...listingData,
      createdAt: new Date().toISOString(),
      status: 'active'
    });

    return { 
      success: true, 
      id: docRef.id 
    };
  } catch (error: any) {
    console.error("Error saving listing to Firestore:", error);
    return { 
      success: false, 
      error: "Database error: Could not save listing. Ensure Firebase is configured and running properly." 
    };
  }
}
