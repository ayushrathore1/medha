"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type OperationsTab = "overview" | "orders" | "shipments" | "payments" | "withdrawals" | "users" | "disputes" | "reports";

type DataRow = Record<string, any>;

export default function AdminOperationsPage() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState<OperationsTab>("overview");
  const [orders, setOrders] = useState<DataRow[]>([]);
  const [shipments, setShipments] = useState<DataRow[]>([]);
  const [payments, setPayments] = useState<DataRow[]>([]);
  const [withdrawals, setWithdrawals] = useState<DataRow[]>([]);
  const [users, setUsers] = useState<DataRow[]>([]);
  const [disputes, setDisputes] = useState<DataRow[]>([]);
  const [reports, setReports] = useState<DataRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!token) return;
      setLoading(true);
      try {
        const tasks: Promise<unknown>[] = [];

        if (tab === "overview" || tab === "orders") {
          tasks.push(fetch("/api/campus-cart/admin/orders", { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((payload) => setOrders(payload.orders || [])));
        }
        if (tab === "overview" || tab === "shipments") {
          tasks.push(fetch("/api/campus-cart/fulfillment", { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((payload) => setShipments(payload.shipments || [])));
        }
        if (tab === "overview" || tab === "payments") {
          tasks.push(fetch("/api/campus-cart/admin/payments", { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((payload) => setPayments(payload.payments || [])));
        }
        if (tab === "overview" || tab === "withdrawals") {
          tasks.push(fetch("/api/campus-cart/admin/withdrawals", { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((payload) => setWithdrawals(payload.requests || [])));
        }
        if (tab === "overview" || tab === "users") {
          tasks.push(fetch("/api/campus-cart/admin/users", { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((payload) => setUsers(payload.users || [])));
        }
        if (tab === "overview" || tab === "disputes") {
          tasks.push(fetch("/api/campus-cart/admin/disputes", { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((payload) => setDisputes(payload.disputes || [])));
        }
        if (tab === "overview" || tab === "reports") {
          tasks.push(fetch("/api/campus-cart/admin/reports", { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((payload) => setReports(payload)));
        }

        await Promise.all(tasks);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [tab, token]);

  const updateUser = async (userId: string, changes: Record<string, unknown>) => {
    if (!token) return;
    await fetch("/api/campus-cart/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, ...changes }),
    });
    setUsers((current) => current.map((entry) => (entry._id === userId ? { ...entry, ...changes } : entry)));
  };

  const updatePayment = async (paymentId: string, action: "hold" | "release" | "refund") => {
    if (!token) return;
    await fetch("/api/campus-cart/admin/payments", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paymentId, action, refundReason: action === "refund" ? "Refund approved from admin panel" : undefined }),
    });
    const response = await fetch("/api/campus-cart/admin/payments", { headers: { Authorization: `Bearer ${token}` } });
    const payload = await response.json();
    setPayments(payload.payments || []);
  };

  const updateDispute = async (orderId: string, action: "resolve" | "refund" | "keep-open") => {
    if (!token) return;
    await fetch("/api/campus-cart/admin/disputes", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId, action, note: action === "refund" ? "Refund issued from admin panel" : undefined }),
    });
    const response = await fetch("/api/campus-cart/admin/disputes", { headers: { Authorization: `Bearer ${token}` } });
    const payload = await response.json();
    setDisputes(payload.disputes || []);
  };

  const updateWithdrawal = async (requestId: string, status: "approved" | "processed" | "rejected") => {
    if (!token) return;
    await fetch("/api/campus-cart/admin/withdrawals", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ requestId, status, adminNote: `Updated from admin panel: ${status}` }),
    });
    const response = await fetch("/api/campus-cart/admin/withdrawals", { headers: { Authorization: `Bearer ${token}` } });
    const payload = await response.json();
    setWithdrawals(payload.requests || []);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Admin operations</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground">Marketplace control center</h1>
        <p className="mt-2 text-sm text-muted-foreground">Logged in as {user?.name || "admin"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["overview", "orders", "shipments", "payments", "withdrawals", "users", "disputes", "reports"] as OperationsTab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === item ? "bg-primary text-white" : "bg-secondary text-foreground hover:bg-accent"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading admin data…</div>
        ) : null}

        {tab === "overview" && (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-border bg-secondary p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Orders</p>
              <p className="mt-2 text-3xl font-black">{orders.length}</p>
            </div>
            <div className="rounded-3xl border border-border bg-secondary p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Payments</p>
              <p className="mt-2 text-3xl font-black">{payments.length}</p>
            </div>
            <div className="rounded-3xl border border-border bg-secondary p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Disputes</p>
              <p className="mt-2 text-3xl font-black">{disputes.length}</p>
            </div>
            <div className="rounded-3xl border border-border bg-secondary p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Users</p>
              <p className="mt-2 text-3xl font-black">{users.length}</p>
            </div>
            <div className="rounded-3xl border border-border bg-secondary p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Withdrawals</p>
              <p className="mt-2 text-3xl font-black">{withdrawals.length}</p>
            </div>
            <div className="rounded-3xl border border-border bg-secondary p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Shipments</p>
              <p className="mt-2 text-3xl font-black">{shipments.length}</p>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={String(order._id)} className="rounded-3xl border border-border bg-secondary p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.user?.name || order.shippingAddress?.fullName || "Customer"}</p>
                  </div>
                  <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold">{order.status}</span>
                </div>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify(order, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}

        {tab === "shipments" && (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {shipments.map((shipment) => (
              <div key={String(shipment._id)} className="rounded-3xl border border-border bg-secondary p-4 text-sm">
                <p className="font-semibold">{shipment.status}</p>
                <p className="mt-1 text-xs text-muted-foreground">{shipment.pickupAddress}</p>
                <p className="mt-1 text-xs text-muted-foreground">{shipment.deliveryAddress}</p>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(shipment, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}

        {tab === "payments" && (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={String(payment._id)} className="rounded-3xl border border-border bg-secondary p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">₹{payment.amount}</p>
                    <p className="text-xs text-muted-foreground">Escrow: {payment.escrowStatus}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updatePayment(payment._id, "hold")} className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold">Hold</button>
                    <button onClick={() => updatePayment(payment._id, "release")} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">Release</button>
                    <button onClick={() => updatePayment(payment._id, "refund")} className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-white">Refund</button>
                  </div>
                </div>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify(payment, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}

        {tab === "withdrawals" && (
          <div className="space-y-3">
            {withdrawals.map((request) => (
              <div key={String(request._id)} className="rounded-3xl border border-border bg-secondary p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">₹{request.amount}</p>
                    <p className="text-xs text-muted-foreground">{request.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateWithdrawal(request._id, "approved")} className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold">Approve</button>
                    <button onClick={() => updateWithdrawal(request._id, "processed")} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">Processed</button>
                    <button onClick={() => updateWithdrawal(request._id, "rejected")} className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-white">Reject</button>
                  </div>
                </div>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify(request, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-3">
            {users.map((entry) => (
              <div key={String(entry._id)} className="rounded-3xl border border-border bg-secondary p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.email}</p>
                    <p className="text-xs text-muted-foreground">{entry.college || "Campus user"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateUser(entry._id, { isVerifiedStudent: !entry.isVerifiedStudent })} className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold">Student {entry.isVerifiedStudent ? "Verified" : "Pending"}</button>
                    <button onClick={() => updateUser(entry._id, { sellerVerified: !entry.sellerVerified, role: entry.sellerVerified ? "buyer" : "seller" })} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">Seller {entry.sellerVerified ? "Verified" : "Pending"}</button>
                  </div>
                </div>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify(entry, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}

        {tab === "disputes" && (
          <div className="space-y-3">
            {disputes.map((order) => (
              <div key={String(order._id)} className="rounded-3xl border border-border bg-secondary p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.disputeReason || "Open dispute"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateDispute(order._id, "keep-open")} className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold">Keep Open</button>
                    <button onClick={() => updateDispute(order._id, "resolve")} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">Resolve</button>
                    <button onClick={() => updateDispute(order._id, "refund")} className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-white">Refund</button>
                  </div>
                </div>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify(order, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}

        {tab === "reports" && <pre className="overflow-auto whitespace-pre-wrap text-sm">{JSON.stringify(reports, null, 2)}</pre>}
      </div>
    </div>
  );
}