"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

// --- INTERACTIVE CHART DATA ---
const chartData = [
  { day: "MON", value: 150, power: "980W", velocity: "3.2m/s" },
  { day: "TUE", value: 160, power: "1,050W", velocity: "3.8m/s" },
  { day: "WED", value: 80, power: "1,180W", velocity: "4.5m/s" },
  { day: "THU", value: 100, power: "1,100W", velocity: "4.1m/s" },
  { day: "FRI", value: 40, power: "1,240W", velocity: "4.8m/s" },
  { day: "SAT", value: 70, power: "1,150W", velocity: "4.6m/s" },
  { day: "SUN", value: 90, power: "1,080W", velocity: "4.2m/s" },
];

// SVG path data points (approximate y-positions for each day along the chart)
const dataPoints = [
  { x: 0, y: 150 },
  { x: 133, y: 160 },
  { x: 266, y: 80 },
  { x: 400, y: 100 },
  { x: 533, y: 40 },
  { x: 666, y: 70 },
  { x: 800, y: 90 },
];

// --- STREAK LOGIC ---
function getStreak(): number[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("nexis_streak");
  const today = new Date().toISOString().slice(0, 10);
  let streakDays: string[] = stored ? JSON.parse(stored) : [];
  
  if (!streakDays.includes(today)) {
    streakDays.push(today);
    // Keep only last 30 days
    streakDays = streakDays.slice(-30);
    localStorage.setItem("nexis_streak", JSON.stringify(streakDays));
  }
  
  // Calculate consecutive streak from today backwards
  let count = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (streakDays.includes(key)) {
      count++;
    } else {
      break;
    }
  }
  
  // Return array of last 7 days with 1=active, 0=inactive
  const week: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    week.push(streakDays.includes(key) ? 1 : 0);
  }
  return week;
}

