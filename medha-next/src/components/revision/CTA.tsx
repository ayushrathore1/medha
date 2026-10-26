"use client";

import Link from "next/link";

export function RevisionCTA() {
  return (
    <section id="cta" className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto bg-ink text-background rounded-[2rem] sm:rounded-[3rem] p-10 sm:p-20 text-center relative overflow-hidden">
        <div className="absolute -top-32 -left-20 size-80 bg-primary/30 blur-[110px] rounded-full" />
        <div className="absolute -bottom-32 -right-20 size-96 bg-primary/40 blur-[120px] rounded-full" />
        <div className="relative z-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-6 block">Start today · Free forever for RTU students</span>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl italic tracking-tight mb-6 text-balance">
            Your best semester<br />starts here.
          </h2>
          <p className="text-background/60 mb-10 text-base sm:text-lg max-w-md mx-auto">
            Join 149+ students acing their exams. No credit card. No commitment.
          </p>
          <Link
            href="/register"
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 py-4 rounded-full text-sm transition-all hover:scale-[1.02]"
            style={{ textDecoration: "none" }}
          >
            Start Learning Free →
          </Link>
        </div>
      </div>
    </section>
  );
}
