"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    sellerPrice: number;
    commissionAmount: number;
    commissionPercent: number;
    images: string[];
    stock: number;
  } | null;
  quantity: number;
}

interface CartData {
  _id: string;
  items: CartItem[];
}

export default function CartPage() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetch("/api/campus-cart/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.cart?.items) setItems(data.cart.items);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const updateQty = async (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(productId);

    if (isAuthenticated && token) {
      try {
        const res = await fetch("/api/campus-cart/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity: newQty }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.cart?.items) setItems(data.cart.items);
        }
      } catch (err) {
        console.error("Update cart error:", err);
      }
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.product?._id === productId ? { ...item, quantity: newQty } : item
        )
      );
    }
    setUpdatingId(null);
  };

  const removeItem = async (productId: string) => {
    if (isAuthenticated && token) {
      try {
        const res = await fetch("/api/campus-cart/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.cart?.items) setItems(data.cart.items);
        }
      } catch (err) {
        console.error("Remove from cart error:", err);
      }
    } else {
      setItems((prev) => prev.filter((item) => item.product?._id !== productId));
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-8">Shopping Cart</h1>

      {validItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🛒</div>
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link
            href="/campus-cart/shop"
            className="bg-ink text-background px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary transition-colors inline-block"
            style={{ textDecoration: "none" }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {validItems.map((item) => {
              const p = item.product!;
              const itemTotal = p.price * item.quantity;
              return (
                <div
                  key={p._id}
                  className={`bg-card rounded-2xl ring-1 ring-border p-5 flex items-center gap-5 ${
                    updatingId === p._id ? "opacity-60" : ""
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary shrink-0">
                    {p.images?.[0]?.startsWith("http") ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-3xl">{p.images?.[0] || "📦"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/campus-cart/product/${p._id}`}
                      className="font-display text-lg hover:text-primary transition-colors block truncate"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      ₹{p.sellerPrice} each + ₹{p.commissionAmount} fee
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(p._id, item.quantity - 1)}
                      disabled={updatingId === p._id}
                      className="w-8 h-8 rounded-full bg-secondary hover:bg-accent transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center text-sm font-semibold"
                      style={{ border: "none" }}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(p._id, item.quantity + 1)}
                      disabled={updatingId === p._id}
                      className="w-8 h-8 rounded-full bg-secondary hover:bg-accent transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center text-sm font-semibold"
                      style={{ border: "none" }}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="font-semibold">₹{itemTotal}</div>
                    <button
                      onClick={() => removeItem(p._id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      style={{ border: "none", background: "none" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl ring-1 ring-border p-6 sticky top-24">
              <h3 className="font-display text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fees</span>
                  <span className="font-semibold text-primary">₹{totalCommission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold">{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                </div>
                {delivery > 0 && (
                  <p className="text-[10px] text-muted-foreground">Free delivery on orders above ₹500</p>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-xl font-bold">₹{total}</span>
                </div>
              </div>
              <Link
                href="/campus-cart/checkout"
                className="block mt-6 w-full bg-ink text-background text-center px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors"
                style={{ textDecoration: "none" }}
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/campus-cart/shop"
                className="block mt-2 w-full text-center px-6 py-3 rounded-full text-sm font-semibold ring-1 ring-border hover:bg-card transition-colors"
                style={{ textDecoration: "none", color: "var(--foreground)" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
