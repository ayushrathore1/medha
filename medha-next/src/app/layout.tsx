import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Medha — Your Smart Study Companion",
    template: "%s | Medha",
  },
  description:
    "AI-powered study platform for university students. Notes, flashcards, RTU exam analysis, AI chatbot, and more.",
  keywords: [
    "study",
    "notes",
    "flashcards",
    "RTU",
    "exam",
    "AI",
    "chatbot",
    "university",
  ],
  authors: [{ name: "Medha Team" }],
  openGraph: {
    title: "Medha — Your Smart Study Companion",
    description:
      "AI-powered study platform for university students.",
    type: "website",
    siteName: "Medha",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#18120e" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
