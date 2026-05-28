"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function Fuel() {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Local form state — seeded from profile metrics if available
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");

  // Seed form from user profile when it loads
  useEffect(() => {
    if (userProfile?.latestMetrics) {
      const m = userProfile.latestMetrics;
      if (m.weight) setWeight(String(m.weight));
      if (m.height) setHeight(String(m.height));
      if (m.age) setAge(String(m.age));
      if (m.goal) setGoal(m.goal);
    }
  }, [userProfile]);

  // Calculate BMI
  const bmi = (weight && height && Number(height) > 0)
    ? (Number(weight) / Math.pow(Number(height) / 100, 2)).toFixed(1)
    : null;

  const getBmiCategory = (bmiVal: number) => {
    if (bmiVal < 18.5) return { label: "Underweight", color: "text-yellow-400" };
    if (bmiVal < 25) return { label: "Normal", color: "text-green-400" };
    if (bmiVal < 30) return { label: "Overweight", color: "text-orange-400" };
    return { label: "Obese", color: "text-red-400" };
  };

  const handleGeneratePlan = async () => {
    setError(null);

    if (!weight || !height || !age || !goal) {
      setError("Please fill in all your metrics below before generating a plan.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const headers: Record<string, string> = { "Content-Type": "application/json" };

      // Add auth token if available
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          headers["Authorization"] = `Bearer ${token}`;
        } catch (e) {
          // Continue without auth — backend may still allow it
        }
      }

      const response = await fetch(`${API_URL}/api/fuel-plan`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          weight: Number(weight),
          height: Number(height),
          goal: goal,
          age: Number(age),
          activity_level: "moderate"
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Server error (${response.status})`);
      }

      const data = await response.json();
      setAiPlan(data);
    } catch (err: any) {
      console.error("Failed to generate plan:", err);
      setError(err.message || "Failed to connect to the server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  const goals = ["Hypertrophy (Build Muscle)", "Cut (Burn Fat)", "Endurance (Cardio)"];

  return (
    <ProtectedRoute>
    <main className="max-w-7xl mx-auto px-4 md:px-6 pt-[100px] pb-[120px]">
      {/* Header Section */}
      <div className="mb-10 mt-6">
        <h2 className="font-display-xl text-[48px] md:text-display-xl text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed-dim to-secondary-container text-glow uppercase tracking-tighter mb-2">METABOLIC FUELING</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Precision nutrition tailored for optimal performance.</p>
      </div>

      {/* BMI Card */}
      {bmi && (
        <div className="glass-card p-6 mb-8 glow-accent border-l-4 border-cyan-500/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-400 text-2xl">monitor_weight</span>
            </div>
            <div>
              <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em] block">BODY MASS INDEX</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-numeric-data text-3xl font-bold text-white">{bmi}</span>
                <span className="text-sm text-on-surface-variant">kg/m²</span>
                <span className={`text-xs font-bold tracking-wider uppercase ${getBmiCategory(Number(bmi)).color}`}>{getBmiCategory(Number(bmi)).label}</span>
              </div>
            </div>
          </div>
          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500" style={{ width: `${Math.min((Number(bmi) / 40) * 100, 100)}%` }}></div>
          </div>
        </div>
      )}

      {/* Metrics Input Panel */}
      <div className="glass-card p-6 mb-8 glow-cyan-violet border-l-4 border-violet-500/50">
        <div className="flex items-center gap-3 mb-5">
          <span className="material-symbols-outlined text-violet-400" style={{fontVariationSettings: "'FILL' 1"}}>tune</span>
          <h3 className="font-headline-md text-white font-bold text-sm tracking-widest uppercase">Your Metrics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Weight (kg)</label>
            <input
              type="number"
              placeholder="e.g. 75"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Height (cm)</label>
            <input
              type="number"
              placeholder="e.g. 180"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Age</label>
            <input
              type="number"
              placeholder="e.g. 24"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
            >
              <option value="" disabled className="bg-black text-neutral-500">Select Goal</option>
              {goals.map(g => (
                <option key={g} value={g} className="bg-black">{g}</option>
              ))}
            </select>
          </div>
        </div>
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
            {aiPlan.meals?.map((meal: any, idx: number) => {
              const mealIcons: Record<string, string> = {
                "Breakfast": "☀️🍳",
                "Mid-Morning Snack": "🥜🍎",
                "Lunch": "🍗🥗",
                "Pre-Workout": "🍌⚡",
                "Post-Workout": "💪🥤",
                "Dinner": "🥩🍚",
                "Evening Snack": "🥛🫐"
              };
              const icon = mealIcons[meal.name] || "🍽️";
              return (
              <div key={idx} className="bg-surface-container-highest/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center text-3xl">
                    {icon}
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
              );
            })}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {/* Call to Action */}
      <button 
        onClick={handleGeneratePlan}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-primary text-white font-label-caps text-label-caps tracking-widest uppercase shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all duration-300 mb-8 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>{loading ? 'sync' : 'auto_awesome'}</span>
        {loading ? 'Synthesizing...' : 'Generate Custom Plan'}
      </button>

    </main>
    </ProtectedRoute>
  );
}
