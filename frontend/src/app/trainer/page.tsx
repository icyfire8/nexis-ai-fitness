"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

// --- POSE SKELETON OVERLAY (simulated keypoints) ---
// These simulate where MediaPipe/OpenPose would place landmarks
const SKELETON_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 7],   // head chain
  [0, 4], [4, 5], [5, 6], [6, 8],   // head chain alt
  [9, 10],                            // mouth
  [11, 12],                           // shoulders
  [11, 13], [13, 15],                // left arm
  [12, 14], [14, 16],                // right arm
  [11, 23], [12, 24],                // torso
  [23, 24],                           // hips
  [23, 25], [25, 27],                // left leg
  [24, 26], [26, 28],                // right leg
];

export default function TrainerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(87);
  const [selectedExercise, setSelectedExercise] = useState("Squats");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedbackLog, setFeedbackLog] = useState<string[]>([
    "[NEXIS] System ready. Select exercise and begin.",
    "[NEXIS] Camera feed will be analyzed in real-time.",
  ]);
  const animFrameRef = useRef<number>(0);

  const exercises = ["Squats", "Pushups", "Deadlift", "Bicep Curls", "Plank"];

  // Simulated AI feedback messages
  const feedbackMessages = [
    "Good depth on that rep. Keep your chest up.",
    "Watch your knee alignment — tracking slightly inward.",
    "Core engagement detected. Excellent bracing.",
    "Slow down the eccentric phase for more gains.",
    "Hip hinge looks clean. Lock out at the top.",
    "Spine neutral — great form, Operative.",
    "Rep tempo: 2-1-2. Try 3-1-3 for hypertrophy.",
    "Shoulder blades retracted. Perfect setup.",
  ];

  // Start webcam
  const startCamera = useCallback(async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      setCameraError("Camera access denied. Please allow camera permission.");
      console.error("Camera error:", err);
    }
  }, []);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsAnalyzing(false);
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Draw skeleton overlay on canvas (simulated)
  const drawOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !cameraActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const w = canvas.width;
    const h = canvas.height;

    // Generate simulated keypoints that drift slightly each frame
    const t = Date.now() / 1000;
    const jitter = (base: number, amp: number) => base + Math.sin(t * 2 + base) * amp;

    const keypoints = [
      { x: jitter(w * 0.5, 3), y: jitter(h * 0.15, 2) },     // 0 nose
      { x: jitter(w * 0.48, 2), y: jitter(h * 0.13, 1) },     // 1 left eye inner
      { x: jitter(w * 0.46, 2), y: jitter(h * 0.12, 1) },     // 2 left eye
      { x: jitter(w * 0.44, 2), y: jitter(h * 0.13, 1) },     // 3 left eye outer
      { x: jitter(w * 0.52, 2), y: jitter(h * 0.13, 1) },     // 4 right eye inner
      { x: jitter(w * 0.54, 2), y: jitter(h * 0.12, 1) },     // 5 right eye
      { x: jitter(w * 0.56, 2), y: jitter(h * 0.13, 1) },     // 6 right eye outer
      { x: jitter(w * 0.42, 2), y: jitter(h * 0.14, 1) },     // 7 left ear
      { x: jitter(w * 0.58, 2), y: jitter(h * 0.14, 1) },     // 8 right ear
      { x: jitter(w * 0.48, 1), y: jitter(h * 0.18, 1) },     // 9 mouth left
      { x: jitter(w * 0.52, 1), y: jitter(h * 0.18, 1) },     // 10 mouth right
      { x: jitter(w * 0.38, 4), y: jitter(h * 0.32, 3) },     // 11 left shoulder
      { x: jitter(w * 0.62, 4), y: jitter(h * 0.32, 3) },     // 12 right shoulder
      { x: jitter(w * 0.32, 5), y: jitter(h * 0.48, 4) },     // 13 left elbow
      { x: jitter(w * 0.68, 5), y: jitter(h * 0.48, 4) },     // 14 right elbow
      { x: jitter(w * 0.28, 6), y: jitter(h * 0.60, 5) },     // 15 left wrist
      { x: jitter(w * 0.72, 6), y: jitter(h * 0.60, 5) },     // 16 right wrist
      { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },        // 17-19 (unused)
      { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },        // 20-22 (unused)
      { x: jitter(w * 0.42, 3), y: jitter(h * 0.65, 3) },     // 23 left hip
      { x: jitter(w * 0.58, 3), y: jitter(h * 0.65, 3) },     // 24 right hip
      { x: jitter(w * 0.40, 4), y: jitter(h * 0.80, 3) },     // 25 left knee
      { x: jitter(w * 0.60, 4), y: jitter(h * 0.80, 3) },     // 26 right knee
      { x: jitter(w * 0.39, 3), y: jitter(h * 0.95, 2) },     // 27 left ankle
      { x: jitter(w * 0.61, 3), y: jitter(h * 0.95, 2) },     // 28 right ankle
    ];

    ctx.clearRect(0, 0, w, h);

    if (isAnalyzing) {
      // Draw skeleton connections
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      SKELETON_CONNECTIONS.forEach(([a, b]) => {
        if (a < keypoints.length && b < keypoints.length) {
          const p1 = keypoints[a];
          const p2 = keypoints[b];
          
          const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          gradient.addColorStop(0, "rgba(0, 240, 255, 0.8)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0.8)");
          
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Draw keypoint dots
      keypoints.forEach((kp, i) => {
        if (i <= 16 || (i >= 23 && i <= 28)) {
          ctx.beginPath();
          ctx.arc(kp.x, kp.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 240, 255, 0.9)";
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw bounding box
      ctx.strokeStyle = "rgba(0, 240, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(w * 0.2, h * 0.05, w * 0.6, h * 0.9);
      ctx.setLineDash([]);

      // Draw angle annotations
      ctx.fillStyle = "rgba(0, 240, 255, 0.7)";
      ctx.font = "bold 11px monospace";
      const kneeAngle = Math.round(120 + Math.sin(t) * 15);
      ctx.fillText(`${kneeAngle}°`, keypoints[25].x + 10, keypoints[25].y);
      const hipAngle = Math.round(85 + Math.sin(t * 0.8) * 10);
      ctx.fillText(`${hipAngle}°`, keypoints[23].x - 30, keypoints[23].y);
    }

    animFrameRef.current = requestAnimationFrame(drawOverlay);
  }, [cameraActive, isAnalyzing]);

  // Start/stop overlay rendering
  useEffect(() => {
    if (cameraActive) {
      drawOverlay();
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [cameraActive, isAnalyzing, drawOverlay]);

  // Simulate rep counting and feedback
  useEffect(() => {
    if (!isAnalyzing) return;
    const repInterval = setInterval(() => {
      setRepCount((prev) => prev + 1);
      setFormScore(Math.min(100, Math.max(60, 87 + Math.round((Math.random() - 0.5) * 20))));
      const msg = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      setFeedbackLog((prev) => [...prev.slice(-8), `[AI] ${msg}`]);
    }, 3500);
    return () => clearInterval(repInterval);
  }, [isAnalyzing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <ProtectedRoute>
      <main className="max-w-7xl mx-auto px-6 pt-[100px] pb-[120px]">
        {/* Header */}
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => router.push('/')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <p className="font-label-caps text-label-caps text-primary tracking-[0.15em]">COMPUTER VISION // ACTIVE</p>
              <h2 className="font-headline-lg text-headline-lg font-bold tracking-wider text-gradient-subtle uppercase">AI GYM <span className="text-gradient">TRAINER</span></h2>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* --- MAIN CAMERA FEED --- */}
          <div className="md:col-span-8 glass-panel rounded-3xl overflow-hidden relative glow-cyan-violet">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-violet-500 opacity-50 z-20"></div>
            
            {/* Camera viewport */}
            <div className="relative w-full aspect-[4/3] bg-black flex items-center justify-center">
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover" 
                playsInline 
                muted
                style={{ transform: 'scaleX(-1)' }}
              />
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Camera off state */}
              {!cameraActive && (
                <div className="flex flex-col items-center gap-4 z-20">
                  <div className="w-24 h-24 rounded-full border-2 border-cyan-400/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-cyan-400/50">videocam</span>
                  </div>
                  <p className="text-on-surface-variant text-sm">{cameraError || "Camera feed inactive"}</p>
                  <button 
                    onClick={startCamera}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-bold text-white text-sm tracking-wider hover:scale-105 active:scale-95 transition-transform"
                  >
                    ACTIVATE CAMERA
                  </button>
                </div>
              )}

              {/* HUD Overlay when active */}
              {cameraActive && (
                <>
                  {/* Top-left badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-400/30">
                    <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                    <span className="text-[10px] font-bold text-white tracking-wider">{isAnalyzing ? 'ANALYZING' : 'STANDBY'}</span>
                  </div>
                  
                  {/* Top-right exercise label */}
                  <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-violet-400/30">
                    <span className="text-[10px] font-bold text-violet-400 tracking-wider">{selectedExercise.toUpperCase()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Camera controls bar */}
            {cameraActive && (
              <div className="flex items-center justify-between p-4 bg-black/40">
                <select 
                  value={selectedExercise}
                  onChange={(e) => { setSelectedExercise(e.target.value); setRepCount(0); }}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                >
                  {exercises.map((ex) => (
                    <option key={ex} value={ex} className="bg-black">{ex}</option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setIsAnalyzing(!isAnalyzing); if (!isAnalyzing) setRepCount(0); }}
                    className={`px-5 py-2 rounded-lg font-bold text-sm tracking-wider transition-all ${
                      isAnalyzing 
                        ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30' 
                        : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30'
                    }`}
                  >
                    {isAnalyzing ? 'STOP' : 'START ANALYSIS'}
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-on-surface-variant text-sm hover:bg-white/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">videocam_off</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT SIDEBAR TELEMETRY --- */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {/* Rep Counter */}
            <div className="glass-panel rounded-2xl p-6 glow-accent text-center">
              <p className="font-label-caps text-[10px] text-cyan-400 tracking-[0.1em] mb-2">REP COUNTER</p>
              <p className="text-6xl font-bold text-white font-mono">{repCount}</p>
              <p className="text-xs text-on-surface-variant mt-1">{selectedExercise}</p>
            </div>

            {/* Form Score Gauge */}
            <div className="glass-panel rounded-2xl p-6 glow-cyan-violet flex flex-col items-center">
              <p className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em] mb-4">FORM ACCURACY</p>
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                  <circle 
                    cx="50" cy="50" fill="transparent" r="42" 
                    stroke={formScore >= 80 ? "#00f0ff" : formScore >= 60 ? "#fbbf24" : "#ef4444"}
                    strokeWidth="8" 
                    strokeDasharray={`${(formScore / 100) * 264} 264`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{formScore}</span>
                  <span className="text-[10px] text-on-surface-variant">%</span>
                </div>
              </div>
              <p className="text-xs mt-3 font-bold tracking-wider" style={{ color: formScore >= 80 ? '#00f0ff' : formScore >= 60 ? '#fbbf24' : '#ef4444' }}>
                {formScore >= 85 ? 'EXCELLENT' : formScore >= 70 ? 'GOOD' : 'NEEDS WORK'}
              </p>
            </div>

            {/* Velocity */}
            <div className="glass-panel rounded-2xl p-6 border-l-2 border-l-violet-400">
              <p className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.1em]">REP VELOCITY</p>
              <p className="font-numeric-data text-3xl font-bold text-white mt-1">{(0.8 + Math.random() * 0.6).toFixed(1)}<span className="text-xs ml-1 font-normal text-on-surface-variant">m/s</span></p>
            </div>
          </div>

          {/* --- FEEDBACK TERMINAL --- */}
          <div className="md:col-span-12 glass-panel rounded-2xl p-6 glow-accent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-cyan-400 opacity-30"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.1em]">AI FEEDBACK TERMINAL</h3>
            </div>
            <div className="bg-black/40 rounded-xl p-4 font-mono text-sm max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
              {feedbackLog.map((msg, i) => (
                <p key={i} className={`${msg.startsWith('[AI]') ? 'text-cyan-400' : 'text-on-surface-variant/60'}`}>
                  <span className="text-white/30 mr-2">{String(i + 1).padStart(2, '0')}.</span>
                  {msg}
                </p>
              ))}
              {isAnalyzing && (
                <p className="text-green-400 animate-pulse">▌ Listening for movement data...</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
