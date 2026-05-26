"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Word } from "@/types";
import { detectCategory, SOURCE_STICKERS } from "@/lib/sourceDetector";
import { cn } from "@/lib/utils";

interface PhotoReviewCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (quality: number) => void;
  currentIndex: number;
  total: number;
}

const ratings = [
  { quality: 0, label: "Lupa", key: "1", color: "bg-rose-100 text-rose-500 border-rose-200 hover:bg-rose-200" },
  { quality: 3, label: "Susah", key: "2", color: "bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-200" },
  { quality: 4, label: "Lumayan", key: "3", color: "bg-emerald-100 text-emerald-600 border-emerald-200 hover:bg-emerald-200" },
  { quality: 5, label: "Gampang", key: "4", color: "bg-accent-pink/15 text-accent-pink border-accent-pink/30 hover:bg-accent-pink/25" },
];

const SLEEVE_BORDERS: Record<string, string> = {
  song: "border-sleeve-song",
  drama: "border-sleeve-drama",
  live: "border-sleeve-live",
  other: "border-sleeve-other",
};

export function PhotoReviewCard({
  word,
  isFlipped,
  onFlip,
  onRate,
  currentIndex,
  total,
}: PhotoReviewCardProps) {
  const category = detectCategory(word.source || "");
  const sticker = SOURCE_STICKERS[category];

  return (
    <div className="flex flex-col items-center gap-5">
      <span className="text-xs text-text-muted/60">
        {currentIndex + 1} / {total}
      </span>

      {/* Card with 3:4 ratio */}
      <div
        className="w-64 sm:w-72 cursor-pointer perspective-1000"
        onClick={onFlip}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative w-full aspect-[3/4] preserve-3d"
        >
          {/* Front */}
          <div
            className={cn(
              "absolute inset-0 rounded-3xl backface-hidden flex flex-col items-center justify-center p-6",
              "bg-white border-4 border-white shadow-card",
              isFlipped ? "" : "hover:shadow-card-hover"
            )}
          >
            <div className={cn("absolute top-0 left-0 right-0 h-3 rounded-t-2xl", SLEEVE_BORDERS[category])} />

            <span className="text-[10px] text-text-muted/60 mb-4 flex items-center gap-1">
              {sticker.emoji} {sticker.label}
            </span>

            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-pink/15 to-accent-lavender/15 border border-border-subtle flex items-center justify-center mb-3">
              <span className="text-3xl font-kr text-accent-pink">
                {word.word.charAt(0)}
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary text-center leading-tight">
              {word.word}
            </h2>

            <p className="mt-3 text-[11px] text-text-muted">Tap to reveal ✦</p>

            {word.source && (
              <div className="absolute bottom-4 text-[10px] text-text-muted bg-bg px-2.5 py-0.5 rounded-full">
                {word.source}
              </div>
            )}
          </div>

          {/* Back */}
          <div className="absolute inset-0 rounded-3xl backface-hidden rotateY-180 flex flex-col items-center justify-center p-6 bg-white border-4 border-white shadow-card">
            <div className={cn("absolute top-0 left-0 right-0 h-3 rounded-t-2xl", SLEEVE_BORDERS[category])} />

            <span className="text-[10px] text-text-muted/60 mb-2">
              {word.word}
            </span>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-primary text-center leading-tight mb-3">
              {word.meaning}
            </h2>

            {word.example && (
              <p className="text-sm text-text-secondary italic text-center max-w-xs">
                &ldquo;{word.example}&rdquo;
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Rating buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {ratings.map((r) => (
              <button
                key={r.quality}
                onClick={(e) => {
                  e.stopPropagation();
                  onRate(r.quality);
                }}
                className={cn(
                  "px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all active:scale-90",
                  r.color
                )}
              >
                {r.label}
                <span className="ml-1 text-[10px] opacity-40">({r.key})</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
