"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export function CampusCartNav() {
  const { logout, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl">
      <div className="backdrop-blur-xl bg-background/70 ring-1 ring-border rounded-full px-4 py-2.5 flex items-center justify-between shadow-[0_8px_30px_-12px_rgba(24,18,12,0.15)]">
        <Link href="/" className="font-display italic text-xl tracking-tight pl-2 hover:text-primary transition-colors" style={{ textDecoration: "none", color: "var(--foreground)" }}>
          CampusCart
        </Link>
        <div className="flex items-center gap-1 sm:gap-3 text-xs sm:text-sm font-medium text-muted-foreground">
          <a href="#categories" className="hidden md:inline hover:text-primary transition-colors px-1.5">Categories</a>
          
          <Link href="/dashboard" className="text-xs font-semibold hover:text-primary transition-colors px-2" style={{ textDecoration: "none", color: "inherit" }}>
            Medha Revision 📚
          </Link>

          <div className="h-4 w-px bg-border hidden sm:block mx-1" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/campus-cart/dashboard"
                className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
                style={{ textDecoration: "none" }}
              >
                Seller Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer px-2 py-1"
                style={{ border: "none", background: "none" }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground transition-colors px-2"
                style={{ textDecoration: "none" }}
              >
                Sign In
              </Link>
              <Link
                href="/campus-cart/become-seller"
                className="bg-ink text-background px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-primary transition-colors"
                style={{ textDecoration: "none" }}
              >
                Become a Seller
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

