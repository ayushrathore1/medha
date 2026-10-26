"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/* ─── Types ─── */
interface Product {
  _id: string;
  name: string;
  price: number;
  sellerPrice: number;
  commissionAmount: number;
  condition: string;
  status: "active" | "sold" | "inactive";
  qualityVerification: "pending" | "verified" | "premium" | "standard";
  images: string[];
  stock: number;
}

interface SellerOrder {
  _id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  user: { name: string; email: string; avatar?: string; college?: string };
  shippingAddress: {
    fullName: string;
    phone: string;
    college: string;
    hostel?: string;
    room?: string;
  };
  items: Array<{
    product: { _id: string; name: string; images: string[]; price: number; sellerPrice: number };
    quantity: number;
    price: number;
    sellerEarning: number;
  }>;
}

interface SellerStats {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  soldProducts: number;
  pendingVerification: number;
  totalProducts: number;
  orderBreakdown: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
  };
  revenueChart: Array<{ month: string; revenue: number }>;
}

type Tab = "overview" | "products" | "orders" | "earnings";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const NEXT_STATUS: Record<string, { label: string; action: string }> = {
  pending: { label: "Confirm Order", action: "confirmed" },
  confirmed: { label: "Mark Shipped", action: "shipped" },
  shipped: { label: "Mark Delivered", action: "delivered" },
};

