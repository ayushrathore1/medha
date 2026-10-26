"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

const FALLBACK_ICONS: Record<string, string> = {
  textbooks: "📘",
  drafters: "📐",
  calculators: "🧮",
  stationery: "✏️",
  electronics: "💻",
  "hostel-essentials": "🏠",
  "lab-equipment": "🔬",
  "sports-fitness": "🏏",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campus-cart/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-2">
        Browse Categories
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Find what you need by category
      </p>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl ring-1 ring-border">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-muted-foreground">
            No categories available yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const icon =
              cat.icon || FALLBACK_ICONS[cat.slug] || "📦";
            return (
              <Link
                key={cat._id}
                href={`/campus-cart/shop?category=${cat.slug}`}
                className="bg-card rounded-2xl ring-1 ring-border p-6 text-center hover:ring-primary/30 hover:shadow-md transition-all group"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Featured Banner */}
      <div className="mt-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl ring-1 ring-primary/20 p-8 text-center">
        <h2 className="font-display text-2xl mb-2">Got something to sell?</h2>
        <p className="text-muted-foreground text-sm mb-4">
          List your items and earn money from your campus community
        </p>
        <Link
          href="/campus-cart/become-seller"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all inline-block"
          style={{ textDecoration: "none" }}
        >
          Start Selling →
        </Link>
      </div>
    </div>
  );
}
