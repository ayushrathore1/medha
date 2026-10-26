import { useState } from "react";

export function CTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="waitlist" className="py-24 sm:py-32 px-6">
      <div className="max-w-4xl mx-auto bg-ink text-background rounded-[2rem] sm:rounded-[3rem] p-10 sm:p-20 text-center relative overflow-hidden">
        <div className="absolute -top-32 -left-20 size-80 bg-primary/30 blur-[110px] rounded-full" />
        <div className="absolute -bottom-32 -right-20 size-96 bg-primary/40 blur-[120px] rounded-full" />
        <div className="relative z-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-6 block">Phase 01 cohort · 2,184 spots left</span>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl italic tracking-tight mb-6 text-balance">
            Your best semester<br />starts here.
          </h2>
          <p className="text-background/60 mb-10 text-base sm:text-lg max-w-md mx-auto">
            Join 12,000+ students reclaiming their time. Get the first invite when your campus goes live.
          </p>
          {done ? (
            <p className="font-mono text-sm text-primary">You're in. Watch your inbox.</p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="flex-1 bg-background/10 ring-1 ring-background/20 px-5 py-4 rounded-full text-sm text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 py-4 rounded-full text-sm transition-all hover:scale-[1.02]">
                Secure access
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
