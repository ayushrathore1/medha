import Link from "next/link";

export function CampusCartFooter() {
  return (
    <footer className="pt-20 pb-12 border-t border-border px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <div className="font-display italic text-3xl tracking-tight mb-4">CampusCart</div>
          <p className="text-muted-foreground text-sm">The student marketplace. Buy and sell textbooks, drafters, electronics, and hostel essentials — all within your campus.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16">
          {[
            { h: "Shop", l: ["All Products", "Categories", "Deals"] },
            { h: "Sell", l: ["Become a Seller", "Pricing", "Guidelines"] },
            { h: "Support", l: ["Help Center", "Contact", "Report Item"] },
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
        <div>&copy; 2026 CampusCart by Medha.</div>
        <div>Peer-to-peer. Campus-only. Student-verified.</div>
      </div>
    </footer>
  );
}
