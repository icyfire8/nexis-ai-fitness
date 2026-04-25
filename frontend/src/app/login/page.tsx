"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const { currentUser, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error?.message || "Login failed or was cancelled. Please try again.");
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      
      <div className="glass-card w-[90%] max-w-[400px] p-8 glow-cyan-violet relative z-10 flex flex-col items-center">
        <h1 className="font-display-xl text-4xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary-container tracking-wider uppercase font-bold text-center">NEXIS</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] mb-10 text-center">BIOMETRIC AUTHENTICATION</p>
        
        <div className="w-full space-y-4">
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-surface-container-highest border border-outline-variant hover:border-primary-container hover:bg-surface-container-highest/80 transition-all duration-300 py-4 px-6 rounded-xl group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary-container/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 z-10" />
            <span className="font-body-lg text-white font-bold tracking-wide z-10">Initialize via Google</span>
          </button>
        </div>
        
        <div className="mt-8 flex items-center gap-4 w-full">
          <div className="h-[1px] flex-1 bg-outline-variant/50"></div>
          <span className="font-label-caps text-label-caps text-outline-variant">SECURE HANDSHAKE</span>
          <div className="h-[1px] flex-1 bg-outline-variant/50"></div>
        </div>
      </div>
    </main>
  );
}
