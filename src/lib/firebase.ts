// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

let auth: Auth | null = null;

export function getFirebaseAuth(): Auth {
  // 🚫 Prevent SSR / build execution
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth can only be used on the client");
  }

  // ✅ Validate ONLY at runtime
  if (
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) {
    console.error("❌ Firebase Config Missing:", {
      apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      domain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    throw new Error(
      "Firebase Config Error: Missing env variables. Restart dev server after updating .env"
    );
  }

  if (!getApps().length) {
    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }

  if (!auth) {
    auth = getAuth(getApp());
  }

  return auth;
}
