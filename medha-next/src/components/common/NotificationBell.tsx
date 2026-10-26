"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-3 w-[22rem] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Notifications</p>
              <p className="text-xs text-[var(--muted-foreground)]">{unreadCount} unread</p>
            </div>
            <button type="button" onClick={markAllRead} className="text-xs font-semibold text-[var(--primary)]">
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-auto p-2">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <Link
                  key={notification._id}
                  href={notification.actionUrl || "/dashboard"}
                  className="block rounded-2xl px-3 py-3 transition hover:bg-[var(--secondary)]"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${notification.read ? "bg-[var(--border)]" : "bg-[var(--primary)]"}`} />
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{notification.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-[var(--muted-foreground)]">{notification.message}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">No notifications yet.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}