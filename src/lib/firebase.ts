import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getApp(): FirebaseApp {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

// Lazy initialization getters
let _auth: Auth | undefined;
let _db: Firestore | undefined;

export function getAuthInstance(): Auth {
  if (!_auth) _auth = getAuth(getApp());
  return _auth;
}

export function getDbInstance(): Firestore {
  if (!_db) _db = getFirestore(getApp());
  return _db;
}

// For backward compatibility - these will be initialized on first access
export const auth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    const instance = getAuthInstance();
    return (instance as never)[prop];
  },
});

export const db: Firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    const instance = getDbInstance();
    return (instance as never)[prop];
  },
});
