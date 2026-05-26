"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Word } from "@/types";
import { useToast } from "@/components/providers/ToastProvider";

export function useWords(userId: string | undefined) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const supabase = createClient();

  const fetchWords = useCallback(async () => {
    if (!userId || !supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("words")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setWords(data || []);
    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const addWord = useCallback(
    async (word: Omit<Word, "id" | "user_id" | "created_at" | "ease_factor" | "interval_days" | "repetitions" | "next_review">) => {
      if (!supabase || !userId) {
        addToast("Supabase not configured");
        return null;
      }
      const { data, error } = await supabase
        .from("words")
        .insert({
          user_id: userId,
          word: word.word,
          meaning: word.meaning,
          example: word.example || null,
          source: word.source || null,
          language: word.language || "ko",
        })
        .select()
        .single();

      if (error) {
        addToast("Failed to add word");
        return null;
      }

      setWords((prev) => [data as Word, ...prev]);
      addToast("Word added!", "Undo", async () => {
        await supabase.from("words").delete().eq("id", data.id);
        setWords((prev) => prev.filter((w) => w.id !== data.id));
      });
      return data as Word;
    },
    [userId, supabase, addToast]
  );

  const deleteWord = useCallback(
    async (id: string) => {
      if (!supabase) return;
      const wordToDelete = words.find((w) => w.id === id);
      setWords((prev) => prev.filter((w) => w.id !== id));

      addToast("Word deleted", "Undo", async () => {
        if (wordToDelete) {
          const { error } = await supabase
            .from("words")
            .insert(wordToDelete)
            .select()
            .single();
          if (!error) {
            setWords((prev) => [wordToDelete, ...prev]);
          }
        }
      });

      const { error } = await supabase.from("words").delete().eq("id", id);
      if (error) {
        addToast("Failed to delete word");
        setWords((prev) => [...prev, wordToDelete!]);
      }
    },
    [words, supabase, addToast]
  );

  const undoLast = useCallback(async () => {
    if (!supabase || words.length === 0) return;
    const lastWord = words[0];
    const { error } = await supabase.from("words").delete().eq("id", lastWord.id);
    if (error) {
      addToast("Failed to undo");
      return;
    }
    setWords((prev) => prev.filter((w) => w.id !== lastWord.id));
    addToast("Word removed", "Undo", async () => {
      const { error: restoreError } = await supabase
        .from("words")
        .insert(lastWord)
        .select()
        .single();
      if (!restoreError) {
        setWords((prev) => [lastWord, ...prev]);
      }
    });
  }, [words, supabase, addToast]);

  return { words, loading, addWord, deleteWord, undoLast, refetch: fetchWords };
}
