"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const COMMISSION_PERCENT = 6;
const MIN_PRICE = 10;
const MAX_PRICE = 50000;

const CATEGORY_LIMITS: Record<string, { label: string; max: number }> = {
  "textbooks": { label: "Textbooks", max: 1500 },
  "drafters": { label: "Drafters", max: 800 },
  "calculators": { label: "Calculators", max: 2000 },
  "stationery": { label: "Stationery", max: 500 },
  "electronics": { label: "Electronics", max: 35000 },
  "hostel-essentials": { label: "Hostel Essentials", max: 4000 }
};

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

export default function BecomeSellerPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState({
    productName: "",
    category: "",
    sellerPrice: "",
    description: "",
    condition: "good",
    college: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const slug = form.productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const activeCategoryLimit = form.category ? (CATEGORY_LIMITS[form.category]?.max || 5000) : MAX_PRICE;
  const sellerPrice = parseFloat(form.sellerPrice) || 0;
  const commissionAmount = Math.round(sellerPrice * COMMISSION_PERCENT) / 100;
  const finalPrice = sellerPrice + commissionAmount;
  const isValidPrice = sellerPrice >= MIN_PRICE && sellerPrice <= activeCategoryLimit;


  useEffect(() => {
    fetch("/api/campus-cart/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("image", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) setImages((prev) => [...prev, data.url]);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
    setUploading(false);
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((img) => img !== url));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPrice || !token) return;

    try {
      const res = await fetch("/api/campus-cart/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.productName,
          slug,
          description: form.description,
          sellerPrice,
          images,
          category: form.category,
          condition: form.condition,
          college: form.college,
          stock: 1,
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-20" style={{ maxWidth: 500, margin: "0 auto" }}>
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="font-display text-3xl tracking-tight mb-2">Listing Submitted!</h1>
        <p className="text-muted-foreground mb-6">
          Your product has been listed for review. Our team will verify the quality, and you&apos;ll be notified when it&apos;s live.
        </p>
        <Link
          href="/campus-cart/shop"
          className="bg-ink text-background px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors inline-block"
          style={{ textDecoration: "none" }}
        >
          View Shop
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "32px auto", padding: "0 16px" }}>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-2">Become a Seller</h1>
      <p className="text-muted-foreground text-sm mb-8">List your item for sale to students on your campus.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="bg-card rounded-2xl ring-1 ring-border p-6">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
            Product Images
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-3xl mb-2">📸</div>
            <p className="text-sm text-muted-foreground">Drop images here or click to browse</p>
            <p className="text-[10px] text-muted-foreground mt-1">Upload up to 5 images (JPEG, PNG, WebP)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
          </div>

          {uploading && (
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block" />
              Uploading images...
            </div>
          )}

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`Product ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-lg ring-1 ring-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ border: "none" }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-card rounded-2xl ring-1 ring-border p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Product Name
            </label>
            <input
              required
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ fontFamily: "inherit", color: "var(--foreground)" }}
              placeholder="e.g., Engineering Drafter"
            />
            {form.productName && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Slug: <span className="font-mono text-primary">{slug}</span>
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ fontFamily: "inherit", color: "var(--foreground)" }}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Condition
              </label>
              <select
                required
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ fontFamily: "inherit", color: "var(--foreground)" }}
              >
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              style={{ fontFamily: "inherit", color: "var(--foreground)" }}
              placeholder="Describe your item's condition, reason for selling, etc."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              College
            </label>
            <input
              required
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ fontFamily: "inherit", color: "var(--foreground)" }}
              placeholder="e.g., RTU Kota"
            />
          </div>
        </div>

        {/* Quality Verification */}
        <div className="bg-card rounded-2xl ring-1 ring-border p-6">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5 shrink-0">✅</span>
            <div>
              <h3 className="font-semibold text-sm mb-1">Quality Verification</h3>
              <p className="text-xs text-muted-foreground">
                Our team will review your item&apos;s quality after listing. Verified items get a badge
                and appear higher in search results. Premium quality items may be featured.
              </p>
            </div>
          </div>
        </div>

        {/* Price Setup */}
        <div className="bg-card rounded-2xl ring-1 ring-border p-6">
          <h3 className="font-semibold text-sm mb-4">Price Setup</h3>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Your Price <span className="font-normal normal-case">(what you receive)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <input
                required
                type="number"
                min={MIN_PRICE}
                max={activeCategoryLimit}
                value={form.sellerPrice}
                onChange={(e) => setForm({ ...form, sellerPrice: e.target.value })}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ fontFamily: "inherit", color: "var(--foreground)" }}
                placeholder="100"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Price range for this category: ₹{MIN_PRICE} – ₹{activeCategoryLimit}
            </p>
          </div>

          {sellerPrice > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-secondary/50 ring-1 ring-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your price</span>
                <span className="font-semibold">₹{sellerPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform commission ({COMMISSION_PERCENT}%)</span>
                <span className="font-semibold text-primary">+ ₹{commissionAmount}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between items-center">
                <span className="font-semibold">Buyer pays</span>
                <span className="font-display text-xl font-bold">₹{finalPrice}</span>
              </div>
            </div>
          )}

          {form.sellerPrice && !isValidPrice && (
            <p className="text-xs text-destructive mt-2">
              Price must be between ₹{MIN_PRICE} and ₹{activeCategoryLimit} for this category.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValidPrice || images.length === 0 || uploading || !isAuthenticated}
          className="w-full bg-ink text-background px-6 py-4 rounded-full text-sm font-semibold hover:bg-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ border: "none" }}
        >
          {!isAuthenticated ? "Login Required to Sell" : "List Item for Sale"}
        </button>
      </form>
    </div>
  );
}
