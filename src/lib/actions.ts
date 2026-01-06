
'use server';

import { serverTimestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/firebase/admin';
import type { ResultProfile } from './types';

// The result object here is everything in ResultProfile except the persona, which is passed separately.
export async function saveAssessmentResult(userId: string, result: Omit<ResultProfile, 'persona'>, persona: string) {
  if (!adminDb) {
    console.error("Firebase Admin not initialized. Cannot save assessment result.");
    throw new Error('Server configuration error.');
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
