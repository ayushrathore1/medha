"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: { name: string; slug: string } | string;
  condition: string;
  college: string;
  qualityVerification: string;
  averageRating: number;
  reviewCount: number;
}

const HERO_BANNERS = [
  {
    title: "Semester Study Kits",
    subtitle: "Drafters, Calculators & Stationery",
    badge: "Starting under ₹199",
    image: "📐",
    bg: "linear-gradient(135deg, hsl(40 80% 85%), hsl(40 70% 75%))",
    dark: "linear-gradient(135deg, hsl(40 50% 15%), hsl(40 40% 20%))",
  },
  {
    title: "Bestselling Textbooks",
    subtitle: "RTU syllabus notes & core textbooks",
    badge: "Flat 40% Off",
    image: "📘",
    bg: "linear-gradient(135deg, hsl(215 80% 88%), hsl(215 70% 80%))",
    dark: "linear-gradient(135deg, hsl(215 40% 15%), hsl(215 35% 22%))",
  },
  {
    title: "Hostel Essentials Setup",
    subtitle: "Everything you need for your hostel room",
    badge: "Peer-to-peer deals",
    image: "🛏️",
    bg: "linear-gradient(135deg, hsl(150 50% 88%), hsl(150 45% 80%))",
    dark: "linear-gradient(135deg, hsl(150 30% 14%), hsl(150 25% 20%))",
  },
];

