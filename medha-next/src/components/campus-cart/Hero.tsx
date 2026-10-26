"use client";

import Link from "next/link";

export function CampusCartHero() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-6 overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[140%] sm:w-[80%] h-[600px] bg-primary/15 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full bg-background/60 ring-1 ring-border backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70">Live Now · Campus Marketplace</span>
        </div>

        <h1 className="animate-fade-up [animation-delay:80ms] font-display text-[3.25rem] leading-[0.92] sm:text-7xl md:text-8xl tracking-tight text-balance mb-7">
          Buy & sell on<br /><span className="italic text-primary">campus.</span>
        </h1>
        <p className="animate-fade-up [animation-delay:180ms] text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-10 text-pretty">
          Textbooks, drafters, calculators, and hostel essentials — from students, for students.
        </p>

        <div className="animate-fade-up [animation-delay:260ms] flex items-center gap-3 mb-16">
          <Link href="/campus-cart/shop" className="bg-ink text-background px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors" style={{ textDecoration: "none" }}>
            Start Shopping →
          </Link>
          <Link href="/campus-cart/become-seller" className="px-6 py-3.5 rounded-full text-sm font-semibold ring-1 ring-border hover:bg-card transition-colors" style={{ textDecoration: "none", color: "var(--foreground)" }}>
            Become a Seller
          </Link>
        </div>

        <div className="animate-fade-up [animation-delay:340ms] flex items-center justify-center gap-10 sm:gap-16 text-center">
          <div>
            <div className="font-display text-4xl sm:text-5xl mb-1 tracking-tight">0→1</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Launching soon</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <div className="font-display text-4xl sm:text-5xl mb-1 tracking-tight">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Peer-to-peer</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <div className="font-display text-4xl sm:text-5xl mb-1 tracking-tight">RTU</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Verified students</div>
          </div>
        </div>
      </div>
    </section>
  );
}
