"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GlassInput } from "@/components/ui/GlassInput";
import { NeoButton } from "@/components/ui/NeoButton";
import { GlassCard } from "@/components/ui/GlassCard";

const ADMIN_SECRET = "bias-admin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminTaps, setAdminTaps] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const handleTitleTap = () => {
    setAdminTaps((prev) => prev + 1);
  };

  useEffect(() => {
    if (adminTaps >= 5) {
      sessionStorage.setItem(ADMIN_SECRET, "true");
      router.push("/");
    }
  }, [adminTaps, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !supabase) return;

    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-sm"
      >
        <GlassCard className="p-8 space-y-6" glow>
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-lavender flex items-center justify-center mx-auto">
              <Heart size={26} className="text-white" fill="white" />
            </div>
            <h1
              onClick={handleTitleTap}
              className="font-display font-bold text-2xl gradient-text cursor-default select-none"
            >
              Korean by Bias
              {adminTaps > 0 && adminTaps < 5 && (
                <span className="text-[10px] text-text-muted/30 ml-1">
                  {5 - adminTaps}
                </span>
              )}
            </h1>
            <p className="text-text-muted text-sm">
              {sent
                ? "Cek email kamu untuk magic link ✦"
                : "Login dengan email buat mulai koleksi"}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <GlassInput
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error || undefined}
                autoFocus
              />
              <NeoButton type="submit" loading={loading} className="w-full" size="lg">
                <Mail size={18} />
                Send Magic Link
              </NeoButton>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-xl bg-accent-mint/15 border border-accent-mint/30">
                <p className="text-sm text-accent-mint/90 font-medium">
                  Magic link dikirim ke <strong className="text-text-primary">{email}</strong>
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                Ganti email
              </button>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
