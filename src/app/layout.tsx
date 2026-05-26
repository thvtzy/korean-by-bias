import type { Metadata } from "next";
import { ClientProviders } from "@/components/layout/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korean by Bias",
  description: "Learn Korean through the words your biases say. A vocabulary tracker for K-pop fans.",
  openGraph: {
    title: "Korean by Bias",
    description: "Learn Korean through the words your biases say.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased relative">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
