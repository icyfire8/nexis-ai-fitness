"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Target, User, ChevronRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    alias: "",
    age: "",
    weight: "",
    height: "",
    goal: "",
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else finishCalibration();
  };

  const handleHealthSync = () => {
    setIsSyncing(true);
    // Simulate API delay connecting to Google Fit / Apple Health
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        weight: "78",
        height: "175",
        age: "28"
      }));
      setIsSyncing(false);
    }, 1500);
  };

  const finishCalibration = async () => {
    // Save to localStorage so we can retrieve it after login
    localStorage.setItem("nexis_pre_auth_data", JSON.stringify(formData));
    
    // Simulate Processing delay
    setStep(4);
    setTimeout(() => {
      router.push("/login"); // Route to login page
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-[90%] max-w-[440px] relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            NEXIS Calibration
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">
            Step {step > 3 ? 3 : step} of 3
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Basic Identity */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 text-blue-400 mb-6">
                  <User size={24} />
                  <h2 className="text-xl font-semibold text-white">Initialize Identity</h2>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Operative Alias</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.alias}
                    onChange={(e) => updateForm("alias", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: Biometrics */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3 text-purple-400">
                    <Activity size={24} />
                    <h2 className="text-xl font-semibold text-white">Biometric Data</h2>
                  </div>
                  <button 
                    onClick={handleHealthSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors text-white border border-white/20 disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-[14px]">sync</span>
                    )}
                    {isSyncing ? "Syncing..." : "Google Fit"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="e.g. 75"
                      value={formData.weight}
                      onChange={(e) => updateForm("weight", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Height (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 180"
                      value={formData.height}
                      onChange={(e) => updateForm("height", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 24"
                    value={formData.age}
                    onChange={(e) => updateForm("age", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: Goals */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 text-emerald-400 mb-6">
                  <Target size={24} />
                  <h2 className="text-xl font-semibold text-white">Primary Directive</h2>
                </div>
                <div className="space-y-3">
                  {["Hypertrophy (Build Muscle)", "Cut (Burn Fat)", "Endurance (Cardio)"].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => updateForm("goal", goal)}
                      className={`w-full flex items-center justify-between px-4 py-4 rounded-lg border transition-all ${
                        formData.goal === goal
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "bg-black/50 border-white/10 text-neutral-300 hover:border-white/30"
                      }`}
                    >
                      <span className="font-medium">{goal}</span>
                      {formData.goal === goal && <Check size={18} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Processing State */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <h2 className="text-xl font-semibold text-white animate-pulse">
                  Configuring AI Profile...
                </h2>
                <p className="text-neutral-400 text-sm">Synchronizing telemetry data.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          {step < 4 && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
              >
                <span>{step === 3 ? "Finalize" : "Proceed"}</span>
                {step < 3 && <ChevronRight size={18} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
