import ProtectedRoute from "./components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <main className="max-w-7xl mx-auto px-6 pt-[100px] pb-[120px]">
        {/* Header Section */}
        <section className="mb-10">
          <p className="font-label-caps text-label-caps text-primary mb-2 tracking-[0.15em]">SYSTEM TELEMETRY // ACTIVE</p>
          <h2 className="font-headline-lg text-headline-lg font-bold tracking-wider text-gradient-subtle uppercase">PERFORMANCE <span className="text-gradient">INSIGHTS</span></h2>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
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

        {/* 7-Day Velocity Chart (Col 8) */}
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
              </defs>
              <path d="M0,150 Q100,160 200,80 T400,100 T600,40 T800,90" fill="none" filter="url(#glow)" stroke="url(#chartGradient)" strokeLinecap="round" strokeWidth="4"></path>
              <path d="M0,150 Q100,160 200,80 T400,100 T600,40 T800,90 V200 H0 Z" fill="url(#chartGradient)" fillOpacity="0.05"></path>
            </svg>
            <div className="absolute inset-0 flex justify-between items-end px-2 pointer-events-none">
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">MON</span>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">TUE</span>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">WED</span>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">THU</span>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">FRI</span>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">SAT</span>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">SUN</span>
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

        {/* Predictive Milestone Card (Col 7) */}
        <div className="md:col-span-7 glass-panel rounded-3xl p-1 glow-cyan-violet overflow-hidden group">
          <div className="bg-surface-container-lowest h-full w-full rounded-[22px] p-8 relative flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 mb-4">
                <span className="material-symbols-outlined text-sm text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                <span className="font-label-caps text-[10px] text-secondary tracking-[0.1em]">PREDICTIVE MILESTONE</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-white mb-3 font-bold">Titanium Threshold</h3>
              <p className="font-body-md text-on-surface-variant mb-6 font-light leading-relaxed">Based on your current 7-day velocity trend, you are <strong className="text-white font-bold">94%</strong> likely to hit your 250kg deadlift target by next Friday.</p>
              <button className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-white tracking-widest text-sm shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-transform hover:scale-105 active:scale-95 uppercase">
                ACTIVATE PROTOCOL
              </button>
            </div>
            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdhpvjFEUsrwgzrxbhJ_vTz6RhlX8ygNBeB0rQx0YnRwT4Ahh2m-YpgfsVtRJ8K8Woj7Lg404AvD-SxaMGsy2_nH00YkwrWEXglmloy1vP0pwpWfd5wZBcf4soTf_Dx-qS3K3h2a2UfBz94SYPiA1O2OZpa3tkAcPvdC7rgzGlnTTADoqhYFZJWlTklJtK8UPgahieMpXv7cRfX6UVevKYqJRSFlPJ_mMs0uixTkVsijVQaOS5LDFckycKzkFSLS0laKOkXmslvvr9" alt="Athletic weights" />
            </div>
          </div>
        </div>

        {/* Vital Telemetry (Col 5) */}
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
