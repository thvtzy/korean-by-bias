"use client";

import { motion } from "framer-motion";
import { BookOpen, CalendarCheck, Flame, Layers } from "lucide-react";
import { StatsData } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";

interface StatsGridProps {
  stats: StatsData;
}

const statItems = [
  { key: "totalWords", icon: Layers, label: "Total Words", color: "text-accent-pink" },
  { key: "wordsThisWeek", icon: CalendarCheck, label: "This Week", color: "text-accent-purple" },
  { key: "currentStreak", icon: Flame, label: "Day Streak", color: "text-amber-400", suffix: "🔥" },
  { key: "dueForReview", icon: BookOpen, label: "Due Review", color: "text-emerald-400" },
];

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {statItems.map(({ key, icon: Icon, label, color, suffix }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
        >
          <GlassCard hover className="p-4 text-center">
            <Icon className={`mx-auto mb-2 ${color}`} size={20} />
            <p className="text-2xl font-bold text-white tabular-nums">
              {stats[key as keyof StatsData] as number}
              {suffix && stats[key as keyof StatsData] !== 0 ? (
                <span className="text-sm ml-0.5">{suffix}</span>
              ) : null}
            </p>
            <p className="text-[11px] text-white/40 mt-1">{label}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
