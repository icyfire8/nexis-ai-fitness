"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Target, MessageSquare, Hexagon } from "lucide-react";

// --- 1. THE MOVING NEURAL MESH BACKGROUND (CANVAS) ---
// This creates the constantly shifting constellation/network effect seen in your image.
const NetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Initialize particles
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Opacity fades as they get further apart
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - dist / 1000})`;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// --- 2. THE "BIKE" TEXT CAROUSEL ---
const FastCarouselText = () => {
  const words = ["IGNITE", "ADAPT", "BUILD", "EVOLVE"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Changes word every 2.5 seconds
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-3 text-2xl md:text-4xl font-bold tracking-widest text-white uppercase pointer-events-none whitespace-nowrap">
      <span className="text-neutral-400">NEXIS IS </span>
      <span>CALIBRATED TO...</span>
      
      {/* The Fast In/Out Animation */}
      <div className="relative w-48 h-12 flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            // Starts far left, skewed
            initial={{ x: -100, opacity: 0, skewX: -20 }}
            // Snaps to center, un-skews
            animate={{ x: 0, opacity: 1, skewX: 0 }}
            // Zooms out to the right, skews again
            exit={{ x: 100, opacity: 0, skewX: 20 }}
            transition={{ 
              duration: 0.4, 
              ease: "circOut" // Gives that snappy, aggressive feel
            }}
            className="absolute text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-black text-3xl md:text-5xl"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- 3. THE SKEWED GLASSMORPHIC CARD ---
const SkewedCard = ({ icon: Icon, label, delay = 0, yOffset = 0 }: { icon: any, label: string, delay?: number, yOffset?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: yOffset }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      // Applies the heavy tilt seen in the screenshot
      className="relative w-48 h-64 md:w-64 md:h-80 bg-white/5 border-2 border-white/10 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center transform -skew-x-[15deg] rotate-[5deg] hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-[0_0_50px_rgba(0,0,0,0.5)]"
    >
      {/* Un-skew the contents inside so the icon sits straight */}
      <div className="transform skew-x-[15deg] -rotate-[5deg] flex flex-col items-center gap-6">
        <Icon size={64} className="text-white group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        
        {/* The overlapping pill label */}
        <div className="absolute -bottom-4 md:-bottom-6 border-2 border-white bg-black/50 backdrop-blur-md text-white text-xs md:text-sm font-bold tracking-widest px-6 py-2 rounded-full uppercase transform skew-x-[15deg] -rotate-[5deg] group-hover:border-blue-400 transition-colors">
          {label}
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN HERO PAGE ---
export default function HeroPage() {
  const router = useRouter();
  const [isHolding, setIsHolding] = useState(false);
  const fillControls = useAnimation();

  // Hold to Initialize Logic
  const startHold = async () => {
    setIsHolding(true);
    await fillControls.start({
      width: "100%",
      transition: { duration: 1.5, ease: "linear" },
    });
    router.push("/onboarding");
  };

  const stopHold = () => {
    setIsHolding(false);
    fillControls.start({
      width: "0%",
      transition: { duration: 0.3 },
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* App Logo */}
      <div className="absolute top-6 left-6 z-40 flex items-center gap-3 select-none">
        <div className="relative flex items-center justify-center w-10 h-10">
          <Hexagon className="text-cyan-400 absolute w-full h-full" strokeWidth={1.5} />
          <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#A855F7]"></div>
        </div>
        <span className="text-white font-black tracking-[0.2em] text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">NEXIS</span>
      </div>

      {/* 1. Moving Background */}
      <NetworkBackground />

      {/* 2. Fast Text Carousel Overlay */}
      <FastCarouselText />

      {/* 3. The Skewed Cards Layout */}
      <div className="z-10 flex flex-row items-center justify-center gap-4 md:gap-12 mt-20 w-full px-4">
        <SkewedCard icon={User} label="Pose Tracking" delay={0.1} yOffset={20} />
        <SkewedCard icon={Target} label="Macros" delay={0.2} yOffset={-20} />
        <SkewedCard icon={MessageSquare} label="AI Chat" delay={0.3} yOffset={20} />
      </div>

      {/* 4. Bottom CTA Button */}
      <div className="absolute bottom-12 z-20 w-full flex justify-center">
        <div 
          className="relative group cursor-pointer"
          onPointerDown={startHold}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          // Support for mobile touch screens
          onTouchStart={startHold}
          onTouchEnd={stopHold}
        >
          {/* Subtle glow behind button */}
          <div className="absolute -inset-1 bg-white/10 rounded-full blur-md group-hover:bg-blue-500/20 transition-all duration-300"></div>
          
          <button className="relative w-72 h-14 bg-transparent border-2 border-white/30 rounded-full overflow-hidden flex items-center justify-center text-white font-bold uppercase tracking-widest text-sm transition-all group-hover:border-white">
            
            {/* The fill animation bar */}
            <motion.div
              animate={fillControls}
              initial={{ width: "0%" }}
              className="absolute left-0 top-0 bottom-0 bg-white/20 backdrop-blur-md"
            />
            
            <span className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
              {isHolding ? "Initializing..." : "Hold to Initialize"}
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
