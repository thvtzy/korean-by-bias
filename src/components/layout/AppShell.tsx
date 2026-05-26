import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col pb-16">
      <Header />
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
