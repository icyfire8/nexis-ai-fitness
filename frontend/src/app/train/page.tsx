"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const LIGHT_PROTOCOL = [
  { name: "Bodyweight Squats", duration: 30, image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop" },
  { name: "Knee Pushups", duration: 30, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop" },
  { name: "Plank Hold", duration: 30, image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=800&auto=format&fit=crop" },
  { name: "Jumping Jacks", duration: 30, image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800&auto=format&fit=crop" },
];

const HEAVY_PROTOCOL = [
  { name: "Barbell Squats", duration: 45, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop" },
  { name: "Pushups", duration: 45, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop" },
  { name: "Weighted Plank", duration: 60, image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=800&auto=format&fit=crop" },
  { name: "Dumbbell Rows", duration: 45, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop" },
  { name: "Burpees", duration: 45, image: "https://images.unsplash.com/photo-1599058945522-28d584b6f4ff?q=80&w=800&auto=format&fit=crop" }
];

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1200&auto=format&fit=crop"
];

export default function Train() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showIntensitySelect, setShowIntensitySelect] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState(LIGHT_PROTOCOL);
  
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isProtocolComplete, setIsProtocolComplete] = useState(false);
  
  // Geolocation
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapLoading, setMapLoading] = useState(true);

  // Carousel
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setMapLoading(false);
        },
        (err) => {
          console.error("Location error:", err);
          setMapLoading(false);
        }
      );
    } else {
      setMapLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isExecuting || showIntensitySelect) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isExecuting, showIntensitySelect]);

  // Timer logic for Execute Protocol
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExecuting && !isProtocolComplete) {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else {
        handleSkip(); // auto advance
      }
    }
    return () => clearTimeout(timer);
  }, [isExecuting, timeLeft, currentExIndex, isProtocolComplete]);

  const handleSkip = () => {
    if (currentExIndex < activeProtocol.length - 1) {
      setCurrentExIndex(currentExIndex + 1);
      setTimeLeft(activeProtocol[currentExIndex + 1].duration);
    } else {
      setIsProtocolComplete(true);
    }
  };

  const handleStop = () => {
    setIsExecuting(false);
    setIsProtocolComplete(false);
    setShowIntensitySelect(false);
  };

  const startProtocol = (protocol: any[]) => {
    setActiveProtocol(protocol);
    setShowIntensitySelect(false);
    setIsExecuting(true);
    setCurrentExIndex(0);
    setTimeLeft(protocol[0].duration);
    setIsProtocolComplete(false);
  };

  const mapUrl = location 
    ? `https://maps.google.com/maps?q=gyms+fitness+centers+near+${location.lat},${location.lng}&t=m&z=13&output=embed`
    : `https://maps.google.com/maps?q=gyms+fitness+centers+near+me&t=m&z=13&output=embed`;

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
                    onClick={handleStop}
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
                        {currentExIndex + 1} / {activeProtocol.length}
                      </span>
                    </div>
                    <div className="glass-panel rounded-3xl overflow-hidden aspect-video relative shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-cyan-500/30">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                      <img 
                        src={activeProtocol[currentExIndex].image} 
                        alt={activeProtocol[currentExIndex].name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-6 left-6 right-6 z-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider drop-shadow-lg">
                          {activeProtocol[currentExIndex].name}
                        </h2>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                      <div 
                        className="h-full bg-cyan-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                        style={{ width: `${(timeLeft / activeProtocol[currentExIndex].duration) * 100}%` }}
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
                          strokeDashoffset={283 - (283 * (timeLeft / activeProtocol[currentExIndex].duration))}
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
                        onClick={handleStop}
                        className="flex-1 py-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold tracking-widest hover:bg-red-500/30 transition-colors"
                      >
                        STOP
                      </button>
                      <button 
                        onClick={handleSkip}
                        className="flex-1 py-4 rounded-xl bg-white/10 text-white border border-white/20 font-bold tracking-widest hover:bg-white/20 transition-colors"
                      >
                        SKIP
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : showIntensitySelect ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] w-full animate-in fade-in zoom-in duration-500">
              <div className="glass-panel rounded-3xl p-8 max-w-4xl w-full border border-cyan-500/50 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-white tracking-widest uppercase">Select Training Intensity</h2>
                  <button onClick={() => setShowIntensitySelect(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Light Training */}
                  <div 
                    onClick={() => startProtocol(LIGHT_PROTOCOL)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer border border-green-500/30 hover:border-green-400 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                    <img src={LIGHT_PROTOCOL[0].image} className="w-full h-64 object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-6 left-6 z-20">
                      <h3 className="text-2xl font-black text-green-400 uppercase tracking-widest mb-1">Light Training</h3>
                      <p className="text-on-surface-variant text-sm">Low intensity, endurance & form focus</p>
                      <p className="text-white mt-3 font-mono text-xs opacity-70 group-hover:opacity-100 transition-opacity">{LIGHT_PROTOCOL.length} Exercises • ~{Math.ceil(LIGHT_PROTOCOL.reduce((a,b) => a + b.duration, 0) / 60)} Min</p>
                    </div>
                  </div>

                  {/* Heavy Training */}
                  <div 
                    onClick={() => startProtocol(HEAVY_PROTOCOL)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer border border-error/30 hover:border-error transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                    <img src={HEAVY_PROTOCOL[0].image} className="w-full h-64 object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-6 left-6 z-20">
                      <h3 className="text-2xl font-black text-error uppercase tracking-widest mb-1">Heavy Training</h3>
                      <p className="text-on-surface-variant text-sm">High intensity, muscle builder</p>
                      <p className="text-white mt-3 font-mono text-xs opacity-70 group-hover:opacity-100 transition-opacity">{HEAVY_PROTOCOL.length} Exercises • ~{Math.ceil(HEAVY_PROTOCOL.reduce((a,b) => a + b.duration, 0) / 60)} Min</p>
                    </div>
                  </div>
                </div>
              </div>
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
                
                {/* Moving Images Carousel */}
                <div className="col-span-4 md:col-span-12 glass-panel rounded-2xl p-0 relative overflow-hidden h-64 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  {CAROUSEL_IMAGES.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === carouselIndex ? 'opacity-50' : 'opacity-0'}`}
                      alt={`Fitness preview ${idx + 1}`}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-md">Elevate Your Training</h2>
                    <p className="text-cyan-400 tracking-wider text-sm mt-1">NEXIS AI-Guided Optimization</p>
                  </div>
                  {/* Indicators */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {CAROUSEL_IMAGES.map((_, idx) => (
                      <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === carouselIndex ? 'bg-cyan-400 w-6' : 'bg-white/30'}`}></div>
                    ))}
                  </div>
                </div>

                {/* Gym Recommender Panel */}
                <div className="col-span-4 md:col-span-12 glass-panel rounded-2xl p-6 relative overflow-hidden border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-violet-500 opacity-80"></div>
                  <div className="flex justify-between items-center mb-6 pl-4">
                    <div>
                      <h2 className="font-label-caps text-label-caps text-cyan-400 tracking-[0.2em] mb-1">GYM RECOMMENDER & PLANNER</h2>
                      <p className="text-on-surface-variant text-sm max-w-2xl">
                        {location ? "GPS lock acquired. Showing optimal facilities near your coordinates." : "Scanning your sector for optimal training facilities..."}
                      </p>
                    </div>
                    <div className="bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/50 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${location ? 'bg-green-400' : 'bg-cyan-400 animate-pulse'}`}></div>
                      <span className="text-[10px] text-cyan-400 font-bold tracking-widest">
                        {location ? "LOCATION SYNCED" : "SCANNING LOCATIONS"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Google Maps Embed */}
                  <div className="w-full h-[350px] rounded-xl overflow-hidden border border-white/10 relative">
                    {mapLoading && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-10 flex flex-col items-center justify-center animate-out fade-out duration-500 delay-[2000ms] fill-mode-forwards pointer-events-none">
                        <span className="material-symbols-outlined text-4xl text-cyan-400 mb-2 animate-spin" style={{ animationDuration: '3s' }}>radar</span>
                        <span className="text-cyan-400 font-mono text-sm tracking-widest">CALIBRATING COORDINATES...</span>
                      </div>
                    )}
                    <iframe 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%) opacity(80%)' }} 
                      loading="lazy" 
                      allowFullScreen 
                      referrerPolicy="no-referrer-when-downgrade" 
                      src={mapUrl}
                    ></iframe>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="col-span-4 md:col-span-6 bg-surface-container/70 backdrop-blur-[20px] rounded-xl border border-outline-variant p-6 relative shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-center items-center text-center">
                  <span className="font-label-caps text-label-caps text-outline mb-3">Available Protocols</span>
                  <span className="font-numeric-data text-[56px] leading-none text-on-surface tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">2</span>
                </div>
                
                <div className="col-span-4 md:col-span-6 bg-surface-container/70 backdrop-blur-[20px] rounded-xl border border-outline-variant p-6 relative shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-center items-center text-center">
                  <span className="font-label-caps text-label-caps text-outline mb-3">System Status</span>
                  <div className="flex items-center gap-2 text-green-400 mt-2">
                    <span className="material-symbols-outlined text-4xl drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">check_circle</span>
                    <span className="font-bold tracking-widest text-lg">READY</span>
                  </div>
                </div>

                {/* Action Area */}
                <div className="col-span-4 md:col-span-12 mt-6">
                  <button 
                    onClick={() => setShowIntensitySelect(true)}
                    className="w-full md:w-auto md:min-w-[400px] mx-auto block py-6 px-8 rounded-full bg-gradient-to-r from-primary-container to-secondary-container text-surface-container-lowest font-label-caps text-[16px] font-extrabold tracking-[0.2em] uppercase relative overflow-hidden group shadow-[0_0_30px_rgba(111,0,190,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-shadow duration-300"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                      Select Protocol
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
