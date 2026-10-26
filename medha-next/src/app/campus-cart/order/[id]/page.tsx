"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId?: string;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    college: string;
    hostel?: string;
    room?: string;
    landmark?: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      images: string[];
      price: number;
      sellerPrice: number;
    } | null;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

const TIMELINE_STEPS = ["pending", "confirmed", "shipped", "delivered"];
const STEP_LABELS: Record<string, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};
const STEP_ICONS: Record<string, string> = {
  pending: "📋",
  confirmed: "✅",
  shipped: "🚚",
  delivered: "📦",
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
      return;
    }
    if (!token) return;

    fetch(`/api/campus-cart/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token, isAuthenticated, authLoading, router]);

  const cancelOrder = async () => {
    if (!token || !order) return;
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`/api/campus-cart/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) setOrder({ ...order, status: "cancelled" });
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

  if (!order) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-display text-2xl mb-2">Order Not Found</h2>
        <Link
          href="/campus-cart/orders"
          className="text-sm text-primary hover:opacity-80"
          style={{ textDecoration: "none" }}
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
      <Link
        href="/campus-cart/orders"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        style={{ textDecoration: "none" }}
      >
        ← Back to orders
      </Link>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mt-4 mb-8">
        <div>
          <h1 className="font-display text-3xl tracking-tight">
            Order Details
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-mono">{order.orderNumber}</span>
            <span className="mx-2">·</span>
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        {(order.status === "pending" || order.status === "confirmed") && (
          <button
            onClick={cancelOrder}
            className="text-sm text-destructive ring-1 ring-destructive/30 hover:bg-destructive hover:text-white px-4 py-2 rounded-full transition-all cursor-pointer"
            style={{ border: "none", background: "none" }}
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Status Timeline */}
      {!isCancelled ? (
        <div className="bg-card rounded-2xl ring-1 ring-border p-6 mb-6">
          <h3 className="font-display text-lg mb-6">Order Status</h3>
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%`,
              }}
            />

            {TIMELINE_STEPS.map((step, i) => {
              const isCompleted = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div
                  key={step}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                      isCompleted
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-muted-foreground"
                    } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                  >
                    {STEP_ICONS[step]}
                  </div>
                  <span
                    className={`text-[11px] mt-2 font-semibold ${
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {STEP_LABELS[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl ring-1 ring-red-200 dark:ring-red-900/30 p-6 mb-6 text-center">
          <span className="text-3xl">❌</span>
          <p className="font-semibold text-red-700 dark:text-red-400 mt-2">
            This order has been cancelled
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-card rounded-2xl ring-1 ring-border p-6">
          <h3 className="font-display text-lg mb-4">Items</h3>
          <div className="space-y-4">
            {order.items.map((item, i) => {
              const p = item.product;
              const img = p?.images?.[0] || "📦";
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                    {img.startsWith("http") ? (
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{img}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {p ? (
                      <Link
                        href={`/campus-cart/product/${p._id}`}
                        className="text-sm font-medium hover:text-primary transition-colors truncate block"
                        style={{
                          textDecoration: "none",
                          color: "var(--foreground)",
                        }}
                      >
                        {p.name}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Product unavailable
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × ₹{item.price}
                    </span>
                  </div>
                  <span className="font-semibold text-sm">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-border mt-4 pt-3 flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="font-display text-xl font-bold">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl ring-1 ring-border p-6">
            <h3 className="font-display text-lg mb-4">📍 Delivery Address</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p className="text-muted-foreground">
                📞 {order.shippingAddress.phone}
              </p>
              <p className="text-muted-foreground">
                🏫 {order.shippingAddress.college}
              </p>
              {order.shippingAddress.hostel && (
                <p className="text-muted-foreground">
                  🏠 {order.shippingAddress.hostel}
                  {order.shippingAddress.room &&
                    `, Room ${order.shippingAddress.room}`}
                </p>
              )}
              {order.shippingAddress.landmark && (
                <p className="text-muted-foreground">
                  📌 {order.shippingAddress.landmark}
                </p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-2xl ring-1 ring-border p-6">
            <h3 className="font-display text-lg mb-4">💳 Payment</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-semibold capitalize">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`font-semibold ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : order.paymentStatus === "failed"
                      ? "text-destructive"
                      : "text-amber-600"
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </span>
              </div>
              {order.paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs">
                    {order.paymentId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
