import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
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

// Client-side initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_EMULATOR_HOST) {
  try {
    console.log('Connecting to Firebase Emulators');
    connectFirestoreEmulator(db, process.env.NEXT_PUBLIC_EMULATOR_HOST, 8080);
    connectAuthEmulator(auth, `http://${process.env.NEXT_PUBLIC_EMULATOR_HOST}:9099`, { disableWarnings: true });
  } catch (error) {
    console.error('Error connecting to Firebase emulators:', error);
  }
}

// Server-side initialization
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : {};

if (getAdminApps().length === 0 && typeof window === 'undefined') {
  initializeAdminApp({
    credential: cert(serviceAccount)
  });
}

const adminDb = getAdminFirestore();

export { app, db, auth, adminDb };
