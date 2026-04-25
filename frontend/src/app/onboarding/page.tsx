"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { saveUserProfile, saveUserMetrics, UserMetrics } from "../../lib/db";
import Webcam from "react-webcam";

export default function Onboarding() {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [metrics, setMetrics] = useState<Partial<UserMetrics>>({
    weight: 0,
    height: 0,
    age: 0,
    goal: "build muscle",
    activityLevel: "moderate"
  });
  const [mobilityScore, setMobilityScore] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!loading && userProfile?.onboardingCompleted) {
      router.push("/");
    }
  }, [userProfile, loading, router]);

  const handleHealthSync = () => {
    // Mock health sync from Google Fit / Apple Health
    setMetrics({ ...metrics, weight: 78, height: 175, age: 30 });
    setTimeout(() => setStep(2), 1500);
  };

  const handleComplete = async () => {
    if (!currentUser) return;
    
    // Save to Firestore Time-Series
    await saveUserMetrics(currentUser.uid, metrics as UserMetrics);
    
    // Update Base Profile
    await saveUserProfile(currentUser.uid, { 
      onboardingCompleted: true,
      mobilityScore: mobilityScore || 70 // default if skipped
    });
    
    // Force reload to get updated context
    window.location.href = "/";
  };

  const startMobilityScan = () => {
    setScanning(true);
    // In a real app, we would use the MediaPipe Pose loop here.
    // For this demonstration, we simulate the 3 movements (Squat, Toe Touch, Shoulder)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setMobilityScore(88); // Analyzed mobility score
        setScanning(false);
      }
    }, 1000);
  };

  if (loading) return null;

  return (
    <main className="min-h-screen bg-background text-on-surface pt-[80px] pb-[100px] px-6 max-w-2xl mx-auto flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-surface-container-highest h-1 mb-10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary-fixed-dim to-secondary-fixed-dim transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-display-xl text-3xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-on-surface-variant">BIOMETRIC SYNC</h1>
            <p className="font-body-md text-on-surface-variant mb-8">Connect your health provider to automatically calibrate your baseline metrics.</p>
            
            <button 
              onClick={handleHealthSync}
              className="w-full glass-card p-6 flex flex-col items-center justify-center gap-4 hover:border-primary-container transition-colors group mb-4"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-primary-fixed-dim">favorite</span>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white mb-1">Sync Apple Health / Google Fit</h3>
                <p className="text-sm text-on-surface-variant">Pulls weight, height, age, and activity</p>
              </div>
            </button>

            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
              <span className="text-xs font-label-caps text-outline-variant">OR MANUAL ENTRY</span>
              <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-label-caps text-on-surface-variant mb-2 block">Weight (kg)</label>
                <input 
                  type="number" 
                  value={metrics.weight || ""}
                  onChange={e => setMetrics({...metrics, weight: Number(e.target.value)})}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-white focus:border-primary-container focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-label-caps text-on-surface-variant mb-2 block">Height (cm)</label>
                <input 
                  type="number" 
                  value={metrics.height || ""}
                  onChange={e => setMetrics({...metrics, height: Number(e.target.value)})}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-white focus:border-primary-container focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!metrics.weight || !metrics.height}
              className="w-full mt-8 py-4 rounded-xl bg-gradient-primary text-white font-label-caps tracking-widest disabled:opacity-50"
            >
              Confirm Baseline
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-display-xl text-3xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-on-surface-variant">DIRECTIVES</h1>
            <p className="font-body-md text-on-surface-variant mb-8">Establish your primary objective for the neural engine.</p>
            
            <div className="space-y-4">
              {[
                { id: "build muscle", icon: "fitness_center", title: "Hypertrophy", desc: "Maximize lean muscle mass accretion." },
                { id: "burn fat", icon: "local_fire_department", title: "Lipid Oxidation", desc: "Optimize metabolic rate for fat loss." },
                { id: "endurance", icon: "directions_run", title: "Cardiovascular", desc: "Enhance VO2 max and stamina." }
              ].map(goal => (
                <div 
                  key={goal.id}
                  onClick={() => setMetrics({...metrics, goal: goal.id})}
                  className={`glass-card p-4 flex items-center gap-4 cursor-pointer transition-all ${metrics.goal === goal.id ? 'border-primary-container bg-primary-container/10 glow-accent' : 'hover:border-outline-variant'}`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metrics.goal === goal.id ? 'bg-primary-fixed-dim text-background' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined">{goal.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{goal.title}</h3>
                    <p className="text-sm text-on-surface-variant">{goal.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl border border-outline-variant text-white font-label-caps tracking-widest">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-4 rounded-xl bg-gradient-primary text-white font-label-caps tracking-widest">Initialize Diagnostics</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
            <h1 className="font-display-xl text-3xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-on-surface-variant text-center">MOBILITY SCREENING</h1>
            <p className="font-body-md text-on-surface-variant mb-6 text-center">Step back to allow the neural engine to analyze your joint articulation and range of motion.</p>
            
            <div className="w-full relative rounded-2xl overflow-hidden glass-card border border-primary-container/50 mb-8 aspect-video bg-black flex items-center justify-center">
              {scanning ? (
                <>
                  <Webcam 
                    audio={false} 
                    className="w-full h-full object-cover opacity-70"
                    mirrored={true}
                  />
                  {/* Cyberpunk Scanner Overlay */}
                  <div className="absolute inset-0 border-2 border-primary-fixed-dim/50 rounded-2xl">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-fixed-dim shadow-[0_0_10px_#00f0ff] animate-scan"></div>
                    
                    {/* Mock Skeleton Overlay */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <line x1="50" y1="20" x2="50" y2="45" stroke="#00f0ff" strokeWidth="0.5" className="animate-pulse" />
                      <line x1="50" y1="20" x2="35" y2="30" stroke="#00f0ff" strokeWidth="0.5" className="animate-pulse" />
                      <line x1="50" y1="20" x2="65" y2="30" stroke="#00f0ff" strokeWidth="0.5" className="animate-pulse" />
                      <circle cx="50" cy="15" r="3" fill="#f0dbff" className="animate-pulse" />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs font-numeric-data">
                    <span className="text-primary-fixed-dim bg-background/80 px-2 py-1 rounded">ANALYZING SQUAT KINEMATICS...</span>
                    <span className="text-secondary-fixed-dim bg-background/80 px-2 py-1 rounded">FRM: 30fps</span>
                  </div>
                </>
              ) : mobilityScore ? (
                <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
                  <div className="w-24 h-24 rounded-full border-4 border-primary-fixed-dim flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                    <span className="font-display-xl text-4xl text-white">{mobilityScore}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">Optimal Articulation</h3>
                  <p className="text-sm text-on-surface-variant">Cleared for high-load compound movements.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">videocam</span>
                  <p className="text-on-surface-variant text-sm text-center max-w-[200px]">Position device so full body is visible.</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 w-full">
              {!mobilityScore ? (
                <>
                  <button onClick={() => handleComplete()} className="px-6 py-4 rounded-xl border border-outline-variant text-white font-label-caps tracking-widest text-sm">Skip Scan</button>
                  <button 
                    onClick={startMobilityScan} 
                    disabled={scanning}
                    className="flex-1 py-4 rounded-xl bg-gradient-primary text-white font-label-caps tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">{scanning ? 'sync' : 'center_focus_strong'}</span>
                    {scanning ? 'Calibrating...' : 'Initiate Scan'}
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleComplete} 
                  className="w-full py-4 rounded-xl bg-gradient-primary text-white font-label-caps tracking-widest glow-cyan-violet"
                >
                  Enter NEXIS
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
