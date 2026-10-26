"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  } | null;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_ICONS: Record<string, string> = {
  pending: "⏳",
  confirmed: "✅",
  shipped: "🚚",
  delivered: "📦",
  cancelled: "❌",
};

export default function OrdersPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
      return;
    }
    if (!token) return;

    fetch("/api/campus-cart/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, isAuthenticated, authLoading, router]);

  const cancelOrder = async (orderId: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`/api/campus-cart/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "cancelled" } : o
          )
        );
      }
    } catch (err) {
      console.error("Cancel order error:", err);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl ring-1 ring-border">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-muted-foreground mb-2">No orders yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Your orders will appear here after you make a purchase
          </p>
          <Link
            href="/campus-cart/shop"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all inline-block"
            style={{ textDecoration: "none" }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-card rounded-2xl ring-1 ring-border p-5 hover:ring-primary/20 transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {STATUS_ICONS[order.status] || "📋"}
                  </span>
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md ${
                      STATUS_COLORS[order.status] || "bg-secondary"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                    {order.paymentMethod === "cod" ? "COD" : "Online"}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => {
                    const img = item.product?.images?.[0] || "📦";
                    return (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ring-2 ring-card overflow-hidden"
                      >
                        {img.startsWith("http") ? (
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg">{img}</span>
                        )}
                      </div>
                    );
                  })}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ring-2 ring-card text-xs font-semibold text-muted-foreground">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    {order.items
                      .map((i) => i.product?.name || "Product")
                      .join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} item
                    {order.items.reduce((sum, i) => sum + i.quantity, 0) > 1
                      ? "s"
                      : ""}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="font-display text-lg font-bold">
                  ₹{order.totalAmount}
                </span>
                <div className="flex gap-2">
                  {(order.status === "pending" ||
                    order.status === "confirmed") && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer px-3 py-1.5 rounded-full ring-1 ring-border hover:ring-destructive"
                      style={{ border: "none", background: "none" }}
                    >
                      Cancel
                    </button>
                  )}
                  <Link
                    href={`/campus-cart/order/${order._id}`}
                    className="text-xs font-semibold text-primary hover:opacity-80 transition-colors px-3 py-1.5 rounded-full bg-primary/10"
                    style={{ textDecoration: "none" }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
