"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatsData } from "@/types";
import { WEEKLY_GOAL } from "@/lib/utils";
import { calculateStreak } from "@/lib/streak";

export function useStats(userId: string | undefined) {
  const [stats, setStats] = useState<StatsData>({
    totalWords: 0,
    wordsThisWeek: 0,
    dueForReview: 0,
    currentStreak: 0,
    weeklyGoal: WEEKLY_GOAL,
  });
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    if (!userId || !supabase) return;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [{ count: total }, { count: thisWeek }, { count: due }, { data: streakData }] =
      await Promise.all([
        supabase.from("words").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase
          .from("words")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .gte("created_at", weekAgo.toISOString()),
        supabase
          .from("words")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .lte("next_review", now.toISOString()),
        supabase.from("streaks").select("*").eq("user_id", userId).single(),
      ]);

    if (streakData) {
      const updated = calculateStreak(
        streakData.last_open_date,
        streakData.current_streak,
        streakData.longest_streak
      );
      if (
        updated.currentStreak !== streakData.current_streak ||
        updated.longestStreak !== streakData.longest_streak
      ) {
        await supabase.from("streaks").upsert({
          user_id: userId,
          ...updated,
        });
      }
      setStats({
        totalWords: total || 0,
        wordsThisWeek: thisWeek || 0,
        dueForReview: due || 0,
        currentStreak: updated.currentStreak,
        weeklyGoal: WEEKLY_GOAL,
      });
    } else {
      setStats({
        totalWords: total || 0,
        wordsThisWeek: thisWeek || 0,
        dueForReview: due || 0,
        currentStreak: 0,
        weeklyGoal: WEEKLY_GOAL,
      });
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, refetch: fetchStats };
}
