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
      const response = await fetch(`${API_URL}/api/plan`, {
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiPlan.plan.map((dayPlan: any, idx: number) => (
              <div key={idx} className="bg-surface-container-highest/50 p-4 rounded-xl border border-white/5">
                <span className="text-primary-fixed-dim text-[10px] font-bold uppercase tracking-widest">{dayPlan.day}</span>
                <h4 className="font-bold text-white mb-2">{dayPlan.focus}</h4>
                <ul className="text-sm text-on-surface-variant flex flex-col gap-1">
                  {dayPlan.exercises.map((ex: string, i: number) => (
                    <li key={i}>• {ex}</li>
                  ))}
                </ul>
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

      {/* Featured Meal (Bento Main) */}
      <div className="glass-card overflow-hidden mb-8 glow-cyan-violet">
        <div className="relative h-64 w-full">
          <img alt="Salmon Power Bowl" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZyhOpKh-aRJ9pi218aTUl0bF6nONrKMVG9XONpdn4a7ErNXwPrMq65N57LOXFRs8nARrEsPUE53vsCyZo10pB0CmPwD7Nfp4jj1buPcUTDOgW17C7WupEvsao8O19O-NMsjTDdIF1G5w95jKcRUkbuSQaZHcyOgwIbCIYd0LMZOyx0_F75cUbm6_a9zJvddOvBM6WH_KFpjQCq4y5vdIWGllNxxrN7kIYWOEav5t5--gMpdoKw3PcCInG2VV6OR-nYL27x24Jr6hD" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <span className="inline-block px-3 py-1 bg-primary-container/20 border border-primary-fixed-dim text-primary-fixed-dim font-label-caps text-label-caps rounded-full mb-2 uppercase">Optimal Recovery</span>
                <h3 className="font-headline-md text-headline-md text-white mb-1">Omega Surge Bowl</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Wild caught salmon, black quinoa, edamame.</p>
              </div>
              <div className="text-right">
                <span className="block font-numeric-data text-numeric-data text-primary-fixed-dim">{aiPlan ? aiPlan.nutrition.calories : 650}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Snacks Section */}
      <h3 className="font-headline-lg text-[24px] md:text-headline-lg text-on-surface mb-6 uppercase tracking-tight flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary-fixed-dim" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
        Smart Snacks
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Snack 1 */}
        <div className="glass-card flex p-4 gap-4 items-center">
          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-secondary-container/50">
            <img alt="Mixed Nuts" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_v_BaRY_o6ebMcgcwvPRi4yEzruAh1B4YFgRG9gJRS9nKCL1S2gKD8flosiIJzBi8H01cdqvrvy2tY8renCjuOdlOoABB57_vbP_z-Pq9yKORV7M5iXPp7AUlaQjC2kS91ZbnvkXWZz8N2ltNhmTt9f6JUBKU0YDYeQadNO8EF8TIph-_bDBcd00y-UZAJdJZoTT5KHn81YFKLpXbq4TLwUmpy4CxrXH0gqgvamnv6LaDC0dFUzZqf5CR79jMB2AoaNLfb-P5CO7y" />
          </div>
          <div className="flex-1">
            <h4 className="font-body-lg text-body-lg font-bold text-on-surface mb-1">Raw Energy Mix</h4>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-2">High-density fats &amp; micronutrients.</p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-surface-container-high rounded text-xs font-label-caps text-label-caps text-on-surface-variant">FAT: 15g</span>
              <span className="px-2 py-0.5 bg-surface-container-high rounded text-xs font-label-caps text-label-caps text-on-surface-variant">PRO: 6g</span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-primary-fixed-dim flex items-center justify-center text-primary-fixed-dim hover:bg-primary-fixed-dim/10 transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* Snack 2 */}
        <div className="glass-card flex p-4 gap-4 items-center">
          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-secondary-container/50">
            <img alt="Greek Yogurt" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6RHcHuWQZ52voVDF94AhaZwEzmIMYkS1loTSfRkSA_4MzGdiIMOXz2xgY2toTnSoMJS7EY1OFkW_k5FCGeQIHn5ilp-28QQg-76rtHct8VSJ_WJCcgEwF9YrEi9BvvKKHnsQPISZqGMIV1HEzOE2c43ipZ7FnNYqwO9o_q0FdSdPl7Sb5h-aGSJ5CBbciFAHHld_1txmoPiR7CVUEeoaznEzspqkZuM_GR0idA-xPpPw99wyvA6nNL7VFRc9-70ASp25mX4Tr7xSf" />
          </div>
          <div className="flex-1">
            <h4 className="font-body-lg text-body-lg font-bold text-on-surface mb-1">Probiotic Base</h4>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-2">Slow-release casein &amp; antioxidants.</p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-surface-container-high rounded text-xs font-label-caps text-label-caps text-on-surface-variant">PRO: 20g</span>
              <span className="px-2 py-0.5 bg-surface-container-high rounded text-xs font-label-caps text-label-caps text-on-surface-variant">CHO: 12g</span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-primary-fixed-dim flex items-center justify-center text-primary-fixed-dim hover:bg-primary-fixed-dim/10 transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  );
}
