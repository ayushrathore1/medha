"use client";

import Link from "next/link";
import { usePersonalization } from "@/hooks/usePersonalization";

export function WidgetSidebar() {
  const { data, isLoading } = usePersonalization();

  return (
    <aside className="hidden xl:flex w-84 shrink-0 flex-col gap-4 border-l border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,248,243,0.96))] px-5 py-6 dark:bg-[linear-gradient(180deg,rgba(20,16,14,0.92),rgba(28,22,18,0.98))]">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Wallet</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-3xl font-black text-[var(--foreground)]">₹{data?.wallet.availableBalance ?? 0}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Available balance</p>
          </div>
          <Link href="/campus-cart/wallet" className="rounded-full bg-[var(--primary)] px-3 py-2 text-xs font-bold text-white">
            Add Money
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Upcoming Exam</p>
        <div className="mt-3 rounded-2xl bg-[var(--secondary)] p-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">{isLoading ? "Loading..." : "Next subject exam"}</p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">Countdown updates from your syllabus data.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Trending searches</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["hostel desk", "lab manual", "calculator", "revision notes", "bluetooth speaker"] as const).map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Quick actions</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold">
          <Link href="/campus-cart/become-seller" className="rounded-2xl bg-[var(--secondary)] px-3 py-4 text-center">
            Sell an item
          </Link>
          <Link href="/notes" className="rounded-2xl bg-[var(--secondary)] px-3 py-4 text-center">
            Upload notes
          </Link>
          <Link href="/chatbot" className="rounded-2xl bg-[var(--secondary)] px-3 py-4 text-center">
            Ask doubt
          </Link>
          <Link href="/campus-cart/shop" className="rounded-2xl bg-[var(--secondary)] px-3 py-4 text-center">
            Browse market
          </Link>
        </div>
      </div>
    </aside>
  );
}