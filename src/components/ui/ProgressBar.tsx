import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  label,
  showValue = false,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm text-text-secondary">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-text-primary">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2.5 bg-border-subtle rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-pink to-accent-lavender rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
