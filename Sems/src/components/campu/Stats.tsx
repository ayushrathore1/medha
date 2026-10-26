const stats = [
  { n: "01", value: "12k+", label: "Beta students" },
  { n: "02", value: "140", label: "Campuses" },
  { n: "03", value: "1.2m", label: "Notes generated" },
  { n: "04", value: "4.9", label: "Avg. rating" },
];

export function Stats() {
  return (
    <div className="border-y border-border bg-cream/40">
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
