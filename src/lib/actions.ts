
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
  const { result, persona, roadmap } = data;

  if (!adminDb) {
      const errorMessage = 'Firebase Admin SDK is not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY may be missing or invalid in your environment variables.';
      console.error(errorMessage);
      return { success: false, error: errorMessage };
  }

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
    // Provide a more generic but still helpful error to the client.
    const errorMessage = e.message?.includes('service account')
      ? 'Firebase service account authentication failed. Please check server logs.'
      : 'Failed to save assessment result to the database.';
    return { success: false, error: errorMessage };
  }
}
