"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, CalendarCheck, Flame, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";
import { useStats } from "@/hooks/useStats";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function StatsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) {
      setUser({ id: "demo", email: "demo@local" });
      return;
    }
    async function getSession() {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser({ id: data.session.user.id, email: data.session.user.email });
      }
    }
    getSession();
  }, [supabase]);

  const userId = user?.id;
  const { stats } = useStats(userId);

  const statCards = [
    { icon: TrendingUp, label: "Total Words", value: stats.totalWords, color: "text-accent-pink" },
    { icon: CalendarCheck, label: "This Week", value: stats.wordsThisWeek, color: "text-accent-lavender" },
    { icon: Flame, label: "Day Streak", value: stats.currentStreak, color: "text-holo-gold" },
    { icon: Trophy, label: "Due Review", value: stats.dueForReview, color: "text-accent-mint" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 text-center"
      >
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Your Progress ✦
        </h1>
        <p className="text-xs text-text-muted">Keep collecting, keep learning!</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <GlassCard key={label} className="p-4 text-center">
            <Icon className={`mx-auto mb-2 ${color}`} size={22} />
            <p className="text-2xl font-bold text-text-primary tabular-nums">{value}</p>
            <p className="text-[10px] text-text-muted mt-1">{label}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-5">
        <ProgressBar
          value={stats.wordsThisWeek}
          max={stats.weeklyGoal}
          label="Weekly Goal"
          showValue
        />
      </GlassCard>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-6 text-center space-y-2">
          <p className="text-5xl mb-2">🎀</p>
          <h2 className="font-display font-bold text-lg text-text-primary">
            Keep collecting, keep bias-ing!
          </h2>
          <p className="text-xs text-text-muted">
            Semakin sering review, semakin banyak kata yang mastered ✦
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
