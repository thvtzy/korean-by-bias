"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";
import { useWords } from "@/hooks/useWords";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { PhotoCardGrid } from "@/components/binder/PhotoCardGrid";
import { AddWordFAB } from "@/components/binder/AddWordFAB";
import { AddWordSheet } from "@/components/binder/AddWordSheet";
import { CardPullAnimation } from "@/components/binder/CardPullAnimation";

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showPullAnim, setShowPullAnim] = useState(false);
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
  const { words, loading, addWord } = useWords(userId);

  const handleSubmit = useCallback(
    async (data: { word: string; meaning: string; example: string; source: string; language: string }) => {
      await addWord(data);
      setSheetOpen(false);
      setShowPullAnim(true);
    },
    [addWord]
  );

  useKeyboardShortcuts({
    "/": () => setSheetOpen(true),
    "+": () => setSheetOpen(true),
    Esc: () => setSheetOpen(false),
  });

  const masteredCount = words.filter((w) => w.repetitions >= 3).length;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 pt-2"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-[11px] text-accent-pink animate-float">
          <Sparkles size={11} />
          Your photocard collection
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl gradient-text px-2">
          Apa sih artinya 진짜?
        </h1>
        <p className="text-text-muted max-w-sm mx-auto text-xs sm:text-sm px-2">
          Koleksi kata dari lagu & variety show favoritmu — disusun kayak photocard binder ✦
        </p>
        {masteredCount > 0 && (
          <p className="text-[11px] text-text-muted/70">
            <span className="font-semibold text-accent-pink">{masteredCount}</span> kata udah mastered
          </p>
        )}
      </motion.div>

      {/* PhotoCard Grid */}
      <PhotoCardGrid words={words} loading={loading} />

      {/* FAB */}
      <AddWordFAB onClick={() => setSheetOpen(true)} />

      {/* Add word sheet */}
      <AddWordSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Pull animation */}
      <CardPullAnimation
        show={showPullAnim}
        onComplete={() => setShowPullAnim(false)}
      />
    </div>
  );
}
