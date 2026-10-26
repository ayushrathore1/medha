"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Home, Bell, ListOrdered, BookOpenText, Heart, Sparkles, Store, ShoppingBag, Megaphone, UserCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NotificationBell } from "@/components/common/NotificationBell";
import { WidgetSidebar } from "@/components/dashboard/WidgetSidebar";

const studyLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/notes", label: "Revision Notes", icon: BookOpenText },
  { href: "/flashcards", label: "Flashcards", icon: Sparkles },
  { href: "/rtu-exams", label: "Practice & Tests", icon: ListOrdered },
];

const marketLinks = [
  { href: "/campus-cart/shop", label: "Browse", icon: Store },
  { href: "/campus-cart/orders", label: "Orders", icon: ShoppingBag },
  { href: "/campus-cart/wishlist", label: "Wishlist", icon: Heart },
  { href: "/campus-cart/become-seller", label: "Sell", icon: Megaphone },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(232,98,42,0.08),transparent_30%),linear-gradient(180deg,var(--background),var(--background))] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-450">
        <aside className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-border bg-[rgba(255,250,245,0.92)] px-5 py-6 backdrop-blur-xl transition-transform duration-300 dark:bg-[rgba(19,14,12,0.94)] xl:static xl:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}>
          <div className="flex h-full flex-col gap-6">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="text-lg font-black tracking-[0.25em]" style={{ textDecoration: "none", color: "var(--foreground)" }}>
                MEDHA
              </Link>
              <button type="button" onClick={() => setSidebarOpen(false)} className="xl:hidden rounded-full border border-border p-2">
                <Menu className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-6 overflow-auto pr-1">
              <div>
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Core</p>
                <div className="mt-3 space-y-1">
                  {studyLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive(item.href) ? "bg-primary text-white shadow-lg" : "text-foreground hover:bg-secondary"}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Marketplace</p>
                <div className="mt-3 space-y-1">
                  {marketLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive(item.href) ? "bg-primary text-white shadow-lg" : "text-foreground hover:bg-secondary"}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            <div className="mt-auto rounded-[1.75rem] border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                  <UserCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user?.name || "Student"}</p>
                  <p className="text-xs text-muted-foreground">{user?.college || "Campus member"}</p>
                </div>
              </div>
              <button type="button" onClick={logout} className="mt-4 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
                Log out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-[rgba(255,252,248,0.82)] backdrop-blur-xl dark:bg-[rgba(20,16,14,0.9)]">
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 xl:hidden">
                <button type="button" onClick={() => setSidebarOpen((value) => !value)} className="rounded-full border border-border bg-card p-2">
                  <Menu className="h-4 w-4" />
                </button>
                <span className="text-sm font-black tracking-[0.2em]">MEDHA</span>
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Unified dashboard</p>
                <p className="text-lg font-semibold text-foreground">Study and marketplace in one workspace</p>
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <Link href="/campus-cart/shop" className="rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white">
                  Shop now
                </Link>
              </div>
            </div>
          </header>

          <main className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="min-w-0">{children}</div>
            <WidgetSidebar />
          </main>
        </div>
      </div>
    </div>
  );
}