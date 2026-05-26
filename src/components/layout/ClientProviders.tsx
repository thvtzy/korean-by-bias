"use client";

import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";

const protectedPaths = ["/", "/review"];

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const needsAuth = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  return (
    <ToastProvider>
      {needsAuth ? (
        <AuthGuard>
          <AppShell>{children}</AppShell>
        </AuthGuard>
      ) : (
        <AppShell>{children}</AppShell>
      )}
    </ToastProvider>
  );
}
