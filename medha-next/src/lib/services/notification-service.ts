import { connectDB } from "@/lib/db/mongoose";
import Notification from "@/lib/models/Notification";
import { io, Socket } from "socket.io-client";

type NotifyInput = {
  type?: "info" | "success" | "warning" | "error" | "message" | "like" | "feature";
  title: string;
  message: string;
  category?: "order" | "payment" | "delivery" | "product" | "system" | "study";
  data?: Record<string, unknown>;
  priority?: "low" | "normal" | "high" | "urgent";
  actionUrl?: string | null;
  link?: string | null;
  sender?: string | null;
};

const listeners = new Map<string, Array<(notification: unknown) => void>>();
let serviceSocket: Socket | null = null;

function getSocketServerUrl() {
  return process.env.SOCKET_SERVER_URL || "http://localhost:3001";
}

function getServiceSocket() {
  if (!process.env.SOCKET_SERVICE_SECRET) return null;
  if (serviceSocket) return serviceSocket;

  serviceSocket = io(getSocketServerUrl(), {
    autoConnect: true,
    transports: ["websocket"],
    auth: { serviceSecret: process.env.SOCKET_SERVICE_SECRET },
  });

  return serviceSocket;
}

export function onNotification(userId: string, callback: (notification: unknown) => void) {
  const current = listeners.get(userId) || [];
  current.push(callback);
  listeners.set(userId, current);
  return () => {
    const next = (listeners.get(userId) || []).filter((entry) => entry !== callback);
    if (next.length === 0) listeners.delete(userId);
    else listeners.set(userId, next);
  };
}

export async function notify(userId: string, input: NotifyInput) {
  await connectDB();
  const notification = await Notification.create({
    recipient: userId,
    type: input.type || "info",
    title: input.title,
    message: input.message,
    link: input.link ?? input.actionUrl ?? null,
    actionUrl: input.actionUrl ?? input.link ?? null,
    category: input.category || "system",
    data: input.data || {},
    priority: input.priority || "normal",
    sender: input.sender || null,
  });

  for (const callback of listeners.get(userId) || []) {
    callback(notification.toObject());
  }

  const socket = getServiceSocket();
  if (socket?.connected || socket?.active) {
    socket.emit("notification:new", { userId, notification: notification.toObject() });
  }

  return notification;
}

export async function markNotificationRead(notificationId: string, recipientId: string) {
  await connectDB();
  return Notification.findOneAndUpdate({ _id: notificationId, recipient: recipientId }, { read: true }, { new: true });
}