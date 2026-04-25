"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();
  let title = "NEXIS";
  if (pathname === "/data" || pathname === "/fuel" || pathname === "/train") title = "HUB";
  if (pathname === "/settings") title = "SETTINGS";

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#050810]/70 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <Link href="/settings" className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant block">
          <img className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmKqBcnBwjgZsk-24ym5zK0xfpVoptFACFGjwHRME-OvX8Zgi3TOXQEceoXNDW6fj1uYIPGGuAwBO0JGN4FzYj0z00hVRIP6nj8yLqM1PdRxUfBI75G5zvHmP2bCkzD7XlgB7n4uaYQc3Pvq2CVmwl8qICAGKp1FFELVC6zFTjTTmREQ5FAdg9KJvnX8fUlRpkJIO6PlOQgWGxZGmegX-wzBfi_RSZ4x8yTYAkhUDf0YXFrkU99FYbASU0CLqcnY2IB5Dny6-ohivS" alt="User Profile" />
        </Link>
        <h1 className="font-sans font-black tracking-[0.15em] uppercase text-xl text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">{title}</h1>
      </div>
      <Link href="/settings" className="text-cyan-400 hover:text-cyan-300 hover:opacity-90 transition-all duration-300 active:scale-95 block">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
      </Link>
    </header>
  );
}
