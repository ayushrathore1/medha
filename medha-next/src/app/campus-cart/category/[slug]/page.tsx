"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  condition: string;
  college: string;
  qualityVerification: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

function CategoryContent() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    // Fetch categories first to find matching slug details
    fetch("/api/campus-cart/categories")
      .then((r) => r.json())
      .then((catData) => {
        if (catData.categories) {
          const found = catData.categories.find((c: Category) => c.slug === slug);
          if (found) setCategory(found);
        }
      })
      .catch(() => {});

    // Fetch products belonging to this category slug
    fetch(`/api/campus-cart/products?category=${slug}`)
      .then((r) => r.json())
      .then((prodData) => {
        if (prodData.products) {
          setProducts(prodData.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="font-display text-2xl mb-2">Category not found</h2>
        <Link href="/campus-cart/categories" className="text-primary hover:underline text-sm">Browse categories</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      <Link href="/campus-cart/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors" style={{ textDecoration: "none" }}>← All categories</Link>

      <div className="flex items-center gap-3 mt-4 mb-4">
        <span className="text-4xl">{category.image || "📦"}</span>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight">{category.name}</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8 max-w-xl">{category.description}</p>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl ring-1 ring-border text-muted-foreground">
          <div className="text-3xl mb-3">🛍️</div>
          <p>No products listed in this category yet. Be the first to list one!</p>
          <Link href="/campus-cart/become-seller" className="text-primary hover:underline text-sm font-semibold mt-2 inline-block">Become a Seller</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const image = p.images?.[0] || "📦";
            return (
              <Link
                key={p._id}
                href={`/campus-cart/product/${p._id}`}
                className="bg-card p-6 rounded-3xl ring-1 ring-border hover:ring-primary/30 transition-all hover:-translate-y-1 duration-500 block"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-md">
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold">₹{p.price}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-tight px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md">
                    {p.college}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
