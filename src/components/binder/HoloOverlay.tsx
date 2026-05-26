"use client";

import { cn } from "@/lib/utils";

interface HoloOverlayProps {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}

export function HoloOverlay({ active, children, className }: HoloOverlayProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {active && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: `
              linear-gradient(
                135deg,
                transparent 0%,
                rgba(255,143,171,0.18) 25%,
                rgba(147,197,253,0.18) 50%,
                rgba(253,230,138,0.14) 75%,
                transparent 100%
              )
            `,
            backgroundSize: "200% 200%",
            animation: "holo-sweep 3s ease-in-out infinite",
          }}
        />
      )}
      {children}
    </div>
  );
}
