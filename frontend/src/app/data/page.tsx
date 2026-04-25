"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function TelemetryData() {
  const { userProfile } = useAuth();
  
  let bmi = 0;
  if (userProfile?.latestMetrics?.weight && userProfile?.latestMetrics?.height) {
    const w = userProfile.latestMetrics.weight;
    const h = userProfile.latestMetrics.height / 100;
    bmi = Number((w / (h * h)).toFixed(1));
  }
  return (
    <ProtectedRoute>
      <main className="pt-[100px] pb-[120px] px-6 max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <section className="flex flex-col gap-2">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Telemetry Diagnostics</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Real-time performance metrics and predictive analysis. High-fidelity data stream active.</p>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Output Trend (Main Chart) */}
        <div className="md:col-span-8 glass-panel rounded-xl p-6 glow-accent flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-surface-tint to-secondary-container opacity-50"></div>
          
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-surface-tint uppercase">Output Trend</span>
              <div className="flex items-baseline gap-3">
                <span className="font-display-xl text-display-xl text-on-surface">845</span>
                <span className="font-numeric-data text-numeric-data text-on-surface-variant">kJ</span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-surface-tint/10 text-surface-tint rounded-full border border-surface-tint/30">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="font-label-caps text-label-caps">+12%</span>
            </div>
          </div>

          {/* Chart Mockup */}
          <div className="w-full h-[240px] mt-auto flex items-end gap-1 relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
              <div className="border-b border-on-surface-variant w-full h-0"></div>
              <div className="border-b border-on-surface-variant w-full h-0"></div>
              <div className="border-b border-on-surface-variant w-full h-0"></div>
              <div className="border-b border-on-surface-variant w-full h-0"></div>
            </div>
            
            {/* Bars */}
            <div className="w-full bg-surface-tint/20 rounded-t-sm h-[30%] hover:bg-surface-tint/40 transition-colors"></div>
            <div className="w-full bg-surface-tint/30 rounded-t-sm h-[45%] hover:bg-surface-tint/50 transition-colors"></div>
            <div className="w-full bg-surface-tint/40 rounded-t-sm h-[35%] hover:bg-surface-tint/60 transition-colors"></div>
            <div className="w-full bg-secondary-container/40 rounded-t-sm h-[60%] hover:bg-secondary-container/60 transition-colors"></div>
            <div className="w-full bg-secondary-container/50 rounded-t-sm h-[50%] hover:bg-secondary-container/70 transition-colors"></div>
            <div className="w-full bg-surface-tint/60 rounded-t-sm h-[75%] hover:bg-surface-tint/80 transition-colors relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface text-on-surface font-label-caps text-label-caps py-1 px-2 rounded border border-outline-variant shadow-lg whitespace-nowrap">Peak</div>
            </div>
            <div className="w-full bg-surface-tint/80 rounded-t-sm h-[90%] shadow-[0_0_15px_rgba(0,219,233,0.4)]"></div>
            <div className="w-full bg-surface-tint/40 rounded-t-sm h-[65%] hover:bg-surface-tint/60 transition-colors"></div>
          </div>
        </div>

        {/* Predictive Gains */}
        <div className="md:col-span-4 glass-panel rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-container rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
          
          <div className="flex flex-col gap-1 z-10">
            <span className="font-label-caps text-label-caps text-secondary uppercase">Predictive Gains</span>
            <span className="font-headline-md text-headline-md text-on-surface">Target Lock</span>
          </div>
          
          <div className="flex-grow flex flex-col justify-center items-center gap-6 z-10">
            {/* Circular Widget Mockup */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="45" stroke="rgba(28, 32, 40, 0.8)" strokeWidth="8"></circle>
                <circle cx="50" cy="50" fill="transparent" r="45" stroke="url(#cyan-violet-grad)" strokeDasharray="282.7" strokeDashoffset="60" strokeLinecap="round" strokeWidth="8"></circle>
                <defs>
                  <linearGradient id="cyan-violet-grad" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#00dbe9"></stop>
                    <stop offset="100%" stopColor="#6f00be"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-headline-md text-headline-md text-on-surface">82<span className="text-[20px] text-on-surface-variant">%</span></span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">Efficiency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Metrics Row */}
        <div className="md:col-span-4 glass-panel rounded-xl p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-surface-tint">
            <span className="material-symbols-outlined">ecg_heart</span>
            <span className="font-label-caps text-label-caps uppercase">Heart Rate</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-lg text-headline-lg text-on-surface">142</span>
            <span className="font-body-md text-body-md text-on-surface-variant">BPM</span>
          </div>
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden mt-auto">
            <div className="h-full bg-surface-tint w-[70%]"></div>
          </div>
        </div>

        <div className="md:col-span-4 glass-panel rounded-xl p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-secondary">
            <span className="material-symbols-outlined">air</span>
            <span className="font-label-caps text-label-caps uppercase">VO2 Max</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-lg text-headline-lg text-on-surface">54.2</span>
            <span className="font-body-md text-body-md text-on-surface-variant">mL/kg/min</span>
          </div>
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden mt-auto">
            <div className="h-full bg-secondary w-[85%]"></div>
          </div>
        </div>

        <div className="md:col-span-4 glass-panel rounded-xl p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-primary-container">
            <span className="material-symbols-outlined">accessibility_new</span>
            <span className="font-label-caps text-label-caps uppercase">Body Mass Index</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-lg text-headline-lg text-on-surface">{bmi || "--"}</span>
            <span className="font-body-md text-body-md text-on-surface-variant">kg/m²</span>
          </div>
          <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden mt-auto">
            <div className="h-full bg-primary-container" style={{ width: bmi ? `${Math.min((bmi / 40) * 100, 100)}%` : '0%' }}></div>
          </div>
        </div>

      </div>
    </main>
    </ProtectedRoute>
  );
}
