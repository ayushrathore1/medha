const modules = [
  { kicker: "Social", title: "Campus Pulse", body: "Live event discovery and club management. Know what's happening, everywhere on campus.", status: "Fall 2026", live: false },
  { kicker: "Finance", title: "Allowance", body: "Budgeting built for student loans and late-night ramen runs. Smart goals, zero friction.", status: "In design", live: false },
  { kicker: "Career", title: "First Step", body: "One-click internship applications powered by your real academic profile.", status: "Coming soon", live: false },
  { kicker: "Dining", title: "Tray", body: "Meal plans, mobile ordering, and dining hall menus — one tap from your home screen.", status: "Coming soon", live: false },
  { kicker: "Living", title: "Roost", body: "Roommate scheduling, chore boards and shared expenses, designed for dorm life.", status: "In research", live: false },
  { kicker: "Wellness", title: "Pulse", body: "Sleep-aware focus blocks and gentle nudges when your week starts to slip.", status: "In research", live: false },
];

export function Ecosystem() {
  return (
    <section id="ecosystem" className="py-24 sm:py-32 px-6 bg-cream/40 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-14 gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3 block">The Roadmap</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl italic tracking-tight">The ecosystem.</h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm">
            Six more modules in the lab. They land one by one — built with students, not for them.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => (
            <article
              key={m.title}
              className="group relative bg-card p-7 rounded-3xl ring-1 ring-border hover:ring-primary/30 transition-all hover:-translate-y-1 duration-500 overflow-hidden"
            >
              <div className="absolute top-5 right-5 size-2 rounded-full bg-muted-foreground/30 animate-pulse-dot" />
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-10">{m.kicker}</div>
              <h3 className="font-display text-2xl mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-7">{m.body}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-tight px-2.5 py-1 bg-secondary text-secondary-foreground rounded-md">{m.status}</span>
                <span className="font-mono text-[10px] uppercase tracking-tight text-muted-foreground">Module 0{i + 2}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
