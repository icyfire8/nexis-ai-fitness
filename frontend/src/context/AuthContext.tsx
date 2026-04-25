"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getUserProfile, saveUserProfile, UserProfile } from "../lib/db";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signupWithEmail: (e: string, p: string, n: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Fetch or create profile
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            profile = {
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName,
              role: "user", // Default role
              onboardingCompleted: false
            };
            await saveUserProfile(user.uid, profile);
          }
          setUserProfile(profile);
        } catch (dbError) {
          console.error("Firestore Error in Auth Listener:", dbError);
          // Provide a fallback so the app doesn't freeze
          setUserProfile({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "User",
            role: "user",
            onboardingCompleted: false
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Update Firebase Auth profile
    try {
      await updateProfile(res.user, { displayName: name });
    } catch (e) {
      console.error("Failed to update profile name:", e);
    }
    
    // Forcefully update the DB profile with the name
    try {
      await saveUserProfile(res.user.uid, { 
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: name,
        role: "user",
        onboardingCompleted: false
      });
    } catch (e) {
      console.error("Failed to save profile to Firestore:", e);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, signInWithGoogle, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
