"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";
import { useReview } from "@/hooks/useReview";
import { FlashCard } from "@/components/review/FlashCard";
import { ReviewResults } from "@/components/review/ReviewResults";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [noCards, setNoCards] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getSession() {
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
    if (userId && hasStarted && !session && !loading) {
      startSession().then((result) => {
        if (result === null) {
          setNoCards(true);
        }
      });
    }
  }, [userId, hasStarted, session, loading, startSession]);

  const handleStart = () => {
    setHasStarted(true);
    setNoCards(false);
  };

  const handleRestart = useCallback(async () => {
    endSession();
    const result = await startSession();
    if (result === null) setNoCards(true);
  }, [endSession, startSession]);

  // No user check
  if (!userId) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Loader2 className="mx-auto mb-4 animate-spin text-white/30" size={32} />
        <p className="text-white/40">Loading...</p>
      </div>
    );
  }

  // Landing state
  if (!hasStarted) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto space-y-6"
        >
          <BookOpen className="mx-auto text-accent-pink" size={48} />
          <h1 className="font-display font-bold text-3xl sm:text-4xl gradient-text">
            Review Mode
          </h1>
          <p className="text-white/40 text-sm">
            Cards will appear based on spaced repetition. Rate your recall honestly —
            the algorithm adapts to you.
          </p>
          <NeoButton size="lg" onClick={handleStart}>
            Start Review Session
          </NeoButton>
        </motion.div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Loader2 className="mx-auto mb-4 animate-spin text-accent-pink" size={32} />
        <p className="text-white/40">Loading your cards...</p>
      </div>
    );
  }

  // No cards due
  if (noCards && !session) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto space-y-6"
        >
          <GlassCard className="p-10">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-white mb-2">All caught up!</h2>
            <p className="text-white/40 text-sm mb-6">
              No words due for review right now. Add more words or come back later.
            </p>
            <div className="flex gap-3 justify-center">
              <NeoButton variant="outline" size="sm" onClick={() => router.push("/")}>
                Dashboard
              </NeoButton>
              <NeoButton size="sm" onClick={handleStart}>
                Check Again
              </NeoButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // Session complete
  if (session?.isComplete) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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

  // Active review
  if (session && !session.isComplete) {
    const currentWord = session.cards[session.currentIndex];
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FlashCard
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
