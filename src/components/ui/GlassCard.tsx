import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = false, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white/80 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-soft",
          hover && "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5",
          glow && "shadow-soft-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export { GlassCard };