function getStreakCount(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("nexis_streak");
  const streakDays: string[] = stored ? JSON.parse(stored) : [];
  let count = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (streakDays.includes(key)) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

export default function Dashboard() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [streakWeek, setStreakWeek] = useState<number[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  
  // --- CHAT STATE ---
  const [chatMessages, setChatMessages] = useState<{role: string; text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    setStreakWeek(getStreak());
    setStreakCount(getStreakCount());
  }, []);

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newMessages = [...chatMessages, { role: "user", text: userMsg }];
    setChatMessages(newMessages);
    setChatLoading(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: newMessages.slice(-10) }),
      });
      const data = await res.json();
      setChatMessages([...newMessages, { role: "nexis", text: data.reply }]);
    } catch {
      setChatMessages([...newMessages, { role: "nexis", text: "Comms disrupted, Operative. Try again shortly. 💪" }]);
    }
    setChatLoading(false);
  };

  return (
    <ProtectedRoute>
      <main className="max-w-7xl mx-auto px-6 pt-[100px] pb-[120px]">
        {/* Header Section */}
        <section className="mb-10">
          <p className="font-label-caps text-label-caps text-primary mb-2 tracking-[0.15em]">SYSTEM TELEMETRY // ACTIVE</p>
          <h2 className="font-headline-lg text-headline-lg font-bold tracking-wider text-gradient-subtle uppercase">PERFORMANCE <span className="text-gradient">INSIGHTS</span></h2>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bio-Recovery Index */}
          <div className="md:col-span-4 glass-panel rounded-3xl p-8 glow-cyan-violet flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-transparent opacity-30"></div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-8 tracking-[0.1em]">BIO-RECOVERY INDEX</h3>
          <div className="relative w-48 h-48 rounded-full conic-gauge flex items-center justify-center">
            <div className="absolute inset-[10px] bg-background rounded-full flex flex-col items-center justify-center">
              <span className="font-display-xl text-5xl font-bold text-gradient">85</span>
              <span className="font-label-caps text-[10px] text-cyan-400 tracking-[0.2em] mt-1">OPTIMAL</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="text-center">
              <p className="text-[10px] font-label-caps text-on-surface-variant tracking-[0.1em]">HRV</p>
              <p className="font-numeric-data text-numeric-data text-white font-bold">72 <span className="font-normal text-sm text-on-surface-variant">ms</span></p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-[10px] font-label-caps text-on-surface-variant tracking-[0.1em]">SLEEP</p>
              <p className="font-numeric-data text-numeric-data text-white font-bold">8.2<span className="font-normal text-sm text-on-surface-variant">h</span></p>
            </div>
          </div>
        </div>

        {/* 7-Day Velocity Chart — INTERACTIVE */}
        <div className="md:col-span-8 glass-panel rounded-3xl p-8 glow-cyan-violet relative overflow-hidden min-h-[400px]">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.1em]">VELOCITY OVERVIEW</h3>
              <p className="font-headline-md text-headline-md text-white mt-1 font-bold">Output Trend</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold text-cyan-400 tracking-wider">7D VIEW</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-on-surface-variant tracking-wider">30D VIEW</span>
            </div>
          </div>
          {/* SVG Chart Visualization */}
          <div className="relative w-full h-48 mt-4">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="chartGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" style={{stopColor: '#00f0ff', stopOpacity: 1}}></stop>
                  <stop offset="100%" style={{stopColor: '#6f00be', stopOpacity: 1}}></stop>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur result="blur" stdDeviation="3"></feGaussianBlur>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                </filter>
                <filter id="dotGlow">
                  <feGaussianBlur stdDeviation="6" result="blur"></feGaussianBlur>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                </filter>
              </defs>
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M0,150 Q100,160 200,80 T400,100 T600,40 T800,90" fill="none" filter="url(#glow)" stroke="url(#chartGradient)" strokeLinecap="round" strokeWidth="4"
              />
              <path d="M0,150 Q100,160 200,80 T400,100 T600,40 T800,90 V200 H0 Z" fill="url(#chartGradient)" fillOpacity="0.05"></path>
              
              {/* Interactive data points */}
              {dataPoints.map((pt, i) => (
                <g key={i}>
                  {/* Invisible larger hitbox */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={30}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Visible dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint === i ? 10 : 4}
                    fill={hoveredPoint === i ? "#00f0ff" : "white"}
                    filter={hoveredPoint === i ? "url(#dotGlow)" : undefined}
                    stroke={hoveredPoint === i ? "white" : "none"}
                    strokeWidth={hoveredPoint === i ? 2 : 0}
                    className="transition-all duration-200"
                    style={{ pointerEvents: "none" }}
                  />
                  {/* Tooltip */}
                  {hoveredPoint === i && (
                    <g>
                      <rect x={pt.x - 60} y={pt.y - 65} width={120} height={50} rx={8} fill="rgba(10,14,23,0.95)" stroke="rgba(0,240,255,0.6)" strokeWidth={1.5} filter="url(#glow)" />
                      <text x={pt.x} y={pt.y - 42} textAnchor="middle" fill="#ffffff" fontSize={12} fontWeight="900" letterSpacing="0.05em">{chartData[i].day} — {chartData[i].power}</text>
                      <text x={pt.x} y={pt.y - 25} textAnchor="middle" fill="#00f0ff" fontSize={10} fontWeight="bold">Vel: {chartData[i].velocity}</text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
            <div className="absolute inset-0 flex justify-between items-end px-2 pointer-events-none">
              {chartData.map((d, i) => (
                <span key={i} className={`font-label-caps text-[10px] tracking-[0.1em] transition-colors ${hoveredPoint === i ? 'text-cyan-400' : 'text-on-surface-variant'}`}>{d.day}</span>
              ))}
            </div>
          </div>
          <div className="mt-8 flex gap-8">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-cyan-400 tracking-[0.1em]">PEAK POWER</span>
              <span className="font-numeric-data text-3xl font-bold text-white">1,240<span className="font-normal text-lg text-on-surface-variant ml-1">W</span></span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-secondary tracking-[0.1em]">AVG VELOCITY</span>
              <span className="font-numeric-data text-3xl font-bold text-white">4.8<span className="font-normal text-lg text-on-surface-variant ml-1">m/s</span></span>
            </div>
          </div>
        </div>

        {/* ====== DAILY STREAK ====== */}
        <div className="md:col-span-5 glass-panel rounded-3xl p-8 glow-accent relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 opacity-80"></div>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              {streakCount > 0 && <div className="absolute w-16 h-16 border border-orange-500/40 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>}
              <div className="relative text-5xl z-10" style={{ filter: streakCount > 0 ? 'drop-shadow(0 0 15px rgba(255,100,0,0.8))' : 'none' }}>
                {streakCount > 0 ? '🔥' : '❄️'}
              </div>
            </div>
            <div>
              <h3 className="font-label-caps text-label-caps text-orange-300 tracking-[0.2em] mb-1 drop-shadow-[0_0_5px_rgba(253,186,116,0.5)]">DAILY STREAK</h3>
              <p className="font-headline-md text-headline-md text-white font-black tracking-wider">{streakCount} <span className="text-on-surface-variant font-light text-2xl">Day{streakCount !== 1 ? 's' : ''}</span></p>
            </div>
          </div>

          {/* 7-day streak dots */}
          <div className="flex gap-4 justify-center">
            {streakWeek.map((active, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500 ${
                  active 
                    ? 'bg-gradient-to-br from-orange-400 to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110' 
                    : 'bg-black/40 border border-white/5 text-on-surface-variant/50'
                }`}>
                  {active ? '🔥' : '•'}
                </div>
                <span className={`text-[10px] font-label-caps tracking-widest ${active ? 'text-orange-200 font-bold' : 'text-on-surface-variant/50'}`}>{dayLabels[i]}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/80 text-sm mt-8 font-medium tracking-wide bg-white/5 py-2 px-4 rounded-full border border-white/10 inline-block w-full">
            {streakCount > 3 ? "You're unstoppable! Keep the fire burning. 🚀" : streakCount > 0 ? "Momentum building. Show up again tomorrow." : "Start your streak today — greatness awaits!"}
          </p>
        </div>

        {/* ====== VIRTUAL GYM BUDDY ====== */}
        <div className="md:col-span-7 glass-panel rounded-3xl p-8 glow-cyan-violet relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-cyan-400 opacity-30"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.1em]">NEXIS BUDDY</h3>
              <p className="text-xs text-cyan-400">AI Companion • Online</p>
            </div>
          </div>

          {!showChat ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              <p className="text-on-surface-variant text-center text-sm mb-6 max-w-sm">
                {"What's on your mind today, Operative? Talk to NEXIS — your AI gym buddy that motivates, tracks your mood, and keeps you accountable. 💪"}
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-8 w-full">
                 {["Need motivation! 🔥", "Give me a workout tip 🏋️", "I feel tired today 😴"].map(prompt => (
                   <button key={prompt} onClick={() => { setShowChat(true); setChatInput(prompt); }} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-cyan-100 font-medium hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-white transition-all shadow-sm">
                      {prompt}
                   </button>
                 ))}
              </div>

              <button 
                onClick={() => setShowChat(true)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold text-sm tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                OPEN CHAT INTERFACE
              </button>
            </div>
          ) : (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto max-h-[250px] space-y-3 mb-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {chatMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-on-surface-variant/50 text-sm mb-4">Say something to your AI buddy...</div>
                    <div className="flex flex-wrap justify-center gap-2 px-2">
                      {["Need motivation! 🔥", "Give me a workout tip 🏋️", "I feel tired today 😴"].map(prompt => (
                         <button key={prompt} onClick={() => { setChatInput(prompt); }} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-cyan-100 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-white transition-all">
                            {prompt}
                         </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500/20 border border-cyan-500/30 text-white rounded-br-sm' 
                        : 'bg-violet-500/10 border border-violet-500/20 text-white/90 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-violet-500/10 border border-violet-500/20 text-white/50 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                )}
              </div>
              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  placeholder="Talk to NEXIS..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <button 
                  onClick={sendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Predictive Milestone + ACTIVATE PROTOCOL */}
        <div className="md:col-span-7 glass-panel rounded-3xl p-1 glow-cyan-violet overflow-hidden group">
          <div className="bg-surface-container-lowest h-full w-full rounded-[22px] p-8 relative flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 mb-4">
                <span className="material-symbols-outlined text-sm text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                <span className="font-label-caps text-[10px] text-secondary tracking-[0.1em]">AI GYM TRAINER</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-white mb-3 font-bold">Activate Protocol</h3>
              <p className="font-body-md text-on-surface-variant mb-6 font-light leading-relaxed">Launch real-time pose tracking with computer vision. Your AI trainer will analyze your form, count reps, and correct posture — all from your webcam.</p>
              <button 
                onClick={() => router.push('/trainer')}
                className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-white tracking-widest text-sm shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-transform hover:scale-105 active:scale-95 uppercase"
              >
                ACTIVATE PROTOCOL
              </button>
            </div>
            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdhpvjFEUsrwgzrxbhJ_vTz6RhlX8ygNBeB0rQx0YnRwT4Ahh2m-YpgfsVtRJ8K8Woj7Lg404AvD-SxaMGsy2_nH00YkwrWEXglmloy1vP0pwpWfd5wZBcf4soTf_Dx-qS3K3h2a2UfBz94SYPiA1O2OZpa3tkAcPvdC7rgzGlnTTADoqhYFZJWlTklJtK8UPgahieMpXv7cRfX6UVevKYqJRSFlPJ_mMs0uixTkVsijVQaOS5LDFckycKzkFSLS0laKOkXmslvvr9" alt="Athletic weights" />
            </div>
          </div>
        </div>

        {/* Vital Telemetry */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border-l-2 border-l-cyan-400">
            <span className="material-symbols-outlined text-cyan-400 mb-4">ecg</span>
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">RESTING HR</p>
              <p className="font-numeric-data text-3xl font-bold text-white mt-1">48<span className="text-xs ml-1 font-normal text-on-surface-variant">BPM</span></p>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border-l-2 border-l-violet-400">
            <span className="material-symbols-outlined text-violet-400 mb-4">bolt</span>
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">NEURAL DRIVE</p>
              <p className="font-numeric-data text-3xl font-bold text-white mt-1">92<span className="text-xs ml-1 font-normal text-on-surface-variant">%</span></p>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border-l-2 border-l-tertiary-fixed-dim">
            <span className="material-symbols-outlined text-tertiary-fixed-dim mb-4">water_drop</span>
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">HYDRATION</p>
              <p className="font-numeric-data text-3xl font-bold text-white mt-1">0.8<span className="text-xs ml-1 font-normal text-on-surface-variant">L/HR</span></p>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border-l-2 border-l-primary-fixed-dim">
            <span className="material-symbols-outlined text-primary-fixed-dim mb-4">thermostat</span>
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">CORE TEMP</p>
              <p className="font-numeric-data text-3xl font-bold text-white mt-1">36.8<span className="text-xs ml-1 font-normal text-on-surface-variant">°C</span></p>
            </div>
          </div>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  );
}
