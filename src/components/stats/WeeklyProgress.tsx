"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";

interface WeeklyProgressProps {
  value: number;
  max: number;
}

export function WeeklyProgress({ value, max }: WeeklyProgressProps) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1">
      <ProgressBar
        value={value}
        max={max}
        label="Weekly goal"
        showValue
      />
      {pct >= 100 && (
        <p className="text-xs text-emerald-400 font-medium animate-fade-in">
          🎉 Goal reached! Keep going!
        </p>
      )}
    </div>
  );
}
