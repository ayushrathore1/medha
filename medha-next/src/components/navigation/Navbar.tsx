"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "📚" },
  { label: "Notes", href: "/notes", icon: "📝" },
  { label: "RTU Exams", href: "/rtu-exams", icon: "📊" },
  { label: "Shop", href: "/campus-cart/shop", icon: "🛍️" },
  { label: "Become a Seller", href: "/campus-cart/become-seller", icon: "🏪" },
  { label: "Seller Dashboard", href: "/campus-cart/dashboard", icon: "📊" },
  { label: "My Orders", href: "/campus-cart/orders", icon: "📦" },
  { label: "My Account", href: "/campus-cart/account", icon: "👤" },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight" style={{ textDecoration: "none", color: "var(--foreground)" }}>
            MEDHA<span className="w-2 h-2 rounded-full bg-primary inline-block" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: pathname === item.href || pathname.startsWith(item.href + "/") ? "var(--primary)" : "var(--muted-foreground)",
                  background: pathname === item.href || pathname.startsWith(item.href + "/") ? "var(--secondary)" : "transparent",
                  textDecoration: "none",
                }}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-secondary transition-colors" style={{ textDecoration: "none", color: "var(--foreground)" }}>
                  🔔
                </Link>
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-accent transition-colors" style={{ textDecoration: "none", color: "var(--foreground)" }}>
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-primary to-[#d46936] flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user?.name?.split(" ")[0]}</span>
                </Link>
                <button onClick={logout} className="text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded hidden sm:block" style={{ border: "none", background: "none", cursor: "pointer" }}>
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ textDecoration: "none", color: "var(--foreground)", background: "var(--secondary)" }}>
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-linear-to-r from-primary to-[#d46936] hover:from-[#d46936] hover:to-primary transition-all" style={{ textDecoration: "none" }}>
                  Get Started
                </Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-secondary" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--foreground)", fontSize: 20 }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
              className="block px-3 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{ color: pathname === item.href ? "var(--primary)" : "var(--muted-foreground)", background: pathname === item.href ? "var(--secondary)" : "transparent", textDecoration: "none" }}>
              <span className="mr-2">{item.icon}</span>{item.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium bg-secondary" style={{ textDecoration: "none", color: "var(--foreground)" }}>Sign In</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-linear-to-r from-primary to-[#d46936]" style={{ textDecoration: "none" }}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
