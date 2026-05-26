"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Word, ReviewResult, ReviewSessionState } from "@/types";
import { sm2 } from "@/lib/srs";

export function useReview(userId: string | undefined) {
  const [session, setSession] = useState<ReviewSessionState | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const startSession = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const now = new Date().toISOString();
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

    const sessionData: ReviewSessionState = {
      cards: data as Word[],
      currentIndex: 0,
      isFlipped: false,
      isComplete: false,
      results: [],
    };

    setSession(sessionData);
    setLoading(false);
    return sessionData;
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
      const result: ReviewResult = {
        wordId: card.id,
        quality,
        word: card.word,
      };

      const srsResult = sm2(
        quality,
        card.ease_factor,
        card.interval_days,
        card.repetitions
      );

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

      setSession((prev) => {
        if (!prev) return prev;
        const newResults = [...prev.results, result];
        const nextIndex = prev.currentIndex + 1;
        const isComplete = nextIndex >= prev.cards.length;

        return {
          ...prev,
          currentIndex: nextIndex,
          isFlipped: false,
          isComplete,
          results: newResults,
        };
      });
    },
    [session, supabase]
  );

  const endSession = useCallback(() => {
    setSession(null);
  }, []);

  return {
    session,
    loading,
    startSession,
    flipCard,
    rateCard,
    endSession,
  };
}
