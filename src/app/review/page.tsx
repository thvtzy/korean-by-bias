"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";
import { useReview } from "@/hooks/useReview";
import { PhotoReviewCard } from "@/components/review/PhotoReviewCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { useRouter } from "next/navigation";
import { ReviewResults } from "@/components/review/ReviewResults";

export default function ReviewPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [noCards, setNoCards] = useState(false);
  const router = useRouter();
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
  const { session, loading, startSession, flipCard, rateCard, endSession } = useReview(userId);

  useEffect(() => {
    if (userId && hasStarted && !session && !loading && !noCards) {
      startSession().then((result) => {
        if (result === null) setNoCards(true);
      });
    }
  }, [userId, hasStarted, session, loading, startSession, noCards]);

  const handleStart = () => {
    setHasStarted(true);
    setNoCards(false);
  };

  const handleRestart = useCallback(async () => {
    endSession();
    const result = await startSession();
    if (result === null) setNoCards(true);
  }, [endSession, startSession]);

  if (!userId) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <Loader2 className="mx-auto mb-4 animate-spin text-text-muted/40" size={32} />
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-[11px] text-accent-pink">
            <Sparkles size={11} />
            Spaced repetition
          </div>
          <h1 className="font-display font-bold text-3xl gradient-text">
            Review ✦
          </h1>
          <p className="text-text-muted text-sm">
            Flip photocard buat liat artinya, terus rate seberapa inget kamu. Nanti muncul lagi pas udah waktunya ✦
          </p>
          <NeoButton size="lg" onClick={handleStart}>
            Mulai Review
          </NeoButton>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <Loader2 className="mx-auto mb-4 animate-spin text-accent-pink" size={32} />
        <p className="text-text-muted text-sm">Nyiapin photocard kamu...</p>
      </div>
    );
  }

  if (noCards && !session) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm mx-auto space-y-6"
        >
          <GlassCard className="p-10">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-display text-xl font-bold text-text-primary mb-2">
              Selesai semua!
            </h2>
            <p className="text-text-muted text-sm mb-6">
              Belum ada kata yang perlu direview. Tambahin kata baru atau balik lagi nanti ✦
            </p>
            <div className="flex gap-3 justify-center">
              <NeoButton variant="outline" size="sm" onClick={() => router.push("/")}>
                Binder
              </NeoButton>
              <NeoButton size="sm" onClick={handleStart}>
                Cek Ulang
              </NeoButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  if (session?.isComplete) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <ReviewResults
          results={session.results}
          onReviewAgain={handleRestart}
          onBackToDashboard={() => {
            endSession();
            router.push("/");
          }}
        />
      </div>
    );
  }

  if (session && !session.isComplete) {
    const currentWord = session.cards[session.currentIndex];
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <PhotoReviewCard
          word={currentWord}
          isFlipped={session.isFlipped}
          onFlip={flipCard}
          onRate={rateCard}
          currentIndex={session.currentIndex}
          total={session.cards.length}
        />
      </div>
    );
  }

  return null;
}
