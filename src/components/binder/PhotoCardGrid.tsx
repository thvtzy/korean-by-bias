"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera } from "lucide-react";
import { Word } from "@/types";
import { PhotoCard, ROTATIONS } from "./PhotoCard";

interface PhotoCardGridProps {
  words: Word[];
  loading: boolean;
}

export function PhotoCardGrid({ words, loading }: PhotoCardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 p-1">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-white/60 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Camera size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-display text-lg text-text-muted mb-1">
          Binder kosong nih!
        </h3>
        <p className="text-sm text-text-muted/70 max-w-xs">
          Tekan tombol + buat nambahin kata pertama dari lagu atau variety show favoritmu ✦
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 p-1">
      <AnimatePresence mode="popLayout">
        {words.map((word, i) => (
          <motion.div
            key={word.id}
            layout
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: ROTATIONS[i % ROTATIONS.length],
            }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              zIndex: 10,
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: Math.min(i * 0.04, 0.3),
            }}
            className="cursor-pointer"
          >
            <PhotoCard word={word} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
