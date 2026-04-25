"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <ProtectedRoute>
      <main className="max-w-7xl mx-auto px-6 pt-[100px] pb-[120px]">
        <section className="mb-10">
          <p className="font-label-caps text-label-caps text-secondary mb-2 tracking-[0.15em]">USER CONFIGURATION // OVERRIDE</p>
          <h2 className="font-headline-lg text-headline-lg font-bold tracking-wider text-gradient-subtle uppercase">SYSTEM <span className="text-gradient">SETTINGS</span></h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-transparent opacity-30"></div>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-2 border-primary-container p-1 relative shrink-0">
              <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center text-primary-fixed-dim">
                <span className="material-symbols-outlined text-[48px]">account_circle</span>
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-surface border border-primary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px] text-primary-container">edit</span>
              </div>
            </div>
            <div>
              <h3 className="font-headline-md text-white font-bold tracking-wider uppercase">{userProfile?.displayName || "USER PROFILE"}</h3>
              <p className="font-label-caps text-primary-container tracking-[0.1em]">{userProfile?.email}</p>
              <div className="flex gap-3 mt-3">
                <div className="inline-block px-3 py-1 bg-primary-container/20 border border-primary-fixed-dim text-primary-fixed-dim font-label-caps text-[10px] rounded-full uppercase">Standard Tier</div>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-error/10 border border-error/50 text-error font-label-caps text-[10px] rounded-full uppercase hover:bg-error hover:text-on-error transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[12px]">logout</span>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Integration Preferences */}
        <div className="md:col-span-7 glass-panel rounded-3xl p-8 glow-accent relative overflow-hidden">
           <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.1em] mb-6">AI PROTOCOL SETTINGS</h3>
           <div className="flex flex-col gap-6">
             <div className="flex justify-between items-center">
               <div>
                 <p className="font-body-lg text-white font-bold">Predictive Modeling</p>
                 <p className="font-body-md text-on-surface-variant text-sm">Allow AI to adjust macros based on recovery.</p>
               </div>
               <div className="w-12 h-6 bg-primary-container rounded-full relative shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer">
                 <div className="absolute right-1 top-1 w-4 h-4 bg-surface rounded-full"></div>
               </div>
             </div>
             <div className="h-[1px] w-full bg-white/5"></div>
             <div className="flex justify-between items-center">
               <div>
                 <p className="font-body-lg text-white font-bold">Neural Form Sync</p>
                 <p className="font-body-md text-on-surface-variant text-sm">Real-time biomechanical analysis during lifts.</p>
               </div>
               <div className="w-12 h-6 bg-primary-container rounded-full relative shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer">
                 <div className="absolute right-1 top-1 w-4 h-4 bg-surface rounded-full"></div>
               </div>
             </div>
             <div className="h-[1px] w-full bg-white/5"></div>
             <div className="flex justify-between items-center">
               <div>
                 <p className="font-body-lg text-white font-bold">Strict Protocol Mode</p>
                 <p className="font-body-md text-on-surface-variant text-sm">Enforce rigid adherence to scheduled programming.</p>
               </div>
               <div className="w-12 h-6 bg-surface-container-high rounded-full relative cursor-pointer">
                 <div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant rounded-full"></div>
               </div>
             </div>
           </div>
        </div>

        {/* Hardware Integrations */}
        <div className="md:col-span-12 glass-panel rounded-3xl p-8 glow-cyan-violet">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.1em] mb-6">BIOMETRIC SENSORS & HARDWARE</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/10 bg-surface-container-highest/50 rounded-2xl p-6 flex flex-col gap-4 items-start">
              <span className="material-symbols-outlined text-3xl text-secondary">watch</span>
              <div>
                <p className="font-body-lg text-white font-bold">NEXIS SmartBand</p>
                <p className="font-body-md text-on-surface-variant text-sm">Connected • Battery 84%</p>
              </div>
              <button className="text-[10px] font-bold text-secondary uppercase tracking-widest border border-secondary px-4 py-2 rounded-lg hover:bg-secondary/10">Configure</button>
            </div>
            <div className="border border-white/10 bg-surface-container-highest/50 rounded-2xl p-6 flex flex-col gap-4 items-start">
              <span className="material-symbols-outlined text-3xl text-primary-container">scale</span>
              <div>
                <p className="font-body-lg text-white font-bold">Bio-Impedance Plate</p>
                <p className="font-body-md text-on-surface-variant text-sm">Last Sync: 2 hours ago</p>
              </div>
              <button className="text-[10px] font-bold text-primary-container uppercase tracking-widest border border-primary-container px-4 py-2 rounded-lg hover:bg-primary-container/10">Configure</button>
            </div>
            <div className="border border-white/10 bg-surface-container-highest/50 rounded-2xl p-6 flex flex-col gap-4 items-start border-dashed border-outline-variant items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="material-symbols-outlined text-3xl text-outline-variant">add_circle</span>
              <p className="font-body-lg text-white font-bold mt-2">Add New Device</p>
            </div>
          </div>
        </div>
        
    </main>
    </ProtectedRoute>
  );
}
