"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  sellerPrice: number;
  images: string[];
  condition: string;
  status: string;
  averageRating: number;
  reviewCount: number;
}

export default function WishlistPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/login");
      return;
    }
    if (!token) return;

    fetch("/api/campus-cart/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.wishlist?.products) setProducts(data.wishlist.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, isAuthenticated, authLoading, router]);

  const removeFromWishlist = async (productId: string) => {
    if (!token) return;
    try {
      const res = await fetch("/api/campus-cart/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      console.error("Remove from wishlist error:", err);
    }
  };

  const addToCart = async (productId: string) => {
    if (!token) return;
    try {
      const res = await fetch("/api/campus-cart/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        removeFromWishlist(productId);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
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
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-8">
        My Wishlist
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl ring-1 ring-border">
          <div className="text-5xl mb-4">❤️</div>
          <p className="text-muted-foreground mb-2">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground mb-6">
            Save items you like while browsing the shop
          </p>
          <Link
            href="/campus-cart/shop"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all inline-block"
            style={{ textDecoration: "none" }}
          >
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => {
            const img = p.images?.[0] || "📦";
            return (
              <div
                key={p._id}
                className="bg-card rounded-2xl ring-1 ring-border overflow-hidden group hover:ring-primary/30 transition-all"
              >
                {/* Image */}
                <Link
                  href={`/campus-cart/product/${p._id}`}
                  className="block aspect-square bg-secondary flex items-center justify-center overflow-hidden"
                  style={{ textDecoration: "none" }}
                >
                  {img.startsWith("http") ? (
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-6xl">{img}</span>
                  )}
                </Link>

                <div className="p-4">
                  <Link
                    href={`/campus-cart/product/${p._id}`}
                    className="font-semibold text-sm block truncate hover:text-primary transition-colors"
                    style={{
                      textDecoration: "none",
                      color: "var(--foreground)",
                    }}
                  >
                    {p.name}
                  </Link>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-display text-lg font-bold">
                      ₹{p.price}
                    </span>
                    {p.averageRating > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ⭐ {p.averageRating} ({p.reviewCount})
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => addToCart(p._id)}
                      className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
                      style={{ border: "none" }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(p._id)}
                      className="p-2 rounded-full ring-1 ring-border hover:bg-destructive/10 hover:ring-destructive/30 transition-all cursor-pointer"
                      style={{ border: "none", background: "none" }}
                      title="Remove"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
