import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { PostHogProvider } from "@/providers/posthog-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Providers } from "@/providers/heroui-provider";
import { PostHogPageview } from "@/components/posthog-pageview";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ICSE Boards Grind",
  description: "Your personal ICSE 2026 board exam study dashboard — plan, track, and grind smarter.",
  metadataBase: new URL("https://icse-boards-grind.vercel.app"),
  openGraph: {
    title: "ICSE Boards Grind",
    description: "Your personal ICSE 2026 board exam study dashboard — plan, track, and grind smarter.",
    siteName: "ICSE Boards Grind",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ICSE Boards Grind",
    description: "Your personal ICSE 2026 board exam study dashboard — plan, track, and grind smarter.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0d1117" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <PostHogProvider>
            <Suspense fallback={null}>
              <PostHogPageview />
            </Suspense>
            <ThemeProvider>
              <Providers>
                {children}
              </Providers>
            </ThemeProvider>
          </PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
