import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAC20S_ulIV-N36KtoXXNALMFPYnFIjYWA",
  authDomain: "nexis-ai-f5832.firebaseapp.com",
  projectId: "nexis-ai-f5832",
  storageBucket: "nexis-ai-f5832.firebasestorage.app",
  messagingSenderId: "732280018583",
  appId: "1:732280018583:web:20c80b30a53898de3afbd2",
  measurementId: "G-F41Q088KFN"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
