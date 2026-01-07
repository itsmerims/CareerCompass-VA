// This file is intended to be used on the server-side only.
// It is not part of the client-side bundle.

import { getApps, initializeApp, getApp, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminDb: Firestore | undefined;

function getAdminDb(): Firestore {
  if (adminDb) {
    return adminDb;
  }
  
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // When reading from .env, newline characters are escaped. We need to un-escape them.
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase server credentials are not fully set in environment variables.');
    }

    const serviceAccount: ServiceAccount = {
        projectId,
        clientEmail,
        privateKey,
    };

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
  } catch (error: any) {
    console.error('Failed to initialize Firebase Admin SDK.', error);
    // Throw a more specific error to help with debugging.
    throw new Error(`Could not initialize Firebase Admin SDK. Please ensure server environment variables (e.g., FIREBASE_PRIVATE_KEY) are set correctly. Original error: ${error.message}`);
  }
}

export { getAdminDb };
