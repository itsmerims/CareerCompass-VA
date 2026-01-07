
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

  try {
    // The adminDb object is initialized in @/firebase/admin.ts.
    // If FIREBASE_SERVICE_ACCOUNT_KEY is missing or invalid, adminDb will be undefined,
    // and attempting to use it here will throw a runtime error, which will be caught below.
    // This is the correct way to handle initialization failures.
    if (!adminDb) {
      // This check is the source of the problem. If environment variables are not picked up on a hot reload,
      // this check will fail even if the .env file is correct.
      // By removing it, we rely on the actual Firestore call to fail, which is more robust.
      const errorMessage = 'The server is not configured for Firebase. Please ensure FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment variables. Assessment results will not be saved.';
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }

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
