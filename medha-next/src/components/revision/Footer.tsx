import Link from "next/link";

export function RevisionFooter() {
  return (
    <footer className="pt-20 pb-12 border-t border-border px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <div className="font-display italic text-3xl tracking-tight mb-4">Medha</div>
          <p className="text-muted-foreground text-sm">Your smart study companion — and the ability to ace every exam.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16">
          {[
            { h: "Features", l: ["AI Chatbot", "Smart Notes", "Flashcards", "RTU Analysis"] },
            { h: "Platform", l: ["Dashboard", "Charcha Forum", "Suggestions"] },
            { h: "Company", l: ["About", "Contact", "Privacy Policy"] },
          ].map((c) => (
            <div key={c.h}>
              <div className="font-mono text-[10px] text-muted-foreground mb-4 uppercase tracking-widest">{c.h}</div>
              <ul className="space-y-2.5 text-sm">
                {c.l.map((i) => (
                  <li key={i}>
                    <Link href="#" className="hover:text-primary transition-colors" style={{ textDecoration: "none", color: "var(--foreground)" }}>{i}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-16 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <div>&copy; 2026 Medha.</div>
        <div>Built for students, by students.</div>
      </div>
    </footer>
  );
}