export default function ShopPage() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sort, setSort] = useState("newest");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [activeBanner, setActiveBanner] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Auto-advance banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev === HERO_BANNERS.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Read category from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setCategory(cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " "));
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    let url = `/api/campus-cart/products?status=active`;

    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category !== "All")
      url += `&category=${encodeURIComponent(category.toLowerCase().replace(/ /g, "-"))}`;
    if (condition !== "All")
      url += `&condition=${encodeURIComponent(condition.toLowerCase().replace(/ /g, "-"))}`;

    if (isAuthenticated && user) {
      if (collegeFilter === "my" && user.college) {
        url += `&college=${encodeURIComponent(user.college)}`;
      }
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let prods: Product[] = data.products || [];
        // Client-side sort
        if (sort === "price-low") prods.sort((a, b) => a.price - b.price);
        else if (sort === "price-high") prods.sort((a, b) => b.price - a.price);
        else if (sort === "rating") prods.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        setProducts(prods);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, category, condition, sort, collegeFilter, isAuthenticated, user]);

  const banner = HERO_BANNERS[activeBanner];

  return (
    <div className="min-h-screen pb-16" style={{ width: "100%", margin: "0 auto" }}>
      {/* ─── Category Sub-Nav ─── */}
      <div className="bg-secondary py-2 px-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold select-none border-b border-border overflow-x-auto">
        {[
          { label: "All Products", cat: "All", icon: "" },
          { label: "Textbooks", cat: "Textbooks", icon: "📚" },
          { label: "Drafters", cat: "Drafters", icon: "📐" },
          { label: "Calculators", cat: "Calculators", icon: "🧮" },
          { label: "Electronics", cat: "Electronics", icon: "💻" },
          { label: "Hostel", cat: "Hostel Essentials", icon: "🏠" },
        ].map((item) => (
          <button
            key={item.cat}
            onClick={() => {
              setCategory(item.cat);
              if (item.cat === "All") setSearch("");
            }}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
              category === item.cat
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            style={{ border: "none", background: category === item.cat ? undefined : "transparent" }}
          >
            {item.icon} {item.label}
          </button>
        ))}

        {isAuthenticated && user && (
          <>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="bg-card border border-border rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
              style={{ color: "var(--foreground)" }}
            >
              <option value="all">🌐 All Campuses</option>
              <option value="my">📍 My College</option>
            </select>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* ─── Hero Banner ─── */}
        <div
          className="relative rounded-3xl overflow-hidden h-[200px] sm:h-[280px] mb-8 shadow-sm transition-all select-none"
          style={{ background: isDark ? banner.dark : banner.bg }}
        >
          <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-12">
            <div className="max-w-md">
              <span className="bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                {banner.badge}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl tracking-tight mt-3 mb-2 font-extrabold">
                {banner.title}
              </h2>
              <p className="text-sm opacity-80 sm:text-base font-semibold text-muted-foreground">
                {banner.subtitle}
              </p>
              <div className="mt-5">
                <Link
                  href="/campus-cart/become-seller"
                  className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:opacity-90"
                  style={{ textDecoration: "none" }}
                >
                  Become a Seller →
                </Link>
              </div>
            </div>
            <div className="text-8xl sm:text-9xl opacity-20 sm:opacity-80 transform rotate-12 shrink-0 select-none">
              {banner.image}
            </div>
          </div>

          <button
            onClick={() => setActiveBanner((prev) => (prev === 0 ? HERO_BANNERS.length - 1 : prev - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 hover:bg-background flex items-center justify-center font-bold shadow-md cursor-pointer"
            style={{ border: "none", color: "var(--foreground)" }}
          >
            ←
          </button>
          <button
            onClick={() => setActiveBanner((prev) => (prev === HERO_BANNERS.length - 1 ? 0 : prev + 1))}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/70 hover:bg-background flex items-center justify-center font-bold shadow-md cursor-pointer"
            style={{ border: "none", color: "var(--foreground)" }}
          >
            →
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {HERO_BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeBanner ? "bg-primary w-5" : "bg-foreground/20"
                }`}
                style={{ border: "none", padding: 0 }}
              />
            ))}
          </div>
        </div>

        {/* ─── Search & Filters ─── */}
        <div className="bg-card p-4 rounded-2xl ring-1 ring-border flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="w-full md:w-auto flex-1">
            <input
              type="text"
              placeholder="Search products... (e.g. Casio, bed sheet)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ fontFamily: "inherit", color: "var(--foreground)" }}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-semibold outline-none cursor-pointer"
              style={{ color: "var(--foreground)" }}
            >
              <option value="All">All Conditions</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Used">Used</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-semibold outline-none cursor-pointer"
              style={{ color: "var(--foreground)" }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* ─── Products Grid ─── */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1 block">
              Live Catalog
            </span>
            <h2 className="font-display text-2xl font-extrabold">
              {category === "All" ? "All Listings" : category}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-semibold">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 bg-card rounded-2xl ring-1 ring-border">
            <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl ring-1 ring-border">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-sm">No listings found.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try changing your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => {
              const image = p.images?.[0] || "📦";
              const catName =
                typeof p.category === "string"
                  ? p.category
                  : p.category?.name || "General";
              return (
                <Link
                  key={p._id}
                  href={`/campus-cart/product/${p._id}`}
                  className="group bg-card p-4 rounded-2xl ring-1 ring-border hover:ring-primary/30 transition-all duration-300 hover:shadow-md block"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="relative w-full h-40 bg-secondary rounded-xl flex items-center justify-center overflow-hidden mb-3">
                    <div className="absolute top-2 right-2 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded font-bold z-10">
                      {p.qualityVerification === "premium"
                        ? "⭐ Premium"
                        : p.condition}
                    </div>
                    {image.startsWith("http") ? (
                      <img
                        src={image}
                        alt={p.name}
                        className="h-full w-full object-contain p-2 rounded-xl transition-all duration-500 transform group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-6xl">{image}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 bg-secondary text-muted-foreground rounded font-bold">
                      {p.condition}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 bg-secondary text-muted-foreground rounded font-bold">
                      {catName}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 h-10 mb-2">
                    {p.name}
                  </h3>

                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-lg font-bold leading-none">
                      ₹{p.price}
                    </span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-xs text-muted-foreground line-through leading-none mb-0.5">
                        ₹{p.originalPrice}
                      </span>
                    )}
                  </div>

                  {p.averageRating > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <span style={{ color: "#F59E0B" }}>★</span>
                      {p.averageRating}
                      <span>({p.reviewCount})</span>
                    </div>
                  )}

                  <div className="border-t border-border pt-2 flex items-center text-[10px] text-muted-foreground font-semibold">
                    <span>📍 {p.college || "Campus"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
