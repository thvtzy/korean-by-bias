"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Word } from "@/types";
import { formatRelativeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS: Record<string, string> = {
  ko: "Korean",
  ja: "Japanese",
  zh: "Mandarin",
  other: "Other",
};

interface WordCardProps {
  word: Word;
  index: number;
  onDelete: (id: string) => void;
}

export function WordCard({ word, index, onDelete }: WordCardProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 }}
      className={cn(
        "group relative bg-bg-surface backdrop-blur-sm border border-border-glass rounded-glass p-5",
        "transition-all duration-300 hover:border-border-accent hover:shadow-glow-sm hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white truncate">
              {word.word}
            </h3>
            <Badge variant={word.language === "ko" ? "pink" : "lavender"}>
              {LANGUAGE_LABELS[word.language] || word.language}
            </Badge>
          </div>
          <p className="text-white/70 text-sm">{word.meaning}</p>
        </div>

        <button
          onClick={() => onDelete(word.id)}
          className="shrink-0 p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label="Delete word"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {word.example && (
        <p className="mt-3 text-sm text-white/40 italic border-l-2 border-accent-pink/30 pl-3">
          {word.example}
        </p>
      )}

      {word.source && (
        <p className="mt-2 text-xs text-white/25">from {word.source}</p>
      )}

      <p className="mt-3 text-[10px] text-white/15">
        {formatRelativeDate(word.created_at)}
      </p>
    </motion.li>
  );
}
