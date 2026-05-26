"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Mail, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GlassInput } from "@/components/ui/GlassInput";
import { NeoButton } from "@/components/ui/NeoButton";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center mx-auto shadow-glow-sm">
              <Brain size={24} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl gradient-text">
              Korean by Bias
            </h1>
            <p className="text-white/40 text-sm">
              {sent
                ? "Check your email for the magic link!"
                : "Sign in with your email to get started"}
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
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-emerald-400">
                  Magic link sent to <strong>{email}</strong>
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Use a different email
              </button>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
