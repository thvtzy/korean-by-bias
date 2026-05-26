"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatsData } from "@/types";
import { WEEKLY_GOAL } from "@/lib/utils";

const LOCAL_KEY = "kbb_words";
const STREAK_KEY = "kbb_streak";

function getLocalCount(): { total: number; thisWeek: number; due: number } {
  if (typeof window === "undefined") return { total: 0, thisWeek: 0, due: 0 };
  try {
    const words = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const total = words.length;
    const thisWeek = words.filter(
      (w: { created_at: string }) => new Date(w.created_at) >= weekAgo
    ).length;
    const due = words.filter(
      (w: { next_review: string }) => new Date(w.next_review) <= now
    ).length;
    return { total, thisWeek, due };
  } catch {
    return { total: 0, thisWeek: 0, due: 0 };
  }
}

function getLocalStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "null");
    if (!data) return 0;
    const today = new Date().toISOString().split("T")[0];
    const lastDate = data.lastOpenDate;
    const diff = Math.floor(
      (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return data.streak;
    if (diff === 1) return data.streak + 1;
    return 1;
  } catch {
    return 0;
  }
}

function saveLocalStreak(streak: number) {
  try {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(STREAK_KEY, JSON.stringify({ streak, lastOpenDate: today }));
  } catch {
    // ignore
  }
}

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
    if (supabase && userId) {
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

      const streak = streakData?.current_streak || 0;
      setStats({
        totalWords: total || 0,
        wordsThisWeek: thisWeek || 0,
        dueForReview: due || 0,
        currentStreak: streak,
        weeklyGoal: WEEKLY_GOAL,
      });
      return;
    }

    // localStorage fallback
    const counts = getLocalCount();
    const streak = getLocalStreak();
    if (streak > 0) saveLocalStreak(streak);

    setStats({
      totalWords: counts.total,
      wordsThisWeek: counts.thisWeek,
      dueForReview: counts.due,
      currentStreak: streak,
      weeklyGoal: WEEKLY_GOAL,
    });
  }, [userId, supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, refetch: fetchStats };
}
