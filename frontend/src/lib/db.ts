import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export type UserRole = "user" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  onboardingCompleted: boolean;
  mobilityScore?: number;
  latestMetrics?: UserMetrics;
}

export interface UserMetrics {
  weight: number;
  height: number;
  age: number;
  goal: string;
  activityLevel: string;
  timestamp?: any;
}

// 1. Create or Update Base Profile
export const saveUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, data, { merge: true });
};

// 2. Fetch Base Profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
};

// 3. Save Time-Series Metrics (And cache on base profile for quick access)
export const saveUserMetrics = async (uid: string, metrics: UserMetrics) => {
  const metricsRef = collection(db, "users", uid, "metrics");
  
  // Save to time-series subcollection
  await addDoc(metricsRef, {
    ...metrics,
    timestamp: serverTimestamp()
  });

  // Cache latest on user profile
  await saveUserProfile(uid, { latestMetrics: metrics });
};
