"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { io, type Socket } from "socket.io-client";

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  category?: string;
  actionUrl?: string | null;
  createdAt?: string;
}

export function useNotifications() {
  const { token, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    let socket: Socket | null = null;

    async function load() {
      if (!isAuthenticated || !token) return;
      try {
        const response = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json();
        if (!cancelled) {
          setNotifications(payload.notifications || []);
          setUnreadCount(payload.unreadCount || 0);
        }
      } catch {
        if (!cancelled) {
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    }

    void load();
    timer = window.setInterval(load, 30000);

    if (isAuthenticated && token) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3001", {
        transports: ["websocket"],
        auth: { token },
      });

      socket.on("notification:new", (notification: AppNotification) => {
        if (cancelled) return;
        setNotifications((current) => [notification, ...current.filter((entry) => entry._id !== notification._id)].slice(0, 50));
        setUnreadCount((current) => current + (notification.read ? 0 : 1));
      });
    }

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      socket?.disconnect();
    };
  }, [isAuthenticated, token]);

  const markAllRead = async () => {
    if (!token) return;
    await fetch("/api/notifications/all", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAllRead };
}