"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ADMIN_SECRET = "bias-admin";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check admin bypass first
    if (typeof window !== "undefined" && sessionStorage.getItem(ADMIN_SECRET) === "true") {
      setAuthed(true);
      setLoading(false);
      return;
    }

    if (!supabase) {
      setAuthed(true);
      setLoading(false);
      return;
    }
    async function check() {
      const { data } = await supabase!.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setAuthed(true);
      setLoading(false);
    }
    check();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-pink" size={32} />
      </div>
    );
  }

  if (!authed) return null;

  return <>{children}</>;
}
