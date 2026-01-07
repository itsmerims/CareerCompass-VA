// This file is intended to be used on the server-side only.
// It is not part of the client-side bundle.

import { getApps, initializeApp, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminDb: Firestore | undefined;

function getAdminDb(): Firestore {
  if (adminDb) {
    return adminDb;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK cannot be initialized.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    let adminApp: App;

    if (!getApps().length) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      adminApp = getApp();
    }
    
    adminDb = getFirestore(adminApp);
    return adminDb;
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize Firebase Admin SDK.', error);
    throw new Error('Could not initialize Firebase Admin SDK. Please ensure FIREBASE_SERVICE_ACCOUNT_KEY is a valid JSON string.');
  }
}

export { getAdminDb };
