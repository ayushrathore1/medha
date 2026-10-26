const stats = [
  { n: "01", value: "149+", label: "Active students" },
  { n: "02", value: "250+", label: "Topics covered" },
  { n: "03", value: "10", label: "Years of RTU papers" },
  { n: "04", value: "4.9★", label: "Average rating" },
];

export function RevisionStats() {
  return (
    <div id="stats" className="border-y border-border bg-cream/40">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {stats.map((s) => (
          <div key={s.n} className="text-center">
            <div className="font-mono text-[10px] text-muted-foreground mb-2">({s.n})</div>
            <div className="font-display text-4xl sm:text-5xl mb-1 tracking-tight">{s.value}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
