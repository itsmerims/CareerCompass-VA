
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
    // Query without ordering to avoid needing a composite index.
    const snapshot = await db.collection('results').where('userId', '==', userId).get();
    if (snapshot.empty) {
      return [];
    }
    
    const roadmaps: (ResultProfile & { id: string, createdAt: string, roadmap?: Roadmap })[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Ensure createdAt exists and is a timestamp before converting
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        roadmaps.push({
          id: doc.id,
          scores: data.scores,
          recommendedPath: data.recommendedPath,
          persona: data.persona,
          roadmap: data.roadmap,
          createdAt: data.createdAt.toDate().toISOString(),
        });
      }
    });

    // Sort the results in the application code instead of the query.
    roadmaps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return roadmaps;
  } catch (e: any) {
    console.error('Error fetching roadmaps:', e);
    // In a real app, you'd want more robust error handling/logging
    return [];
  }
}
