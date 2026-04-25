import ProtectedRoute from "../components/ProtectedRoute";

export default function Train() {
  return (
    <ProtectedRoute>
      <>
        {/* Atmospheric Background Layer */}
        <div className="fixed inset-0 z-[-2]">
          <img className="w-full h-full object-cover opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDifrJQYsEo_64SFpLYFMoyl_zpqTlN-bNB5osHt-iIfA-W-BE-vmsXDp6N0PA3GnF99Hw-6oc-B6cUchu_wZEjdJAQLFxeZUl1dlgEpwaRykKKrY2wMVZBjdbAk0QxHhd6-SHc-BSa4wYHZIpK2eIJxLTfAahDgz0vrWkXyLfjNMMv_2eC7xf1lDqbalxPXP-FJbki0GGmJvBKG3n8E9v27yNy4I1aEHjGEntaEf_aHpusEa4-oArfgzspfSRvVb6G9MvIFVY9xHP4" alt="Gym background" />
        </div>
        
        {/* Deep Void Tonal Layer */}
        <div className="fixed inset-0 z-[-1] bg-surface/80 backdrop-blur-[10px]"></div>

        <main className="pt-[100px] pb-[120px] md:pb-[60px] px-6 max-w-7xl mx-auto flex flex-col gap-6">
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
              <div className="relative w-full aspect-video max-h-[300px] flex items-center justify-center mt-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[1px] border-outline-variant/30 relative flex items-center justify-center">
                    <div className="absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-primary-container/20 to-transparent"></div>
                    <div className="absolute h-[120%] w-[1px] bg-gradient-to-b from-transparent via-primary-container/20 to-transparent"></div>
                    
                    {/* Biometric Ring Track */}
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[2px] border-surface-container-highest flex items-center justify-center relative">
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
              <span className="font-label-caps text-label-caps text-outline mb-3">Reps</span>
              <span className="font-numeric-data text-[56px] leading-none text-on-surface tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">12<span className="text-[24px] text-outline-variant">/15</span></span>
            </div>
            
            <div className="col-span-2 md:col-span-4 bg-surface-container/70 backdrop-blur-[20px] rounded-xl border border-outline-variant p-6 relative shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-center items-center text-center">
              <span className="font-label-caps text-label-caps text-outline mb-3">Velocity</span>
              <div className="flex items-baseline gap-1">
                <span className="font-numeric-data text-[40px] leading-none text-primary-container drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">1.24</span>
                <span className="font-label-caps text-[12px] text-outline">m/s</span>
              </div>
            </div>
            
            <div className="col-span-2 md:col-span-4 bg-surface-container/70 backdrop-blur-[20px] rounded-xl border border-outline-variant p-6 relative shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col justify-center items-center text-center">
              <span className="font-label-caps text-label-caps text-outline mb-3">Force Output</span>
              <div className="flex items-baseline gap-1">
                <span className="font-numeric-data text-[40px] leading-none text-secondary drop-shadow-[0_0_15px_rgba(221,183,255,0.6)]">850</span>
                <span className="font-label-caps text-[12px] text-outline">N</span>
              </div>
            </div>

            {/* Action Area */}
            <div className="col-span-4 md:col-span-12 mt-6">
              <button className="w-full md:w-auto md:min-w-[400px] mx-auto block py-6 px-8 rounded-full bg-gradient-to-r from-primary-container to-secondary-container text-surface-container-lowest font-label-caps text-[16px] font-extrabold tracking-[0.2em] uppercase relative overflow-hidden group shadow-[0_0_30px_rgba(111,0,190,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-shadow duration-300">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                  Execute Protocol
                </span>
              </button>
            </div>
          </div>
        </main>
      </>
    </ProtectedRoute>
  );
}
