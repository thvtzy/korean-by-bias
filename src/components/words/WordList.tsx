"use client";

import { AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Word } from "@/types";
import { WordCard } from "./WordCard";
import { GlassCard } from "@/components/ui/GlassCard";

interface WordListProps {
  words: Word[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function WordList({ words, loading, onDelete }: WordListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <GlassCard key={i} className="p-5 animate-pulse">
            <div className="space-y-3">
              <div className="h-5 w-32 bg-white/[0.04] rounded" />
              <div className="h-4 w-48 bg-white/[0.02] rounded" />
            </div>
          </GlassCard>
        ))}
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <GlassCard className="p-12 text-center">
        <BookOpen className="mx-auto mb-4 text-white/15" size={40} />
        <h3 className="text-lg font-medium text-white/40 mb-2">
          No words yet
        </h3>
        <p className="text-sm text-white/25 max-w-xs mx-auto">
          Add your first word from a K-pop song, live stream, or variety show!
        </p>
      </GlassCard>
    );
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence mode="popLayout">
        {words.map((word, index) => (
          <WordCard
            key={word.id}
            word={word}
            index={index}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
