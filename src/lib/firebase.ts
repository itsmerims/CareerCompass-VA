
import { getApps, initializeApp, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getApps as getAdminApps, initializeApp as initializeAdminApp, getApp as getAdminApp, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase for client-side
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// Server-side initialization (runs on the server)
let adminDb: import('firebase-admin/firestore').Firestore;

if (typeof window === 'undefined') {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : undefined;

    if (serviceAccount) {
        if (getAdminApps().length === 0) {
            initializeAdminApp({
                credential: cert(serviceAccount)
            });
        }
        adminDb = getAdminFirestore(getAdminApp());
    } else {
        console.warn("Firebase Admin SDK service account key not found. Server-side operations will be skipped.");
        // Create a dummy object to avoid breaking imports
        adminDb = {
          collection: (path: string) => {
            console.log(`[DUMMY] Accessing collection: ${path}. Firebase Admin not configured.`);
            return {
              add: async (data: any) => {
                console.log(`[DUMMY] Adding document to ${path}:`, data);
                return { id: `local-dummy-id-${Date.now()}` };
              },
            } as any;
          },
        } as import('firebase-admin/firestore').Firestore;
    }
} else {
    // On the client, we don't need the adminDb, but we need to export it.
    adminDb = {} as import('firebase-admin/firestore').Firestore;
}

export { app, db, auth, adminDb };
