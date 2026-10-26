"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  condition: string;
  college: string;
  qualityVerification: string;
}

const FALLBACK_PRODUCTS = [
  { _id: "1", name: "Engineering Drafter", price: 249, originalPrice: 450, images: ["📐"], condition: "like-new", college: "RTU Kota", qualityVerification: "verified" },
  { _id: "2", name: "Scientific Calculator", price: 899, originalPrice: 1299, images: ["🧮"], condition: "good", college: "RTU Kota", qualityVerification: "premium" },
  { _id: "3", name: "A4 Notebook Bundle", price: 199, originalPrice: 350, images: ["📓"], condition: "new", college: "RTU Kota", qualityVerification: "standard" },
  { _id: "4", name: "Hostel Bed Sheet Set", price: 599, originalPrice: 999, images: ["🛏️"], condition: "new", college: "RTU Kota", qualityVerification: "verified" },
  { _id: "5", name: "Mathematics Textbook", price: 349, originalPrice: 550, images: ["📘"], condition: "good", college: "RTU Kota", qualityVerification: "standard" },
  { _id: "6", name: "Geometry Box", price: 149, originalPrice: 299, images: ["✏️"], condition: "like-new", college: "RTU Kota", qualityVerification: "verified" },
];

export function CampusCartProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campus-cart/products?featured=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
      });
  }, []);

  return (
    <section id="deals" className="py-24 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3 block">Shop</span>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight">Featured deals.</h2>
          </div>
          <Link
            href="/campus-cart/shop"
            className="hidden sm:inline text-sm font-semibold hover:text-primary transition-colors"
            style={{ textDecoration: "none", color: "var(--foreground)" }}
          >
            Browse all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => {
              const image = p.images?.[0] || "📦";
              return (
                <Link
                  key={p._id}
                  href={`/campus-cart/product/${p._id}`}
                  className="group relative bg-card p-6 rounded-3xl ring-1 ring-border hover:ring-primary/30 transition-all hover:-translate-y-1 duration-500 block"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-md">
                    {p.qualityVerification === "premium" ? "⭐ Premium" : p.condition}
                  </div>
                  <div className="text-5xl mb-4 h-16 flex items-center">
                    {image.startsWith("http") ? (
                      <img src={image} alt={p.name} className="h-full object-contain rounded-lg" />
                    ) : (
                      <span>{image}</span>
                    )}
                  </div>
                  <h3 className="font-display text-lg mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold">₹{p.price}</span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-sm text-muted-foreground line-through">₹{p.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-tight px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
                      {p.college || "RTU College"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link
            href="/campus-cart/shop"
            className="inline-block text-sm font-semibold px-6 py-3 rounded-full ring-1 ring-border hover:bg-card transition-colors"
            style={{ textDecoration: "none", color: "var(--foreground)" }}
          >
            Browse all →
          </Link>
        </div>
      </div>
    </section>
  );
}

