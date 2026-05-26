import { cn } from "@/lib/utils";

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center h-5 min-w-[20px] px-1.5",
        "text-[10px] font-medium text-white/40",
        "bg-white/[0.03] border border-white/[0.08] rounded-md",
        className
      )}
    >
      {children}
    </kbd>
  );
}
