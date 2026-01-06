
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getApps as getAdminApps, initializeApp as initializeAdminApp, getApp as getAdminApp, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

// Client-side config
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Client-side initialization (runs in the browser)
function initializeClientApp() {
    if (getApps().length > 0) {
        return getApp();
    }
    const app = initializeApp(firebaseConfig);

    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_EMULATOR_HOST) {
      try {
        console.log('Connecting client to Firebase Emulators');
        const db = getFirestore(app);
        const auth = getAuth(app);
        connectFirestoreEmulator(db, process.env.NEXT_PUBLIC_EMULATOR_HOST, 8080);
        connectAuthEmulator(auth, `http://${process.env.NEXT_PUBLIC_EMULATOR_HOST}:9099`, { disableWarnings: true });
      } catch (error) {
        console.error('Error connecting client to Firebase emulators:', error);
      }
    }
    return app;
}

const app = initializeClientApp();
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
        adminDb = {} as import('firebase-admin/firestore').Firestore;
    }
} else {
    // On the client, we don't need the adminDb, but we need to export it.
    adminDb = {} as import('firebase-admin/firestore').Firestore;
}

export { app, db, auth, adminDb };
