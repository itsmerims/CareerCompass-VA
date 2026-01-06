// This file is intended to be used on the server-side only.
// It is not part of the client-side bundle.

import { getApps, initializeApp, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for server-side operations.');
}

const serviceAccount = JSON.parse(serviceAccountKey);

// Initialize Firebase Admin SDK
const adminApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount),
    });

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
