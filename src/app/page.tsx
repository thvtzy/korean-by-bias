"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";
import { useWords } from "@/hooks/useWords";
import { useStats } from "@/hooks/useStats";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { WordForm } from "@/components/words/WordForm";
import { WordList } from "@/components/words/WordList";
import { StatsGrid } from "@/components/stats/StatsGrid";
import { WeeklyProgress } from "@/components/stats/WeeklyProgress";
import { GlassCard } from "@/components/ui/GlassCard";
import { Kbd } from "@/components/ui/Kbd";

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showForm, setShowForm] = useState(true);
  const wordInputRef = useRef<HTMLInputElement>(null);
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
  const { words, loading, addWord, deleteWord, undoLast, refetch } = useWords(userId);
  const { stats, refetch: refetchStats } = useStats(userId);

  const handleAddWord = useCallback(
    async (word: { word: string; meaning: string; example: string; source: string; language: string }) => {
      await addWord(word);
      refetchStats();
    },
    [addWord, refetchStats]
  );

  const handleDeleteWord = useCallback(
    async (id: string) => {
      await deleteWord(id);
      refetchStats();
    },
    [deleteWord, refetchStats]
  );

  useKeyboardShortcuts({
    "/": () => {
      setShowForm(true);
      setTimeout(() => wordInputRef.current?.focus(), 100);
    },
    "Ctrl+Enter": () => {
      setShowForm(true);
    },
    Esc: () => setShowForm(false),
    "Ctrl+z": () => {
      undoLast();
      refetchStats();
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-xs text-accent-pink animate-float">
          <Sparkles size={12} />
          Learn the words your biases say
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl gradient-text">
          Korean by Bias
        </h1>
        <p className="text-white/40 max-w-md mx-auto text-sm sm:text-base">
          Track vocabulary from K-pop songs, live streams, and variety shows.
          Review with smart flashcards.
        </p>
        <div className="flex items-center justify-center gap-3 text-[10px] text-white/20">
          <span><Kbd>/</Kbd> add word</span>
          <span><Kbd>Ctrl+Enter</Kbd> submit</span>
          <span><Kbd>Esc</Kbd> close</span>
          <span><Kbd>Ctrl+Z</Kbd> undo</span>
        </div>
      </motion.div>

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-5">
          <WeeklyProgress value={stats.wordsThisWeek} max={stats.weeklyGoal} />
        </GlassCard>
      </motion.div>

      {/* Add Word Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Add a Word</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="text-sm text-accent-pink hover:text-accent-purple"
              >
                Show form
              </button>
            )}
          </div>
          {showForm ? (
            <WordForm
              onSubmit={handleAddWord}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <p className="text-sm text-white/25">
              Press <Kbd>/</Kbd> to start adding words
            </p>
          )}
        </GlassCard>
      </motion.div>

      {/* Word List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Your Words
            {words.length > 0 && (
              <span className="ml-2 text-sm font-normal text-white/30">
                ({words.length})
              </span>
            )}
          </h2>
        </div>
        <WordList words={words} loading={loading} onDelete={handleDeleteWord} />
      </motion.div>
    </div>
  );
}
