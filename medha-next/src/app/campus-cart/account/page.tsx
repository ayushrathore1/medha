"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const nameLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-8">My Account</h1>

      <div className="bg-card rounded-2xl ring-1 ring-border p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#d46936] flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              nameLetter
            )}
          </div>
          <div>
            <h2 className="font-display text-xl">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.college && (
              <p className="text-xs text-muted-foreground mt-0.5">
                📍 {user.college} {user.branch ? `· ${user.branch}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/campus-cart/orders"
          className="flex items-center gap-4 bg-card rounded-2xl ring-1 ring-border p-5 hover:ring-primary/30 transition-all"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span className="text-2xl">📦</span>
          <div>
            <div className="font-semibold text-sm">My Orders</div>
            <div className="text-xs text-muted-foreground">View your order history</div>
          </div>
          <span className="ml-auto text-muted-foreground">→</span>
        </Link>

        <Link
          href="/campus-cart/wishlist"
          className="flex items-center gap-4 bg-card rounded-2xl ring-1 ring-border p-5 hover:ring-primary/30 transition-all"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span className="text-2xl">❤️</span>
          <div>
            <div className="font-semibold text-sm">Wishlist</div>
            <div className="text-xs text-muted-foreground">View and manage saved items</div>
          </div>
          <span className="ml-auto text-muted-foreground">→</span>
        </Link>

        <Link
          href="/campus-cart/dashboard"
          className="flex items-center gap-4 bg-card rounded-2xl ring-1 ring-border p-5 hover:ring-primary/30 transition-all"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span className="text-2xl">📊</span>
          <div>
            <div className="font-semibold text-sm">Seller Dashboard</div>
            <div className="text-xs text-muted-foreground">Manage your product listings and sales</div>
          </div>
          <span className="ml-auto text-muted-foreground">→</span>
        </Link>

        <Link
          href="/campus-cart/settings"
          className="flex items-center gap-4 bg-card rounded-2xl ring-1 ring-border p-5 hover:ring-primary/30 transition-all"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span className="text-2xl">⚙️</span>
          <div>
            <div className="font-semibold text-sm">Settings</div>
            <div className="text-xs text-muted-foreground">Notifications, payment, shipping</div>
          </div>
          <span className="ml-auto text-muted-foreground">→</span>
        </Link>
      </div>
    </div>
  );
}
