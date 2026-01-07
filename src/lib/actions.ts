
'use server';

import { serverTimestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/firebase/admin';
import type { ResultProfile, Roadmap } from './types';

// This function can create a new result or update an existing one with a roadmap.
export async function saveAssessmentResult(
  userId: string, 
  data: { result: Omit<ResultProfile, 'persona'>; persona: string; roadmap?: Roadmap },
  docId?: string | null
) {
  // adminDb will be undefined if the service account key is missing or invalid.
  // In that case, the initialization in @/firebase/admin.ts would have already logged a warning.
  // We return an error so the frontend can handle it.
  if (!adminDb) {
    const errorMessage = 'The server is not configured for Firebase. Please ensure FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment variables. Assessment results will not be saved.';
    console.warn(errorMessage);
    return { success: false, error: errorMessage };
  }

  const { result, persona, roadmap } = data;

  try {
    if (docId) {
      // If a document ID is provided, update the existing document with the roadmap.
      const docRef = adminDb.collection('results').doc(docId);
      await docRef.update({
        roadmap,
        updatedAt: serverTimestamp(),
      });
      console.log('Document updated with ID: ', docId);
      return { success: true, id: docId };
    } else {
      // If no document ID, create a new document with the initial result.
      const docRef = await adminDb.collection('results').add({
        userId,
        ...result,
        persona,
        createdAt: serverTimestamp(),
      });
      console.log('Document written with ID: ', docRef.id);
      return { success: true, id: docRef.id };
    }
  } catch (e: any) {
    console.error('Error saving document: ', e);
    return { success: false, error: e.message || 'Failed to save assessment result.' };
  }
}
