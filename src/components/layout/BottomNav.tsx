"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: LayoutGrid, label: "Binder" },
  { href: "/review", icon: Sparkles, label: "Review" },
  { href: "/stats", icon: TrendingUp, label: "Stats" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-xl border-t border-border-subtle pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-lg mx-auto flex justify-around px-4 py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200",
                active
                  ? "text-accent-pink"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
