'use server';

// This file is intended to be used on the server-side only.
// It is not part of the client-side bundle.

import { getApps, initializeApp, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK will not be initialized. Server-side Firebase features will be disabled.');
} else {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    if (!getApps().length) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      adminApp = getApp();
    }
    
    adminDb = getFirestore(adminApp);

  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize Firebase Admin SDK.', error);
    console.warn('Please ensure that the FIREBASE_SERVICE_ACCOUNT_KEY in your .env file is a valid JSON string.');
    // Keep adminApp and adminDb as undefined
  }
}


export { adminApp, adminDb };
