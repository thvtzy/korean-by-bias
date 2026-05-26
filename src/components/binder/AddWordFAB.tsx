"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddWordFABProps {
  onClick: () => void;
}

export function AddWordFAB({ onClick }: AddWordFABProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-2xl
                 bg-gradient-to-br from-accent-pink to-accent-lavender
                 text-white shadow-card flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <Plus size={28} strokeWidth={2.5} />
    </motion.button>
  );
}
