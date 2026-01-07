
'use server';

import { serverTimestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/firebase/admin';
import type { ResultProfile } from './types';

// The result object here is everything in ResultProfile except the persona, which is passed separately.
export async function saveAssessmentResult(userId: string, result: Omit<ResultProfile, 'persona'>, persona: string) {
  if (!adminDb) {
    const errorMessage = 'The server is not configured for Firebase. Please ensure FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment variables. Assessment results will not be saved.';
    console.warn(errorMessage);
    // Instead of throwing, return an error object.
    // This allows the frontend to handle the failure gracefully (e.g., with a toast notification)
    // without the application crashing.
    return { success: false, error: errorMessage };
  }

  try {
    const docRef = await adminDb.collection('results').add({
      userId,
      ...result,
      persona,
      createdAt: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (e: any) {
    console.error('Error adding document: ', e);
    // Propagate the specific error for better frontend handling.
    return { success: false, error: e.message || 'Failed to save assessment result.' };
  }
}
