'use server';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { ResultProfile } from './types';

type SaveableProfile = ResultProfile;

export async function saveResultProfile(profile: SaveableProfile) {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "your-project-id") {
    console.log("Firebase not configured. Skipping save. Profile data:", profile);
    return { success: true, id: 'local-test-id' };
  }
  
  try {
    const docRef = await addDoc(collection(db, 'va-results'), {
      ...profile,
      createdAt: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error('Error adding document: ', e);
    return { success: false, error: 'Failed to save results.' };
  }
}
