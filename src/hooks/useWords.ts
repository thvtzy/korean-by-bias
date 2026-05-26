"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Word } from "@/types";
import { useToast } from "@/components/providers/ToastProvider";

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
    // quota exceeded, ignore
  }
}

function makeId(): string {
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2);
}

export function useWords(userId: string | undefined) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const supabase = createClient();

  const fetchWords = useCallback(async () => {
    if (supabase && userId) {
      const { data } = await supabase
        .from("words")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setWords(data || []);
    } else {
      setWords(loadLocal());
    }
    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const addWord = useCallback(
    async (word: Omit<Word, "id" | "user_id" | "created_at" | "ease_factor" | "interval_days" | "repetitions" | "next_review">) => {
      if (supabase && userId) {
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
        addToast("Word added ✦");
        return data as Word;
      }

      // localStorage fallback
      const now = new Date().toISOString();
      const newWord: Word = {
        id: makeId(),
        user_id: userId || "local",
        word: word.word,
        meaning: word.meaning,
        example: word.example || undefined,
        source: word.source || undefined,
        language: word.language || "ko",
        created_at: now,
        ease_factor: 2.5,
        interval_days: 0,
        repetitions: 0,
        next_review: now,
      };
      setWords((prev) => {
        const updated = [newWord, ...prev];
        saveLocal(updated);
        return updated;
      });
      addToast("Word added ✦");
      return newWord;
    },
    [userId, supabase, addToast]
  );

  const deleteWord = useCallback(
    async (id: string) => {
      if (supabase) {
        const wordToDelete = words.find((w) => w.id === id);
        setWords((prev) => prev.filter((w) => w.id !== id));
        const { error } = await supabase.from("words").delete().eq("id", id);
        if (error) {
          addToast("Failed to delete word");
          setWords((prev) => [...prev, wordToDelete!]);
        }
        return;
      }
      setWords((prev) => {
        const updated = prev.filter((w) => w.id !== id);
        saveLocal(updated);
        return updated;
      });
    },
    [words, supabase, addToast]
  );

  return { words, loading, addWord, deleteWord, refetch: fetchWords };
}
