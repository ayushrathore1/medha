const quotes = [
  { q: "I used to spend 4 hours rewriting notes. Now Campu does it while I'm walking back to the dorm.", who: "Sarah J.", school: "Stanford '26" },
  { q: "Finally an app that doesn't feel like it was built in 2005. The design alone makes me want to study.", who: "Liam W.", school: "NYU '27" },
  { q: "The exam radar is scary accurate. It's like having a tutor in my pocket 24/7.", who: "Maya R.", school: "UT Austin '25" },
  { q: "I switched from four different apps to just Campu. My focus time tripled in a month.", who: "Jordan K.", school: "UCLA '26" },
  { q: "The flashcards write themselves and they're actually good. I don't know how, I don't care.", who: "Priya S.", school: "Brown '27" },
];

export function Testimonials() {
  const loop = [...quotes, ...quotes];
  return (
    <section className="py-24 sm:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary mb-3 block">Loved on campus</span>
        <h2 className="font-display text-3xl sm:text-5xl tracking-tight">Built with 12,000+ students.</h2>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex gap-5 w-max animate-marquee">
          {loop.map((t, i) => (
            <figure key={i} className="w-[320px] sm:w-[380px] shrink-0 p-7 rounded-3xl bg-card ring-1 ring-border shadow-sm">
              <blockquote className="font-display italic text-lg leading-snug text-foreground mb-6 text-pretty whitespace-normal">
                "{t.q}"
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gradient-to-br from-primary/30 to-cream" />
                <div>
                  <div className="text-sm font-semibold">{t.who}</div>
                  <div className="text-xs text-muted-foreground">{t.school}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