export default function SellerDashboardPage() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user || !token) return;

    // Fetch stats + products in parallel
    Promise.all([
      fetch("/api/campus-cart/seller/stats", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`/api/campus-cart/products?seller=${user._id}&status=all`).then(
        (r) => r.json()
      ),
    ])
      .then(([statsData, productsData]) => {
        if (statsData.totalRevenue !== undefined) setStats(statsData);
        if (productsData.products) setProducts(productsData.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, user, router, token]);

  // Fetch seller orders when tab changes
  useEffect(() => {
    if (tab === "orders" && token && orders.length === 0) {
      setOrdersLoading(true);
      fetch("/api/campus-cart/seller/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
          setOrdersLoading(false);
        })
        .catch(() => setOrdersLoading(false));
    }
  }, [tab, token, orders.length]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/campus-cart/seller/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
      }
    } catch (err) {
      console.error("Update order status error:", err);
    }
  };

  const markAsSold = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/campus-cart/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "sold" }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: "sold" } : p))
        );
      }
    } catch (err) {
      console.error("Error marking as sold:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`/api/campus-cart/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeListings = products.filter((p) => p.status === "active");
  const soldListings = products.filter((p) => p.status === "sold");

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "products", label: "Products", icon: "📦" },
    { key: "orders", label: "Orders", icon: "🧾" },
    { key: "earnings", label: "Earnings", icon: "💰" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "32px auto", padding: "0 16px" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight">
            Seller Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {user?.name || "Seller"}
          </p>
        </div>
        <Link
          href="/campus-cart/become-seller"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all inline-block text-center shadow-sm"
          style={{ textDecoration: "none" }}
        >
          + List New Item
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              tab === t.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
            style={{ border: "none" }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ─── Overview Tab ─── */}
      {tab === "overview" && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-5 rounded-2xl ring-1 ring-border text-center">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2 font-mono">
                Total Revenue
              </div>
              <div className="font-display text-2xl font-bold text-green-600">
                ₹{stats?.totalRevenue || 0}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                After platform fee
              </div>
            </div>
            <div className="bg-card p-5 rounded-2xl ring-1 ring-border text-center">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2 font-mono">
                Active Listings
              </div>
              <div className="font-display text-2xl font-bold">
                {stats?.activeProducts || 0}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Visible on marketplace
              </div>
            </div>
            <div className="bg-card p-5 rounded-2xl ring-1 ring-border text-center">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2 font-mono">
                Total Orders
              </div>
              <div className="font-display text-2xl font-bold">
                {stats?.totalOrders || 0}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                All time
              </div>
            </div>
            <div className="bg-card p-5 rounded-2xl ring-1 ring-border text-center">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2 font-mono">
                Pending Actions
              </div>
              <div className="font-display text-2xl font-bold text-amber-600">
                {(stats?.orderBreakdown?.pending || 0) +
                  (stats?.pendingVerification || 0)}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Orders + Verifications
              </div>
            </div>
          </div>

          {/* Order Status Breakdown */}
          {stats && stats.totalOrders > 0 && (
            <div className="bg-card rounded-2xl ring-1 ring-border p-6">
              <h3 className="font-display text-lg mb-4">Order Pipeline</h3>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(stats.orderBreakdown).map(([key, count]) => (
                  <div
                    key={key}
                    className={`px-4 py-3 rounded-xl text-center flex-1 min-w-[100px] ${
                      STATUS_COLORS[key] || "bg-secondary"
                    }`}
                  >
                    <div className="text-xl font-bold">{count}</div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold capitalize">
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setTab("orders")}
              className="bg-card rounded-2xl ring-1 ring-border p-6 text-left hover:ring-primary/30 transition-all cursor-pointer"
              style={{ border: "none" }}
            >
              <div className="text-2xl mb-2">🧾</div>
              <h3 className="font-display text-lg mb-1">Manage Orders</h3>
              <p className="text-sm text-muted-foreground">
                View and fulfill incoming orders
              </p>
            </button>
            <Link
              href="/campus-cart/become-seller"
              className="bg-card rounded-2xl ring-1 ring-border p-6 text-left hover:ring-primary/30 transition-all block"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-display text-lg mb-1">List New Product</h3>
              <p className="text-sm text-muted-foreground">
                Add a new item to the marketplace
              </p>
            </Link>
          </div>
        </div>
      )}

      {/* ─── Products Tab ─── */}
      {tab === "products" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl">My Listings</h2>
            <span className="text-sm text-muted-foreground">
              {activeListings.length} active · {soldListings.length} sold
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl ring-1 ring-border">
              <div className="text-5xl mb-4">🏪</div>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t listed any products yet.
              </p>
              <Link
                href="/campus-cart/become-seller"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all inline-block"
                style={{ textDecoration: "none" }}
              >
                List Your First Item
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p) => {
                const image = p.images?.[0] || "📦";
                return (
                  <div
                    key={p._id}
                    className="bg-card rounded-2xl ring-1 ring-border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-secondary shrink-0 overflow-hidden">
                        {image.startsWith("http") ? (
                          <img
                            src={image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">{image}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{p.name}</h3>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md">
                            {p.condition}
                          </span>
                          <span
                            className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md ${
                              p.status === "active"
                                ? "bg-green-100 text-green-800"
                                : p.status === "sold"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {p.status}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                            {p.qualityVerification}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <div className="font-semibold">₹{p.sellerPrice}</div>
                        <div className="text-xs text-muted-foreground">
                          Buyer: ₹{p.price} · Stock: {p.stock}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {p.status === "active" && (
                          <button
                            onClick={() => markAsSold(p._id)}
                            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
                            style={{ border: "none" }}
                          >
                            Mark Sold
                          </button>
                        )}
                        <button
                          onClick={() => deleteProduct(p._id)}
                          className="ring-1 ring-border text-muted-foreground hover:bg-destructive hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
                          style={{ border: "none", background: "none" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Orders Tab ─── */}
      {tab === "orders" && (
        <div>
          <h2 className="font-display text-2xl mb-6">Incoming Orders</h2>

          {ordersLoading ? (
            <div className="flex justify-center py-20">
              <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl ring-1 ring-border">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-muted-foreground">No orders yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Orders will appear here when buyers purchase your items.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-card rounded-2xl ring-1 ring-border p-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                    <div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-muted-foreground ml-3">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md ${
                          STATUS_COLORS[order.status] || "bg-secondary"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.paymentMethod === "cod" ? "COD" : "Paid Online"}
                      </span>
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div className="bg-secondary/50 rounded-xl p-3 mb-4 text-sm">
                    <div className="font-semibold">{order.shippingAddress.fullName}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      📞 {order.shippingAddress.phone} · 🏫 {order.shippingAddress.college}
                      {order.shippingAddress.hostel && ` · 🏠 ${order.shippingAddress.hostel}`}
                      {order.shippingAddress.room && ` Room ${order.shippingAddress.room}`}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product?.images?.[0]?.startsWith("http") ? (
                            <img
                              src={item.product.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">
                              {item.product?.images?.[0] || "📦"}
                            </span>
                          )}
                        </div>
                        <span className="flex-1">
                          {item.product?.name || "Product"} × {item.quantity}
                        </span>
                        <span className="font-semibold text-green-600">
                          ₹{item.sellerEarning || item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order._id,
                          NEXT_STATUS[order.status].action
                        )
                      }
                      className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all cursor-pointer"
                      style={{ border: "none" }}
                    >
                      {NEXT_STATUS[order.status].label} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Earnings Tab ─── */}
      {tab === "earnings" && (
        <div className="space-y-6">
          <div className="bg-card rounded-2xl ring-1 ring-border p-6">
            <h2 className="font-display text-2xl mb-1">Earnings Overview</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Track your revenue and payouts
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-5 rounded-xl">
                <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                  Total Earnings
                </div>
                <div className="font-display text-3xl font-bold text-green-700 dark:text-green-400">
                  ₹{stats?.totalRevenue || 0}
                </div>
              </div>
              <div className="bg-secondary/50 p-5 rounded-xl">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Items Sold
                </div>
                <div className="font-display text-3xl font-bold">
                  {stats?.soldProducts || 0}
                </div>
              </div>
              <div className="bg-secondary/50 p-5 rounded-xl">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Delivered Orders
                </div>
                <div className="font-display text-3xl font-bold">
                  {stats?.orderBreakdown?.delivered || 0}
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            {stats?.revenueChart && stats.revenueChart.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3">Monthly Revenue</h3>
                <div className="flex items-end gap-2 h-32">
                  {stats.revenueChart.map((point) => {
                    const maxRevenue = Math.max(
                      ...stats.revenueChart.map((p) => p.revenue)
                    );
                    const height =
                      maxRevenue > 0
                        ? (point.revenue / maxRevenue) * 100
                        : 0;
                    return (
                      <div
                        key={point.month}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <span className="text-[10px] font-mono text-muted-foreground">
                          ₹{point.revenue}
                        </span>
                        <div
                          className="w-full bg-primary/80 rounded-t-md transition-all"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {point.month.split("-")[1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Commission Info */}
          <div className="bg-card rounded-2xl ring-1 ring-border p-6">
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">ℹ️</span>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Platform Fee Structure
                </h3>
                <p className="text-xs text-muted-foreground">
                  CampusCart charges a 6% platform fee on each sale. The fee is
                  added to the buyer&apos;s price — you receive the full seller
                  price you set. Payouts are processed after delivery
                  confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
