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
        "text-[10px] font-medium text-text-muted",
        "bg-border-subtle border border-border-soft rounded-md",
        className
      )}
    >
      {children}
    </kbd>
  );
}
