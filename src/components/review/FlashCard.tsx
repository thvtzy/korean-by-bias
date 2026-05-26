"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Word } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

interface FlashCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (quality: number) => void;
  currentIndex: number;
  total: number;
}

const ratings = [
  { quality: 0, label: "Blackout", key: "1", color: "bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300" },
  { quality: 1, label: "Recognized", key: "2", color: "bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/30 text-orange-300" },
  { quality: 3, label: "Hard", key: "3", color: "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/30 text-yellow-300" },
  { quality: 4, label: "Good", key: "4", color: "bg-lime-500/20 hover:bg-lime-500/30 border-lime-500/30 text-lime-300" },
  { quality: 5, label: "Easy", key: "5", color: "bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/30 text-emerald-300" },
];

export function FlashCard({ word, isFlipped, onFlip, onRate, currentIndex, total }: FlashCardProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-white/30">
        {currentIndex + 1} / {total}
      </p>

      <div className="w-full max-w-md perspective-1000" onClick={onFlip}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative w-full aspect-[3/2] cursor-pointer preserve-3d"
        >
          {/* Front */}
          <GlassCard
            className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
            glow
          >
            <Badge variant="pink" className="mb-4">
              {word.language === "ko" ? "Korean" : word.language}
            </Badge>
            <p className="text-3xl sm:text-4xl font-bold text-white text-center">
              {word.word}
            </p>
            <p className="mt-4 text-xs text-white/20">Tap to reveal</p>
            {word.source && (
              <p className="mt-3 text-[11px] text-white/15">{word.source}</p>
            )}
          </GlassCard>

          {/* Back */}
          <GlassCard
            className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden rotateY-180"
            glow
          >
            <p className="text-xl font-semibold text-white/70 mb-3">
              {word.word}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-white text-center">
              {word.meaning}
            </p>
            {word.example && (
              <p className="mt-4 text-sm text-white/40 italic">
                &ldquo;{word.example}&rdquo;
              </p>
            )}
          </GlassCard>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {ratings.map((r) => (
              <button
                key={r.quality}
                onClick={(e) => {
                  e.stopPropagation();
                  onRate(r.quality);
                }}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 active:scale-95 ${r.color}`}
              >
                {r.label}
                <span className="ml-1.5 text-[10px] opacity-50">({r.key})</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
