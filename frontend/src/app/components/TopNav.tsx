"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();
  
  // Hide TopNav on pre-login pages
  if (pathname === "/welcome" || pathname === "/onboarding" || pathname === "/login") {
    return null;
  }

  let title = "NEXIS";
  if (pathname === "/data" || pathname === "/fuel" || pathname === "/train") title = "HUB";
  if (pathname === "/settings") title = "SETTINGS";

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#050810]/70 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <Link href="/settings" className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-cyan-400">
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
        </Link>
        <button 
          onClick={() => {
            const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
            if (!clientId) {
              alert("Strava Client ID not found. Please set NEXT_PUBLIC_STRAVA_CLIENT_ID in your environment variables.");
              return;
            }
            window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${window.location.origin}/settings&approval_prompt=force&scope=activity:read_all`;
          }}
          title="Connect to Strava"
          className="w-10 h-10 rounded-full border border-orange-500/50 flex items-center justify-center bg-orange-500/10 hover:bg-orange-500/20 transition-colors text-orange-500"
        >
          <span className="material-symbols-outlined text-[20px]">directions_run</span>
        </button>
        <h1 className="font-sans font-black tracking-[0.15em] uppercase text-xl text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">{title}</h1>
      </div>
      <Link href="/settings" className="text-cyan-400 hover:text-cyan-300 hover:opacity-90 transition-all duration-300 active:scale-95 block">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
      </Link>
    </header>
  );
}
