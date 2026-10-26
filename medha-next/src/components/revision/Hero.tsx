"use client";

import Link from "next/link";

export function RevisionHero() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-6 overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[140%] sm:w-[80%] h-[600px] bg-primary/15 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-[40%] left-[10%] w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full bg-background/60 ring-1 ring-border backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70">Your Smart Study Companion</span>
        </div>

        <h1 className="animate-fade-up [animation-delay:80ms] font-display text-[3.25rem] leading-[0.92] sm:text-7xl md:text-8xl tracking-tight text-balance mb-7">
          The last-minute<br />exam prep tool<br />for <span className="italic text-primary">college students.</span>
        </h1>
        <p className="animate-fade-up [animation-delay:180ms] text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-10 text-pretty">
          AI-powered notes, flashcards, RTU exam analysis, and an academic chatbot — all in one place.
        </p>

        <div className="animate-fade-up [animation-delay:260ms] flex items-center gap-3 mb-16">
          <Link href="/register" className="bg-ink text-background px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors" style={{ textDecoration: "none" }}>
            Start for free
          </Link>
          <Link href="#features" className="px-6 py-3.5 rounded-full text-sm font-semibold ring-1 ring-border hover:bg-card transition-colors" style={{ textDecoration: "none", color: "var(--foreground)" }}>
            See features
          </Link>
        </div>

        <div className="animate-fade-up [animation-delay:340ms] flex items-center justify-center gap-10 sm:gap-16 text-center">
          <div>
            <div className="font-display text-4xl sm:text-5xl mb-1 tracking-tight">149+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Active students</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <div className="font-display text-4xl sm:text-5xl mb-1 tracking-tight">250+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Topics covered</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <div className="font-display text-4xl sm:text-5xl mb-1 tracking-tight">4.9★</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Avg. rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
