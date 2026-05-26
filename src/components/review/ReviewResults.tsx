"use client";

import { motion } from "framer-motion";
import { Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import { ReviewResult } from "@/types";
import { NeoButton } from "@/components/ui/NeoButton";
import { GlassCard } from "@/components/ui/GlassCard";

interface ReviewResultsProps {
  results: ReviewResult[];
  onReviewAgain: () => void;
  onBackToDashboard: () => void;
}

export function ReviewResults({ results, onReviewAgain, onBackToDashboard }: ReviewResultsProps) {
  const correct = results.filter((r) => r.quality >= 3).length;
  const accuracy = results.length > 0 ? Math.round((correct / results.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8"
    >
      <GlassCard className="p-10 text-center max-w-sm w-full">
        <Sparkles className="mx-auto mb-4 text-accent-pink" size={36} />
        <h2 className="text-2xl font-bold text-text-primary mb-1">Session Complete!</h2>
        <p className="text-text-secondary text-sm mb-6">
          Great work reviewing your vocabulary ✦
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-bg rounded-xl p-4">
            <p className="text-3xl font-bold text-text-primary">{results.length}</p>
            <p className="text-[11px] text-text-muted">Cards</p>
          </div>
          <div className="bg-bg rounded-xl p-4">
            <p className="text-3xl font-bold text-accent-pink">{accuracy}%</p>
            <p className="text-[11px] text-text-muted">Accuracy</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <NeoButton variant="outline" size="sm" onClick={onBackToDashboard}>
            <ArrowRight size={16} />
            Dashboard
          </NeoButton>
          <NeoButton size="sm" onClick={onReviewAgain}>
            <RotateCcw size={16} />
            Review Again
          </NeoButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}
