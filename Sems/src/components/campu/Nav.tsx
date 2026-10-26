export function Nav() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl">
      <div className="backdrop-blur-xl bg-background/70 ring-1 ring-border rounded-full px-4 py-2.5 flex items-center justify-between shadow-[0_8px_30px_-12px_rgba(24,18,12,0.15)]">
        <a href="#" className="font-display italic text-xl tracking-tight pl-2">Campu</a>
        <div className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-medium text-muted-foreground">
          <a href="#study" className="hidden sm:inline hover:text-primary transition-colors px-2">Study</a>
          <a href="#ecosystem" className="hidden sm:inline hover:text-primary transition-colors px-2">Ecosystem</a>
          <a href="#waitlist" className="bg-ink text-background px-4 py-2 rounded-full text-xs font-semibold hover:bg-primary transition-colors">Join waitlist</a>
        </div>
      </div>
    </nav>
  );
}
