"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CampusCartNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fetch cart count
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem("medha_token");
    if (!token) return;

    fetch("/api/campus-cart/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.cart?.items) {
          setCartCount(
            data.cart.items.reduce(
              (sum: number, item: { quantity: number }) => sum + item.quantity,
              0
            )
          );
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-sm"
            : "bg-background/50 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Tab Switcher */}
            <div className="flex items-center gap-4">
              <Link
                href="/campus-cart/shop"
                className="font-display italic text-xl tracking-tight hover:text-primary transition-colors"
                style={{ textDecoration: "none", color: "var(--foreground)" }}
              >
                CampusCart
              </Link>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer px-2.5 py-1 rounded-full bg-secondary/50 hover:bg-secondary"
                style={{ textDecoration: "none" }}
              >
                📚 Revision
              </Link>
            </div>

            {/* Center: Category Links (desktop) */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Link
                href="/campus-cart/shop"
                className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-secondary/70 transition-all"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                All
              </Link>
              <Link
                href="/campus-cart/categories"
                className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-secondary/70 transition-all"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Categories
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  href="/campus-cart/wishlist"
                  className="relative p-2 rounded-full hover:bg-secondary transition-colors"
                  style={{ textDecoration: "none", color: "var(--foreground)" }}
                  title="Wishlist"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/campus-cart/cart"
                className="relative p-2 rounded-full hover:bg-secondary transition-colors"
                style={{ textDecoration: "none", color: "var(--foreground)" }}
                title="Cart"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-4.5 min-h-4.5">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden sm:block h-5 w-px bg-border mx-1" />

              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/campus-cart/dashboard"
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2"
                    style={{ textDecoration: "none" }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/campus-cart/orders"
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2"
                    style={{ textDecoration: "none" }}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer px-2"
                    style={{ border: "none", background: "none" }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2"
                    style={{ textDecoration: "none" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/campus-cart/become-seller"
                    className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition-all"
                    style={{ textDecoration: "none" }}
                  >
                    Sell on Campus
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
                style={{ border: "none", background: "none", color: "var(--foreground)" }}
                aria-label="Menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {menuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden bg-background border-t border-border px-4 py-4 space-y-2">
            <Link
              href="/campus-cart/shop"
              className="block px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
              style={{ textDecoration: "none", color: "var(--foreground)" }}
              onClick={() => setMenuOpen(false)}
            >
              🛍️ Shop
            </Link>
            <Link
              href="/campus-cart/categories"
              className="block px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
              style={{ textDecoration: "none", color: "var(--foreground)" }}
              onClick={() => setMenuOpen(false)}
            >
              📂 Categories
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/campus-cart/dashboard"
                  className="block px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                  style={{ textDecoration: "none", color: "var(--foreground)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  📊 Seller Dashboard
                </Link>
                <Link
                  href="/campus-cart/orders"
                  className="block px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                  style={{ textDecoration: "none", color: "var(--foreground)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  📋 My Orders
                </Link>
                <Link
                  href="/campus-cart/wishlist"
                  className="block px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                  style={{ textDecoration: "none", color: "var(--foreground)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  ❤️ Wishlist
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                  style={{ textDecoration: "none", color: "var(--foreground)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  📚 Switch to Revision
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  style={{ border: "none", background: "none" }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                  style={{ textDecoration: "none", color: "var(--foreground)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/campus-cart/become-seller"
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground text-center hover:opacity-90 transition-all"
                  style={{ textDecoration: "none" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Sell on Campus
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
