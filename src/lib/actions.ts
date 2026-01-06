'use server';

import { serverTimestamp } from 'firebase/firestore';
import { adminDb } from './firebase';
import type { ResultProfile } from './types';

// The result object here is everything in ResultProfile except the persona, which is passed separately.
export async function saveAssessmentResult(userId: string, result: Omit<ResultProfile, 'persona'>, persona: string) {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "your-project-id") {
    console.log("Firebase not configured. Skipping save. Profile data:", { ...result, persona, userId });
    return { success: true, id: 'local-test-id' };
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
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Failed to save assessment result.');
  }
}
