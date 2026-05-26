"use client";

import { Heart } from "lucide-react";
import { Word } from "@/types";
import { detectCategory, SOURCE_STICKERS } from "@/lib/sourceDetector";
import { cn } from "@/lib/utils";

interface PhotoCardProps {
  word: Word;
  onDelete?: (id: string) => void;
}

const ROTATIONS = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 0.5, -1, 2.5];
const SLEEVE_BORDERS: Record<string, string> = {
  song: "border-t-sleeve-song",
  drama: "border-t-sleeve-drama",
  live: "border-t-sleeve-live",
  other: "border-t-sleeve-other",
};

export function PhotoCard({ word }: PhotoCardProps) {
  const category = detectCategory(word.source || "");
  const sticker = SOURCE_STICKERS[category];
  const mastered = word.repetitions >= 3;

  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl shadow-card overflow-hidden",
        "border-4 border-white",
        "transition-all duration-300",
        "hover:shadow-card-hover hover:-translate-y-1",
        "aspect-[3/4] w-full",
        mastered && "holo-shimmer"
      )}
    >
      {/* Sleeve color top bar */}
      <div className={cn("h-2 w-full", SLEEVE_BORDERS[category])} />

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full px-3 py-4 text-center gap-2">
        {/* Polaroid frame */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-pink/15 to-accent-lavender/15 border border-border-subtle flex items-center justify-center mb-1">
          <span className="text-2xl font-kr text-accent-pink">
            {word.word.charAt(0)}
          </span>
        </div>

        {/* Word */}
        <p className="font-display font-bold text-lg text-text-primary leading-tight line-clamp-2">
          {word.word}
        </p>

        {/* Meaning */}
        <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
          {word.meaning}
        </p>

        {/* Source sticker */}
        <div className="mt-auto flex items-center gap-1 text-[10px] text-text-muted bg-bg/80 rounded-full px-2.5 py-0.5">
          <span>{sticker.emoji}</span>
          <span>{word.source || sticker.label}</span>
        </div>

        {/* Mastered badge */}
        {mastered && (
          <div className="absolute top-3 right-3">
            <Heart size={14} className="text-accent-pink" fill="#FF8FAB" />
          </div>
        )}
      </div>
    </div>
  );
}

export { ROTATIONS };
