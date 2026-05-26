"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Word, ReviewResult, ReviewSessionState } from "@/types";
import { sm2 } from "@/lib/srs";

const LOCAL_KEY = "kbb_words";

function loadLocal(): Word[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocal(words: Word[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(words));
  } catch {
    // ignore
  }
}

export function useReview(userId: string | undefined) {
  const [session, setSession] = useState<ReviewSessionState | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const startSession = useCallback(async () => {
    setLoading(true);
    const now = new Date().toISOString();

    if (supabase && userId) {
      const { data } = await supabase
        .from("words")
        .select("*")
        .eq("user_id", userId)
        .lte("next_review", now)
        .order("next_review", { ascending: true })
        .limit(20);

      if (!data || data.length === 0) {
        setLoading(false);
        return null;
      }

      setSession({
        cards: data as Word[],
        currentIndex: 0,
        isFlipped: false,
        isComplete: false,
        results: [],
      });
      setLoading(false);
      return data as Word[];
    }

    // localStorage fallback
    const allWords = loadLocal();
    const due = allWords
      .filter((w) => w.next_review <= now)
      .sort((a, b) => a.next_review.localeCompare(b.next_review))
      .slice(0, 20);

    if (due.length === 0) {
      setLoading(false);
      return null;
    }

    setSession({
      cards: due,
      currentIndex: 0,
      isFlipped: false,
      isComplete: false,
      results: [],
    });
    setLoading(false);
    return due;
  }, [userId, supabase]);

  const flipCard = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, isFlipped: !prev.isFlipped };
    });
  }, []);

  const rateCard = useCallback(
    async (quality: number) => {
      if (!session || session.isComplete) return;

      const card = session.cards[session.currentIndex];
      const srsResult = sm2(
        quality,
        card.ease_factor,
        card.interval_days,
        card.repetitions
      );

      if (supabase) {
        await supabase
          .from("words")
          .update({
            ease_factor: srsResult.easeFactor,
            interval_days: srsResult.intervalDays,
            repetitions: srsResult.repetitions,
            next_review: srsResult.nextReview.toISOString(),
            last_reviewed: new Date().toISOString(),
          })
          .eq("id", card.id);
      } else {
        // localStorage: update the word in place
        const all = loadLocal();
        const idx = all.findIndex((w) => w.id === card.id);
        if (idx !== -1) {
          all[idx] = {
            ...all[idx],
            ease_factor: srsResult.easeFactor,
            interval_days: srsResult.intervalDays,
            repetitions: srsResult.repetitions,
            next_review: srsResult.nextReview.toISOString(),
            last_reviewed: new Date().toISOString(),
          };
          saveLocal(all);
        }
      }

      setSession((prev) => {
        if (!prev) return prev;
        const result: ReviewResult = {
          wordId: card.id,
          quality,
          word: card.word,
        };
        const newResults = [...prev.results, result];
        const nextIndex = prev.currentIndex + 1;
        const isComplete = nextIndex >= prev.cards.length;
        return { ...prev, currentIndex: nextIndex, isFlipped: false, isComplete, results: newResults };
      });
    },
    [session, supabase]
  );

  const endSession = useCallback(() => {
    setSession(null);
  }, []);

  return { session, loading, startSession, flipCard, rateCard, endSession };
}
