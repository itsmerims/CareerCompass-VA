
'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/firebase/admin';
import type { ResultProfile, Roadmap } from './types';

// This function can create a new result or update an existing one with a roadmap.
export async function saveAssessmentResult(
  userId: string, 
  data: { result: Omit<ResultProfile, 'persona'>; persona: string; roadmap?: Roadmap },
  docId?: string | null
) {
  const { result, persona, roadmap } = data;

  try {
    const db = getAdminDb();
    if (docId) {
      // If a document ID is provided, update the existing document with the roadmap.
      const docRef = db.collection('results').doc(docId);
      await docRef.update({
        roadmap,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log('Document updated with ID: ', docId);
      return { success: true, id: docId };
    } else {
      // If no document ID, create a new document with the initial result.
      const docRef = await db.collection('results').add({
        userId,
        ...result,
        persona,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log('Document written with ID: ', docRef.id);
      return { success: true, id: docRef.id };
    }
  } catch (e: any) {
    console.error('Error saving document: ', e);
    // Provide a more generic but still helpful error to the client.
    const errorMessage = `Failed to save assessment result to the database. Reason: ${e.message}`;
    return { success: false, error: errorMessage };
  }
}

export async function getSavedRoadmaps(userId: string) {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection('results').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    
    const roadmaps: (ResultProfile & { id: string, createdAt: string, roadmap?: Roadmap })[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      roadmaps.push({
        id: doc.id,
        scores: data.scores,
        recommendedPath: data.recommendedPath,
        persona: data.persona,
        roadmap: data.roadmap,
        createdAt: data.createdAt.toDate().toISOString(),
      });
    });

    return roadmaps;
  } catch (e: any) {
    console.error('Error fetching roadmaps:', e);
    // In a real app, you'd want more robust error handling/logging
    return [];
  }
}
