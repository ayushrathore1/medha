"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/lib/api";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiGet<{ notifications: Notification[]; unreadCount: number }>("/api/notifications")
      .then((data) => { setNotifications(data.notifications); setUnreadCount(data.unreadCount); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("medha_token")}` } });
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    await fetch("/api/notifications/all", { method: "PATCH", headers: { Authorization: `Bearer ${localStorage.getItem("medha_token")}` } });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const typeIcon: Record<string, string> = { like: "❤️", comment: "💬", follow: "👤", badge: "🏆", system: "📢" };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--foreground)" }}>Notifications {unreadCount > 0 && <span style={{ fontSize: 14, fontWeight: 600, color: "white", background: "var(--primary)", borderRadius: 12, padding: "2px 10px", marginLeft: 8 }}>{unreadCount}</span>}</h1>
        {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: 13, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Mark all read</button>}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--muted-foreground)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>No notifications yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map((n) => (
            <div key={n._id} onClick={() => !n.read && markRead(n._id)}
              style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 16, background: n.read ? "var(--card)" : "var(--secondary)", border: `1px solid ${n.read ? "var(--border)" : "var(--primary)"}30`, cursor: n.read ? "default" : "pointer", transition: "all 200ms" }}>
              <div style={{ fontSize: 24, flexShrink: 0 }}>{typeIcon[n.type] || "📬"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, color: "var(--foreground)", marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{n.message}</div>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 6 }}>{new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
