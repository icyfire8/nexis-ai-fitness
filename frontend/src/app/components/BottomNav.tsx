"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Hub", href: "/", icon: "grid_view" },
    { name: "Train", href: "/train", icon: "fitness_center" },
    { name: "Fuel", href: "/fuel", icon: "restaurant" },
    { name: "Data", href: "/data", icon: "analytics" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-2 bg-[#050810]/90 backdrop-blur-2xl border-t border-purple-500/30 rounded-t-2xl shadow-[0_-8px_25px_rgba(0,240,255,0.15)] h-[80px]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.name} className={`flex flex-col items-center justify-center transition-all duration-200 w-16 py-1 ${isActive ? 'text-cyan-400 bg-cyan-400/10 rounded-xl px-4 shadow-[inset_0_0_10px_rgba(0,240,255,0.2)] scale-110' : 'text-slate-500 grayscale opacity-70 hover:text-cyan-200 hover:opacity-100'}`}>
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: `'FILL' ${isActive ? '1' : '0'}` }}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
