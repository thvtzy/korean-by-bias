"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, LogOut, BookOpen, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";
import { NeoButton } from "@/components/ui/NeoButton";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();
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

  const handleLogout = async () => {
    sessionStorage.removeItem("bias-admin");
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border-glass bg-bg/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center shadow-glow-sm">
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg bg-gradient-to-r from-accent-pink to-accent-purple bg-clip-text text-transparent">
              Korean by Bias
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-4">
            <Link
              href="/review"
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <BookOpen size={16} />
              Review
            </Link>
            {user && (
              <>
                <span className="text-xs text-white/30">{user.email}</span>
                <NeoButton variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut size={14} />
                  Logout
                </NeoButton>
              </>
            )}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-white/60 hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 space-y-3 border-t border-border-glass pt-3">
            <Link
              href="/review"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.03]"
            >
              <BookOpen size={16} />
              Review Mode
            </Link>
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-red-400 rounded-lg hover:bg-white/[0.03] w-full text-left"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
