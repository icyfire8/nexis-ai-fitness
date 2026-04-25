"use client";

import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function Fuel() {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<any>(null);

  const handleGeneratePlan = async () => {
    if (!currentUser || !userProfile || !userProfile.latestMetrics) {
      console.error("Missing user metrics");
      return;
    }
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/fuel-plan`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          weight: userProfile.latestMetrics.weight,
          height: userProfile.latestMetrics.height,
          goal: userProfile.latestMetrics.goal,
          age: userProfile.latestMetrics.age,
          activity_level: userProfile.latestMetrics.activityLevel
        })
      });
      if (!response.ok) {
          throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setAiPlan(data);
    } catch (error) {
      console.error("Failed to generate plan:", error);
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
    <main className="max-w-7xl mx-auto px-4 md:px-6 pt-[100px] pb-[120px]">
      {/* Header Section */}
      <div className="mb-10 mt-6">
        <h2 className="font-display-xl text-[48px] md:text-display-xl text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed-dim to-secondary-container text-glow uppercase tracking-tighter mb-2">METABOLIC FUELING</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Precision nutrition tailored for optimal performance.</p>
      </div>

      {/* Macro Synthesis Rings */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="glass-card p-4 flex flex-col items-center justify-center glow-cyan-violet">
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
              <path className="text-primary-fixed-dim" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${aiPlan ? Math.min((aiPlan.nutrition.protein_g / 200) * 100, 100) : 75}, 100`} strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-numeric-data text-numeric-data text-on-surface">{aiPlan ? aiPlan.nutrition.protein_g : 120}<span className="text-sm">g</span></span>
            </div>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Protein</span>
        </div>

        <div className="glass-card p-4 flex flex-col items-center justify-center glow-cyan-violet">
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
              <path className="text-secondary-fixed-dim" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${aiPlan ? Math.min((aiPlan.nutrition.carbs_g / 300) * 100, 100) : 45}, 100`} strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-numeric-data text-numeric-data text-on-surface">{aiPlan ? aiPlan.nutrition.carbs_g : 240}<span className="text-sm">g</span></span>
            </div>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">CHO</span>
        </div>

        <div className="glass-card p-4 flex flex-col items-center justify-center glow-cyan-violet">
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
              <path className="text-tertiary-fixed-dim" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${aiPlan ? Math.min((aiPlan.nutrition.fat_g / 100) * 100, 100) : 60}, 100`} strokeWidth="3"></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-numeric-data text-numeric-data text-on-surface">{aiPlan ? aiPlan.nutrition.fat_g : 65}<span className="text-sm">g</span></span>
            </div>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Fat</span>
        </div>
      </div>

      {aiPlan && (
        <div className="glass-card p-6 mb-8 glow-accent border-l-4 border-primary-container">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary-container" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
            <h3 className="font-headline-md text-white font-bold">AI Recommended Plan</h3>
          </div>
          <p className="font-body-md text-on-surface-variant mb-6">{aiPlan.message}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiPlan.meals?.map((meal: any, idx: number) => (
              <div key={idx} className="bg-surface-container-highest/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-white/10">
                    <img 
                      src={`https://loremflickr.com/400/300/${encodeURIComponent(meal.search_term)},food/all`} 
                      alt={meal.food} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-primary-fixed-dim text-[10px] font-bold uppercase tracking-widest">{meal.name}</span>
                    <h4 className="font-bold text-white mb-1 leading-tight">{meal.food}</h4>
                    <p className="text-xs text-on-surface-variant">{meal.macros}</p>
                  </div>
                </div>
                <a 
                  href={`https://blinkit.com/s/?q=${encodeURIComponent(meal.search_term)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-[#F8CB46] text-black rounded-lg font-bold text-sm hover:bg-[#F8CB46]/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  Order on Blinkit
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <button 
        onClick={handleGeneratePlan}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-primary text-white font-label-caps text-label-caps tracking-widest uppercase shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all duration-300 mb-8 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span className="material-symbols-outlined">{loading ? 'sync' : 'auto_awesome'}</span>
        {loading ? 'Synthesizing...' : 'Generate Custom Plan'}
      </button>

    </main>
    </ProtectedRoute>
  );
}
