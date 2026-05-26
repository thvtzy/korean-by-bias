"use client";

import { createBrowserClient } from "@supabase/ssr";

let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient(): ReturnType<typeof createBrowserClient> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("placeholder")) return null;
  if (cachedClient) return cachedClient;
  cachedClient = createBrowserClient(url, key);
  return cachedClient;
}


