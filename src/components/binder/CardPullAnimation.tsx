"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CardPullAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export function CardPullAnimation({ show, onComplete }: CardPullAnimationProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={onComplete}
        >
          {/* Sleeve/packet */}
          <motion.div
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{ scale: 1, rotate: [0, -5, 3, 0] }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-36 aspect-[3/4] relative bg-gradient-to-br from-sleeve-song to-white rounded-2xl shadow-soft-lg border-2 border-white"
          >
            {/* Card sliding out */}
            <motion.div
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{ y: -120, opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeIn" }}
              className="absolute inset-2 rounded-xl bg-white flex items-center justify-center"
            >
              <span className="text-2xl">✦</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
