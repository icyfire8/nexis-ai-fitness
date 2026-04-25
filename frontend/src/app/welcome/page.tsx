"use client";

import { useState } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Activity, Crosshair, MessageSquare } from "lucide-react";

// --- 1. GLITCH TEXT COMPONENT ---
const GlitchText = () => {
  const words = ["IGNITE", "ADAPT", "EVOLVE"];
  const chars = "!<>-_\\\\/[]{}—=+*^?#________";
  const [displayText, setDisplayText] = useState(words[0]);
  const [wordIndex, setWordIndex] = useState(0);

  const handleHover = () => {
    let iterations = 0;
    const nextWord = words[(wordIndex + 1) % words.length];
    
    const interval = setInterval(() => {
      setDisplayText((prev) => 
        prev.split("").map((letter, index) => {
          if (index < iterations) return nextWord[index] || "";
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iterations >= nextWord.length) {
        clearInterval(interval);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
      iterations += 1 / 3;
    }, 30);
  };

  return (
    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
      NEXIS is calibrated to <br />
      <span 
        onMouseEnter={handleHover}
        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 cursor-crosshair transition-all duration-300"
      >
        [ {displayText} ]
      </span>
    </h1>
  );
};

// --- 2. 3D PARALLAX CARD COMPONENT ---
interface TiltCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isHovered: boolean;
  setHovered: (val: boolean) => void;
}

const TiltCard = ({ title, icon: Icon, children, isHovered, setHovered }: TiltCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Convert mouse position to rotation degrees
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-64 h-64 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-colors hover:border-white/30 hover:bg-white/10"
    >
      <div className="text-blue-400 mb-4">{Icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <div className="w-full mt-4 h-16 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---
export default function HeroPage() {
  const router = useRouter();
  const [isHolding, setIsHolding] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const fillControls = useAnimation();

  // --- 3. HOLD TO INITIALIZE LOGIC ---
  const startHold = async () => {
    setIsHolding(true);
    // Animate the button filling up over 1.5 seconds
    await fillControls.start({
      width: "100%",
      transition: { duration: 1.5, ease: "linear" }
    });
    // Once full, route to onboarding
    router.push("/onboarding");
  };

  const stopHold = () => {
    setIsHolding(false);
    // Quickly drain the button if they let go early
    fillControls.start({
      width: "0%",
      transition: { duration: 0.3 }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Neural Orbs (Simplified Mesh Alternative) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Content */}
      <div className="z-10 text-center flex flex-col items-center max-w-6xl mx-auto px-4 w-full">
        
        {/* Dynamic Typography */}
        <GlitchText />
        
        <p className="text-neutral-400 max-w-2xl text-lg mb-16">
          A unified AI ecosystem tracking your movements, optimizing your nutrition, and evolving your physical capabilities in real-time.
        </p>

        {/* 3D Glassmorphic Cards */}
        <div className="flex flex-col md:flex-row gap-8 mb-20 w-full justify-center">
          
          <TiltCard 
            title="Pose Tracking" 
            icon={<Activity size={32} />}
            isHovered={activeCard === 0}
            setHovered={(val) => setActiveCard(val ? 0 : null)}
          >
            {/* Live Simulation: Stick figure line expands on hover */}
            <motion.div 
              className="w-1 h-12 bg-blue-500 rounded-full origin-bottom"
              animate={{ scaleY: activeCard === 0 ? 0.5 : 1 }}
              transition={{ duration: 0.3, yoyo: Infinity }}
            />
          </TiltCard>

          <TiltCard 
            title="Macro Optimization" 
            icon={<Crosshair size={32} />}
            isHovered={activeCard === 1}
            setHovered={(val) => setActiveCard(val ? 1 : null)}
          >
            {/* Live Simulation: Progress bar fills on hover */}
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-purple-500"
                initial={{ width: "20%" }}
                animate={{ width: activeCard === 1 ? "100%" : "20%" }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </TiltCard>

          <TiltCard 
            title="AI Buddy" 
            icon={<MessageSquare size={32} />}
            isHovered={activeCard === 2}
            setHovered={(val) => setActiveCard(val ? 2 : null)}
          >
            {/* Live Simulation: Chat bubble appears on hover */}
            <motion.div 
              className="bg-white/10 px-4 py-2 rounded-xl text-xs text-neutral-300 border border-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: activeCard === 2 ? 1 : 0, y: activeCard === 2 ? 0 : 10 }}
            >
              "2 more reps. Let's go."
            </motion.div>
          </TiltCard>

        </div>

        {/* Biometric Hold CTA */}
        <div className="relative group cursor-pointer"
             onPointerDown={startHold}
             onPointerUp={stopHold}
             onPointerLeave={stopHold}>
          
          {/* Outer glow ring that snaps to mouse slightly via CSS */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
          
          <button className="relative w-64 h-16 bg-black border border-white/20 rounded-lg overflow-hidden flex items-center justify-center text-white font-semibold uppercase tracking-widest transition-transform active:scale-95 select-none touch-none">
            
            {/* The fill bar */}
            <motion.div 
              animate={fillControls}
              initial={{ width: "0%" }}
              className="absolute left-0 top-0 bottom-0 bg-white/20 backdrop-blur-sm"
            />
            
            <span className="relative z-10 flex items-center gap-3">
              {isHolding ? "Initializing..." : "Hold to Initialize"}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
