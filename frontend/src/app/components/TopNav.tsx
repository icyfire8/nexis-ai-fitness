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
      <h1 className="font-sans font-black tracking-[0.15em] uppercase text-xl text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">{title}</h1>
      <div className="flex items-center gap-4">
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
          className="group relative w-10 h-10 rounded-full border border-orange-500/50 flex items-center justify-center bg-orange-500/10 hover:bg-orange-500/20 transition-colors text-orange-500"
        >
          <span className="material-symbols-outlined text-[20px]">directions_run</span>
          {/* Custom Tooltip */}
          <span className="absolute -bottom-10 right-0 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none">
            Connect to Strava
          </span>
        </button>
        <Link href="/settings" className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-cyan-400">
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
        </Link>
      </div>
    </header>
  );
}
