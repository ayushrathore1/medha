export function Footer() {
  return (
    <footer className="pt-20 pb-12 border-t border-border px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <div className="font-display italic text-3xl tracking-tight mb-4">Campu</div>
          <p className="text-muted-foreground text-sm">The operating system for the modern college student. Designed with care in San Francisco.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16">
          {[
            { h: "Product", l: ["Study OS", "Roadmap", "Changelog"] },
            { h: "Company", l: ["Manifesto", "Careers", "Press"] },
            { h: "Connect", l: ["Twitter", "Instagram", "Contact"] },
          ].map((c) => (
            <div key={c.h}>
              <div className="font-mono text-[10px] text-muted-foreground mb-4 uppercase tracking-widest">{c.h}</div>
              <ul className="space-y-2.5 text-sm">
                {c.l.map((i) => (
                  <li key={i}><a href="#" className="hover:text-primary transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-16 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <div>© 2026 Campu Labs Inc.</div>
        <div>Made with love for the next four years.</div>
      </div>
    </footer>
  );
}
