import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "pink" | "lavender" | "green";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-bg text-text-secondary border-border-subtle",
    pink: "bg-accent-pink/10 text-accent-pink border-accent-pink/20",
    lavender: "bg-accent-lavender/10 text-accent-lavender border-accent-lavender/20",
    green: "bg-accent-mint/10 text-accent-mint border-accent-mint/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
