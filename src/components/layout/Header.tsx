"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";

interface HeaderProps {
  collectionProgress?: { total: number; mastered: number };
}

export function Header({ collectionProgress }: HeaderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
      }
    }
    getUser();
  }, [supabase]);

  const isAdmin = typeof window !== "undefined" && sessionStorage.getItem("bias-admin") === "true";
  const pct = collectionProgress && collectionProgress.total > 0
    ? Math.round((collectionProgress.mastered / collectionProgress.total) * 100)
    : 0;

  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-pink to-accent-lavender flex items-center justify-center">
            <Heart size={16} className="text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-lg text-text-primary">
            Korean by Bias
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {collectionProgress && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-text-muted">
                <span className="font-bold text-accent-pink">{collectionProgress.mastered}</span>
                <span>/{collectionProgress.total} mastered</span>
              </span>
              <div className="w-20 h-1.5 bg-border-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-pink to-accent-lavender rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
          {user && (
            <span className="text-[10px] text-text-muted hidden sm:inline">
              {user.email}
            </span>
          )}
          {isAdmin && (
            <span className="text-[10px] text-accent-pink font-semibold border border-accent-pink/30 rounded-full px-2 py-0.5">
              me
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
