"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const { currentUser, signInWithGoogle, loginWithEmail, signupWithEmail, resetPassword, loading } = useAuth();
  const router = useRouter();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    } else {
      // Check for pre-auth data to seamlessly transition from welcome screen
      const preAuth = localStorage.getItem("nexis_pre_auth_data");
      if (preAuth) {
        try {
          const parsed = JSON.parse(preAuth);
          if (parsed.alias && !name) {
            setName(parsed.alias);
            setIsSignUp(true);
          }
        } catch (e) {}
      }
    }
  }, [currentUser, router]);

  const handleGoogleLogin = async () => {
    try {
      setAuthError("");
      setAuthSuccess("");
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Google Login failed:", error);
      setAuthError(error?.message || "Google Login failed or was cancelled.");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setAuthError("Please enter your email address first to reset your password.");
      return;
    }
    try {
      setAuthError("");
      setAuthSuccess("");
      setIsProcessing(true);
      await resetPassword(email);
      setAuthSuccess("Password reset link sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Password reset failed:", error);
      setAuthError(error?.message || "Failed to send password reset email.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setIsProcessing(true);
    try {
      if (isSignUp) {
        await signupWithEmail(email, password, name || "User");
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error: any) {
      console.error("Email Auth failed:", error);
      setAuthError(error?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsProcessing(false);
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
        <p className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] mb-10 text-center">SECURE LOGIN</p>
        
        {authError && (
          <div className="w-full bg-error-container/20 border border-error text-error text-sm p-3 rounded-lg mb-4 text-center">
            {authError}
          </div>
        )}
        
        {authSuccess && (
          <div className="w-full bg-primary-container/20 border border-primary-container text-primary-container text-sm p-3 rounded-lg mb-4 text-center">
            {authSuccess}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="w-full space-y-4 mb-6">
          {isSignUp && (
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-highest/50 border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none rounded-xl px-4 py-3 text-white font-body-md placeholder:text-outline transition-all"
              required={isSignUp}
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-container-highest/50 border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none rounded-xl px-4 py-3 text-white font-body-md placeholder:text-outline transition-all"
            required
          />
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-highest/50 border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none rounded-xl px-4 py-3 pr-12 text-white font-body-md placeholder:text-outline transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary-container transition-colors flex items-center justify-center"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          
          {!isSignUp && (
            <div className="flex justify-end w-full">
              <button 
                type="button"
                onClick={handleResetPassword}
                className="text-primary-container text-xs hover:text-white transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-primary text-white font-bold tracking-widest uppercase rounded-xl py-3 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all disabled:opacity-50"
          >
            {isProcessing ? "PROCESSING..." : (isSignUp ? "Sign Up" : "Log In")}
          </button>
        </form>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-on-surface-variant text-sm hover:text-primary-container transition-colors mb-6"
        >
          {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </button>

        <div className="w-full space-y-4">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-surface-container-highest border border-outline-variant hover:border-primary-container hover:bg-surface-container-highest/80 transition-all duration-300 py-4 px-6 rounded-xl group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary-container/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 z-10" />
            <span className="font-body-lg text-white font-bold tracking-wide z-10">Sign in with Google</span>
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
