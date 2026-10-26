"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePersonalization } from "@/hooks/usePersonalization";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardHome() {
  const { user } = useAuth();
  const { data, isLoading } = usePersonalization();
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,#fff8f2,#f2ebe4_48%,#f8f2ea)] p-6 shadow-[0_28px_90px_-40px_rgba(0,0,0,0.35)] dark:bg-[linear-gradient(135deg,#1d1714,#221a16_48%,#17120f)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">CampusCart + Revision</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
              {greeting}, {user?.name || "Student"}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
              Your study tools, marketplace orders, wallet, and notifications are now in one place.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/dashboard" className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Study</p>
              <p className="mt-3 text-2xl font-black text-[var(--foreground)]">Continue revision</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">Pick up where you left off and track progress.</p>
            </Link>
            <Link href="/campus-cart/shop" className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Marketplace</p>
              <p className="mt-3 text-2xl font-black text-[var(--foreground)]">Buy & sell</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">Discover campus listings, wallet, and orders.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Continue your revision</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { name: "DBMS", progress: 78 },
              { name: "OS", progress: 62 },
              { name: "CN", progress: 49 },
              { name: "Maths", progress: 88 },
            ].map((subject) => (
              <div key={subject.name} className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-[var(--foreground)]">
                  <span>{subject.name}</span>
                  <span>{subject.progress}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[rgba(0,0,0,0.08)]">
                  <div className="h-2 rounded-full bg-[var(--primary)]" style={{ width: `${subject.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Wallet snapshot</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[var(--secondary)] p-4">
              <p className="text-xs text-[var(--muted-foreground)]">Available</p>
              <p className="mt-2 text-2xl font-black text-[var(--foreground)]">₹{data?.wallet.availableBalance ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-[var(--secondary)] p-4">
              <p className="text-xs text-[var(--muted-foreground)]">Pending</p>
              <p className="mt-2 text-2xl font-black text-[var(--foreground)]">₹{data?.wallet.pendingBalance ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-[var(--secondary)] p-4">
              <p className="text-xs text-[var(--muted-foreground)]">Unread</p>
              <p className="mt-2 text-2xl font-black text-[var(--foreground)]">{data?.unreadCount ?? 0}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href="/campus-cart/wallet" className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white">
              View wallet
            </Link>
            <Link href="/notifications" className="rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--foreground)]">
              Open notifications
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Recommended for you</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--foreground)]">Marketplace picks</h2>
          </div>
          <Link href="/campus-cart/shop" className="text-sm font-semibold text-[var(--primary)]">Browse all</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(isLoading ? Array.from({ length: 4 }) : (data?.recommendedProducts || [])).map((product, index) => (
            <div key={index} className="rounded-3xl border border-[var(--border)] bg-[var(--secondary)] p-4">
              <div className="aspect-[4/3] rounded-2xl bg-[linear-gradient(135deg,rgba(232,98,42,0.18),rgba(0,0,0,0.04))]" />
              <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">{isLoading ? "Loading..." : String((product as Record<string, unknown>).name || "Recommended item")}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">College-relevant and trending on campus.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}