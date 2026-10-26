import heroMockup from "@/assets/hero-mockup.jpg";

export function Hero() {
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
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70">Phase 01 · Study OS in beta</span>
        </div>

        <h1 className="animate-fade-up [animation-delay:80ms] font-display text-[3.25rem] leading-[0.92] sm:text-7xl md:text-8xl tracking-tight text-balance mb-7">
          The one app <br />for <span className="italic text-primary">everything</span> college.
        </h1>
        <p className="animate-fade-up [animation-delay:180ms] text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-10 text-pretty">
          From AI-powered lecture synthesis to an automated social calendar — Campu is the operating system for your student life.
        </p>

        <div className="animate-fade-up [animation-delay:260ms] flex items-center gap-3 mb-16">
          <a href="#waitlist" className="bg-ink text-background px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors">
            Get early access
          </a>
          <a href="#study" className="px-6 py-3.5 rounded-full text-sm font-semibold ring-1 ring-border hover:bg-card transition-colors">
            See the app
          </a>
        </div>

        <div className="animate-fade-up [animation-delay:340ms] relative w-full max-w-sm sm:max-w-md">
          <div className="relative z-10 animate-float-y">
            <img
              src={heroMockup}
              alt="Campu mobile app showing focus dashboard, AI lecture summary and study cards"
              width={1024}
              height={1280}
              className="w-full h-auto rounded-[2.5rem] drop-shadow-[0_40px_60px_rgba(24,18,12,0.18)]"
            />
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-ink/20 blur-3xl rounded-full -z-10" />
        </div>
      </div>
    </section>
  );
}
