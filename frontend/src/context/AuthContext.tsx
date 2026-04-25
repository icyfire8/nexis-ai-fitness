"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
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
    // Profile creation will be handled by the onAuthStateChanged listener,
    // but we can update the display name here or just pass it to the DB directly.
    let profile = await getUserProfile(res.user.uid);
    if (!profile) {
      profile = {
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: name,
        role: "user",
        onboardingCompleted: false
      };
      await saveUserProfile(res.user.uid, profile);
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
