"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const WORKOUT_PROTOCOL = [
  { name: "Barbell Squats", duration: 45, image: "https://loremflickr.com/800/600/squat,workout/all" },
  { name: "Pushups", duration: 30, image: "https://loremflickr.com/800/600/pushup,workout/all" },
  { name: "Plank Hold", duration: 60, image: "https://loremflickr.com/800/600/plank,workout/all" },
  { name: "Dumbbell Rows", duration: 45, image: "https://loremflickr.com/800/600/dumbbell,workout/all" },
  { name: "Burpees", duration: 30, image: "https://loremflickr.com/800/600/burpee,workout/all" }
];

export default function Train() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isProtocolComplete, setIsProtocolComplete] = useState(false);

  // Timer logic for Execute Protocol
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExecuting && !isProtocolComplete) {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else {
        // Move to next exercise or finish
        if (currentExIndex < WORKOUT_PROTOCOL.length - 1) {
          setCurrentExIndex(currentExIndex + 1);
          setTimeLeft(WORKOUT_PROTOCOL[currentExIndex + 1].duration);
        } else {
          setIsProtocolComplete(true);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [isExecuting, timeLeft, currentExIndex, isProtocolComplete]);

  const startProtocol = () => {
    setIsExecuting(true);
    setCurrentExIndex(0);
    setTimeLeft(WORKOUT_PROTOCOL[0].duration);
    setIsProtocolComplete(false);
  };

  const endProtocol = () => {
    setIsExecuting(false);
    setIsProtocolComplete(false);
  };

  return (
    <ProtectedRoute>
      <>
        {/* Atmospheric Background Layer */}
        <div className="fixed inset-0 z-[-2]">
          <img className="w-full h-full object-cover opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDifrJQYsEo_64SFpLYFMoyl_zpqTlN-bNB5osHt-iIfA-W-BE-vmsXDp6N0PA3GnF99Hw-6oc-B6cUchu_wZEjdJAQLFxeZUl1dlgEpwaRykKKrY2wMVZBjdbAk0QxHhd6-SHc-BSa4wYHZIpK2eIJxLTfAahDgz0vrWkXyLfjNMMv_2eC7xf1lDqbalxPXP-FJbki0GGmJvBKG3n8E9v27yNy4I1aEHjGEntaEf_aHpusEa4-oArfgzspfSRvVb6G9MvIFVY9xHP4" alt="Gym background" />
        </div>
        
        {/* Deep Void Tonal Layer */}
        <div className="fixed inset-0 z-[-1] bg-surface/80 backdrop-blur-[10px]"></div>

        <main className="pt-[100px] pb-[120px] md:pb-[60px] px-6 max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
          
          {/* Active Protocol View */}
          {isExecuting ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] w-full animate-in fade-in zoom-in duration-500">
              {isProtocolComplete ? (
                <div className="glass-panel rounded-3xl p-12 text-center max-w-2xl w-full border border-cyan-500/50 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
                  <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-green-400 text-5xl">task_alt</span>
                  </div>
                  <h2 className="font-headline-lg text-4xl text-white mb-4 uppercase tracking-widest font-bold">Protocol Complete</h2>
                  <p className="text-on-surface-variant mb-8 text-lg">Excellent work, Operative. Training data synchronized.</p>
                  <button 
                    onClick={endProtocol}
                    className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold tracking-widest transition-colors border border-white/20"
                  >
                    RETURN TO DASHBOARD
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Image & Progress */}
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm">Active Protocol</span>
                      <span className="text-white font-mono bg-white/10 px-3 py-1 rounded-full text-xs">
                        {currentExIndex + 1} / {WORKOUT_PROTOCOL.length}
                      </span>
                    </div>
                    <div className="glass-panel rounded-3xl overflow-hidden aspect-video relative shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-cyan-500/30">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                      <img 
                        src={WORKOUT_PROTOCOL[currentExIndex].image} 
                        alt={WORKOUT_PROTOCOL[currentExIndex].name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-6 left-6 right-6 z-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider drop-shadow-lg">
                          {WORKOUT_PROTOCOL[currentExIndex].name}
                        </h2>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-cyan-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                        style={{ width: `${(timeLeft / WORKOUT_PROTOCOL[currentExIndex].duration) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Right: Timer & Controls */}
                  <div className="flex flex-col justify-center items-center glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-50"></div>
                    <div className="relative flex items-center justify-center w-64 h-64">
                      {/* Pulsing background ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" style={{ animationDuration: '2s' }}></div>
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <circle 
                          cx="50" cy="50" r="45" fill="none" 
                          stroke="#00f0ff" strokeWidth="4" 
                          strokeDasharray="283" 
                          strokeDashoffset={283 - (283 * (timeLeft / WORKOUT_PROTOCOL[currentExIndex].duration))}
                          className="transition-all duration-1000 ease-linear drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" 
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-7xl font-mono font-black text-white">{timeLeft}</span>
                        <span className="text-cyan-400 tracking-widest text-xs uppercase mt-1">Seconds</span>
                      </div>
                    </div>

                    <div className="mt-12 flex gap-4 w-full">
                      <button 
                        onClick={endProtocol}
                        className="flex-1 py-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold tracking-widest hover:bg-red-500/30 transition-colors"
                      >
                        ABORT
                      </button>
                      <button 
                        onClick={() => setTimeLeft(0)} // Skip to next
                        className="flex-1 py-4 rounded-xl bg-white/10 text-white border border-white/20 font-bold tracking-widest hover:bg-white/20 transition-colors"
                      >
                        SKIP
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Default Dashboard View
            <>
              {/* Page Context Header */}
              <div className="flex flex-col gap-1 mb-3">
                <h1 className="font-display-xl text-[48px] md:text-display-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary-container to-secondary-container drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] uppercase">NEXIS Trainer</h1>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_rgba(0,240,255,1)]"></span>
                  <span className="font-label-caps text-label-caps text-primary-fixed uppercase tracking-[0.2em]">Session Active</span>
                </div>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-4 md:grid-cols-12 gap-6">
                
                {/* Gym Recommender Panel (NEW) */}
                <div className="col-span-4 md:col-span-12 glass-panel rounded-2xl p-6 relative overflow-hidden border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-violet-500 opacity-80"></div>
                  <div className="flex justify-between items-center mb-6 pl-4">
                    <div>
                      <h2 className="font-label-caps text-label-caps text-cyan-400 tracking-[0.2em] mb-1">GYM RECOMMENDER & PLANNER</h2>
                      <p className="text-on-surface-variant text-sm max-w-2xl">AI recommendation engine scanning your sector for optimal training facilities.</p>
                    </div>
                    <div className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/50 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      <span className="text-[10px] text-cyan-400 font-bold tracking-widest">SCANNING LOCATIONS</span>
                    </div>
                  </div>
                  
                  {/* Google Maps Embed */}
                  <div className="w-full h-[350px] rounded-xl overflow-hidden border border-white/10 relative">
                    {/* Placeholder loading overlay */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-out fade-out duration-1000 delay-[2000ms] fill-mode-forwards pointer-events-none">
                      <span className="material-symbols-outlined text-4xl text-cyan-400 mb-2 animate-spin" style={{ animationDuration: '3s' }}>radar</span>
                      <span className="text-cyan-400 font-mono text-sm tracking-widest">CALIBRATING COORDINATES...</span>
                    </div>
                    <iframe 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%) opacity(80%)' }} // Dark mode styling for generic embed
                      loading="lazy" 
                      allowFullScreen 
                      referrerPolicy="no-referrer-when-downgrade" 
                      src={`https://maps.google.com/maps?q=gyms+fitness+centers+near+me&t=m&z=13&output=embed&iwloc=near`}
                    ></iframe>
                  </div>
                </div>

                {/* Neural Form Sync Panel */}
                <div className="col-span-4 md:col-span-8 bg-surface-container/70 backdrop-blur-[20px] rounded-xl border border-outline-variant p-6 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] group before:absolute before:inset-0 before:border-[1px] before:border-t-primary/30 before:border-l-primary/30 before:rounded-xl before:pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-secondary-container/5 opacity-50"></div>
                  <div className="flex justify-between items-start mb-12 relative z-10">
                    <h2 className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary-container">accessibility_new</span>
                      Neural Form Sync
                    </h2>
                    <span className="font-numeric-data text-[18px] text-secondary">98% Match</span>
                  </div>
                  
                  {/* HUD Visualizer Concept */}
                  <div className="relative w-full aspect-video max-h-[220px] flex items-center justify-center mt-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border-[1px] border-outline-variant/30 relative flex items-center justify-center">
                        <div className="absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-primary-container/20 to-transparent"></div>
                        <div className="absolute h-[120%] w-[1px] bg-gradient-to-b from-transparent via-primary-container/20 to-transparent"></div>
                        
                        {/* Biometric Ring Track */}
                        <div className="w-32 h-32 rounded-full border-[2px] border-surface-container-highest flex items-center justify-center relative">
                          <div className="absolute inset-[-2px] rounded-full border-[2px] border-transparent border-t-primary-container border-r-secondary-container" style={{transform: 'rotate(45deg)'}}></div>
                          <div className="text-center">
                            <span className="material-symbols-outlined text-[48px] text-primary-container drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]" style={{fontVariationSettings: "'FILL' 1"}}>body_system</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Telemetry Panel */}
                <div className="col-span-4 md:col-span-4 bg-surface-container/70 backdrop-blur-[20px] rounded-xl border border-outline-variant p-6 relative shadow-[0_8px_32px_rgba(0,0,0,0.5)] before:absolute before:inset-0 before:border-[1px] before:border-t-primary/30 before:border-l-primary/30 before:rounded-xl before:pointer-events-none flex flex-col">
                  <h2 className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2 mb-6 relative z-10">
                    <span className="material-symbols-outlined text-[16px] text-primary-container">monitor_heart</span>
                    Live Telemetry
                  </h2>
                  <div className="flex-1 flex flex-col justify-between gap-6 relative z-10">
                    {/* Stat Row */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-end">
                        <span className="font-body-md text-[14px] text-on-surface-variant">Heart Rate</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-numeric-data text-headline-md text-primary-container drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">164</span>
                          <span className="font-label-caps text-[10px] text-outline">BPM</span>
                        </div>
                      </div>
                      <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full w-[82%] bg-gradient-to-r from-primary-container to-error-container shadow-[0_0_8px_rgba(0,240,255,0.5)]"></div>
                      </div>
                    </div>
                    
                    {/* Stat Row */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-end">
                        <span className="font-body-md text-[14px] text-on-surface-variant">O2 Saturation</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-numeric-data text-headline-md text-on-surface">97</span>
                          <span className="font-label-caps text-[10px] text-outline">%</span>
                        </div>
                      </div>
                      <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full w-[97%] bg-primary-fixed-dim"></div>
                      </div>
                    </div>
                    
                    {/* Stat Row */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-end">
                        <span className="font-body-md text-[14px] text-on-surface-variant">Core Temp</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-numeric-data text-headline-md text-secondary drop-shadow-[0_0_10px_rgba(221,183,255,0.6)]">38.2</span>
                          <span className="font-label-caps text-[10px] text-outline">°C</span>
                        </div>
                      </div>
                      <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-secondary-container"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="col-span-4 md:col-span-4 bg-surface-container/70 backdrop-blur-[20px] rounded-xl border border-outline-variant p-6 relative shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-center items-center text-center">
                  <span className="font-label-caps text-label-caps text-outline mb-3">Exercises Queued</span>
                  <span className="font-numeric-data text-[56px] leading-none text-on-surface tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{WORKOUT_PROTOCOL.length}</span>
                </div>
                
                <div className="col-span-2 md:col-span-4 bg-surface-container/70 backdrop-blur-[20px] rounded-xl border border-outline-variant p-6 relative shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-center items-center text-center">
                  <span className="font-label-caps text-label-caps text-outline mb-3">Est. Duration</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-numeric-data text-[40px] leading-none text-primary-container drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">18</span>
                    <span className="font-label-caps text-[12px] text-outline">MIN</span>
                  </div>
                </div>
                
                <div className="col-span-2 md:col-span-4 bg-surface-container/70 backdrop-blur-[20px] rounded-xl border border-outline-variant p-6 relative shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-center items-center text-center">
                  <span className="font-label-caps text-label-caps text-outline mb-3">Intensity</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-numeric-data text-[40px] leading-none text-secondary drop-shadow-[0_0_15px_rgba(221,183,255,0.6)]">HIGH</span>
                  </div>
                </div>

                {/* Action Area */}
                <div className="col-span-4 md:col-span-12 mt-6">
                  <button 
                    onClick={startProtocol}
                    className="w-full md:w-auto md:min-w-[400px] mx-auto block py-6 px-8 rounded-full bg-gradient-to-r from-primary-container to-secondary-container text-surface-container-lowest font-label-caps text-[16px] font-extrabold tracking-[0.2em] uppercase relative overflow-hidden group shadow-[0_0_30px_rgba(111,0,190,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-shadow duration-300"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                      Execute Protocol
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </>
    </ProtectedRoute>
  );
}
