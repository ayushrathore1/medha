"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    sellerPrice: number;
    commissionAmount: number;
    images: string[];
    stock: number;
  } | null;
  quantity: number;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string;
    orderId: string;
    paymentMethod: string;
  } | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    college: "",
    hostel: "",
    room: "",
    landmark: "",
    orderNotes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");

  // Pre-fill from user profile & localStorage defaults
  useEffect(() => {
    if (user) {
      const storedCollege = localStorage.getItem("cart_default_college");
      const storedHostel = localStorage.getItem("cart_default_hostel");
      const storedRoom = localStorage.getItem("cart_default_room");

      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        college: prev.college || storedCollege || user.college || "",
        hostel: prev.hostel || storedHostel || "",
        room: prev.room || storedRoom || "",
      }));
    }
  }, [user]);

  // Fetch cart
  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (!authLoading) router.push("/login");
      return;
    }

    fetch("/api/campus-cart/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.cart?.items) {
          setItems(data.cart.items.filter((i: CartItem) => i.product));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, token, authLoading, router]);

  // Load Razorpay SDK
  useEffect(() => {
    if (typeof window !== "undefined" && !document.getElementById("razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const validItems = items.filter((item) => item.product);
  const subtotal = validItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const totalCommission = validItems.reduce(
    (sum, item) => sum + (item.product?.commissionAmount || 0) * item.quantity,
    0
  );
  const delivery = subtotal >= 500 ? 0 : 49;
  const total = subtotal + delivery;

  const isFormValid = form.fullName && form.phone && form.college;

  const handleCodOrder = async () => {
    if (!token || !isFormValid) return;
    setPlacing(true);

    try {
      const res = await fetch("/api/campus-cart/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            college: form.college,
            hostel: form.hostel || undefined,
            room: form.room || undefined,
            landmark: form.landmark || undefined,
          },
          paymentMethod: "cod",
          orderNotes: form.orderNotes || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setOrderResult({
          orderNumber: data.order.orderNumber,
          orderId: data.order._id,
          paymentMethod: "cod",
        });
      } else {
        alert(data.message || "Order failed. Please try again.");
      }
    } catch (err) {
      console.error("COD order error:", err);
      alert("Something went wrong. Please try again.");
    }
    setPlacing(false);
  };

  const handleOnlinePayment = async () => {
    if (!token || !isFormValid) return;
    setPlacing(true);

    try {
      // Step 1: Create Razorpay order
      const createRes = await fetch("/api/campus-cart/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const createData = await createRes.json();

      if (!createRes.ok) {
        alert(createData.message || "Failed to create payment order.");
        setPlacing(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency,
        name: "Medha CampusCart",
        description: `Order for ${validItems.length} item${validItems.length > 1 ? "s" : ""}`,
        order_id: createData.orderId,
        prefill: {
          name: form.fullName,
          email: user?.email || "",
          contact: form.phone,
        },
        theme: {
          color: "#E8622A",
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // Step 3: Verify payment
          try {
            const verifyRes = await fetch("/api/campus-cart/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress: {
                  fullName: form.fullName,
                  phone: form.phone,
                  college: form.college,
                  hostel: form.hostel || undefined,
                  room: form.room || undefined,
                  landmark: form.landmark || undefined,
                },
                orderNotes: form.orderNotes || undefined,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.order) {
              setOrderResult({
                orderNumber: verifyData.order.orderNumber,
                orderId: verifyData.order._id,
                paymentMethod: "online",
              });
            } else {
              alert("Payment verification failed. Contact support.");
            }
          } catch {
            alert("Error verifying payment. Contact support.");
          }
          setPlacing(false);
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Online payment error:", err);
      alert("Something went wrong with payment. Please try again.");
      setPlacing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "cod") {
      handleCodOrder();
    } else {
      handleOnlinePayment();
    }
  };

  // ─── Order Confirmation ───
  if (orderResult) {
    return (
      <div className="text-center py-20" style={{ maxWidth: 560, margin: "0 auto" }}>
        <div
          className="text-7xl mb-6"
          style={{ animation: "fade-up 0.6s var(--ease-out-expo) both" }}
        >
          🎉
        </div>
        <h1
          className="font-display text-3xl sm:text-4xl tracking-tight mb-3"
          style={{ animation: "fade-up 0.6s var(--ease-out-expo) 0.1s both" }}
        >
          Order Placed!
        </h1>
        <p
          className="text-muted-foreground mb-2"
          style={{ animation: "fade-up 0.6s var(--ease-out-expo) 0.2s both" }}
        >
          Your order <span className="font-mono font-bold text-foreground">{orderResult.orderNumber}</span> has been confirmed.
        </p>
        <p
          className="text-sm text-muted-foreground mb-8"
          style={{ animation: "fade-up 0.6s var(--ease-out-expo) 0.25s both" }}
        >
          {orderResult.paymentMethod === "online"
            ? "Payment received successfully ✓"
            : "Cash on Delivery — pay when you receive your items"}
        </p>
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          style={{ animation: "fade-up 0.6s var(--ease-out-expo) 0.35s both" }}
        >
          <Link
            href={`/campus-cart/order/${orderResult.orderId}`}
            className="bg-primary text-primary-foreground px-6 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all inline-block"
            style={{ textDecoration: "none" }}
          >
            View Order Details
          </Link>
          <Link
            href="/campus-cart/shop"
            className="px-6 py-3.5 rounded-full text-sm font-semibold ring-1 ring-border hover:bg-card transition-colors inline-block"
            style={{ textDecoration: "none", color: "var(--foreground)" }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (validItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="font-display text-2xl mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some items before checking out</p>
        <Link
          href="/campus-cart/shop"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all inline-block"
          style={{ textDecoration: "none" }}
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      <Link
        href="/campus-cart/cart"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        style={{ textDecoration: "none" }}
      >
        ← Back to cart
      </Link>

      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-8 mt-4">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 gap-8">
          {/* ─── Left: Form ─── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping Address */}
            <div className="bg-card rounded-2xl ring-1 ring-border p-6">
              <h2 className="font-display text-lg mb-4">📍 Delivery Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{ fontFamily: "inherit", color: "var(--foreground)" }}
                    placeholder="Your full name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{ fontFamily: "inherit", color: "var(--foreground)" }}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    College *
                  </label>
                  <input
                    required
                    value={form.college}
                    onChange={(e) =>
                      setForm({ ...form, college: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{ fontFamily: "inherit", color: "var(--foreground)" }}
                    placeholder="e.g. RTU Kota"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Hostel
                  </label>
                  <input
                    value={form.hostel}
                    onChange={(e) =>
                      setForm({ ...form, hostel: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{ fontFamily: "inherit", color: "var(--foreground)" }}
                    placeholder="Hostel name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Room
                  </label>
                  <input
                    value={form.room}
                    onChange={(e) =>
                      setForm({ ...form, room: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    style={{ fontFamily: "inherit", color: "var(--foreground)" }}
                    placeholder="Room no."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Order Notes
                  </label>
                  <textarea
                    value={form.orderNotes}
                    onChange={(e) =>
                      setForm({ ...form, orderNotes: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    style={{ fontFamily: "inherit", color: "var(--foreground)" }}
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-2xl ring-1 ring-border p-6">
              <h2 className="font-display text-lg mb-4">💳 Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`px-4 py-4 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                    paymentMethod === "online"
                      ? "bg-primary/10 ring-2 ring-primary text-foreground"
                      : "bg-secondary text-secondary-foreground ring-1 ring-border hover:ring-primary/30"
                  }`}
                  style={{ border: "none" }}
                >
                  <div className="text-lg mb-1">💳</div>
                  <div className="font-bold">Pay Online</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    UPI · Cards · Net Banking · Wallets
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`px-4 py-4 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                    paymentMethod === "cod"
                      ? "bg-primary/10 ring-2 ring-primary text-foreground"
                      : "bg-secondary text-secondary-foreground ring-1 ring-border hover:ring-primary/30"
                  }`}
                  style={{ border: "none" }}
                >
                  <div className="text-lg mb-1">💵</div>
                  <div className="font-bold">Cash on Delivery</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Pay when you receive
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ─── Right: Order Summary ─── */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl ring-1 ring-border p-6 sticky top-24">
              <h3 className="font-display text-lg mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-[240px] overflow-y-auto">
                {validItems.map((item) => {
                  const p = item.product!;
                  const img = p.images?.[0] || "📦";
                  return (
                    <div
                      key={p._id}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                        {img.startsWith("http") ? (
                          <img src={img} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">{img}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold shrink-0">
                        ₹{p.price * item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span className="font-semibold text-primary">₹{totalCommission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold">
                    {delivery === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${delivery}`
                    )}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="text-[10px] text-muted-foreground">
                    Free delivery on orders above ₹500
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-xl font-bold">₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing || !isFormValid}
                className="w-full mt-6 bg-primary text-primary-foreground px-6 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ border: "none" }}
              >
                {placing
                  ? "Processing..."
                  : paymentMethod === "online"
                  ? `Pay ₹${total} Online`
                  : `Place COD Order — ₹${total}`}
              </button>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                🔒 Secured by {paymentMethod === "online" ? "Razorpay" : "Medha CampusCart"}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
