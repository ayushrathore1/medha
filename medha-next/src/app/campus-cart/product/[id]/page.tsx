"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface ProductData {
  _id: string;
  name: string;
  price: number;
  sellerPrice: number;
  commissionAmount: number;
  commissionPercent: number;
  originalPrice?: number;
  images: string[];
  category: { name: string; slug: string } | string;
  condition: string;
  college: string;
  seller: { _id: string; name: string; avatar?: string } | string;
  description: string;
  stock: number;
  qualityVerification: string;
  averageRating: number;
  reviewCount: number;
}

interface Review {
  _id: string;
  user: { name: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

const QUALITY_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  verified: { label: "✓ Verified", color: "bg-green-100 text-green-800" },
  premium: { label: "⭐ Premium", color: "bg-purple-100 text-purple-800" },
  standard: { label: "Standard", color: "bg-blue-100 text-blue-800" },
};

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ fontSize: size, color: star <= Math.round(rating) ? "#F59E0B" : "var(--border)" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ProductContent() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const idStr = id as string;

    fetch(`/api/campus-cart/products/${idStr}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch reviews
    fetch(`/api/campus-cart/reviews?product=${idStr}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
        if (data.averageRating) setAvgRating(data.averageRating);
        if (data.userHasReviewed) setUserHasReviewed(data.userHasReviewed);
      })
      .catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !token) return;
    setAdding(true);
    try {
      const res = await fetch("/api/campus-cart/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      if (res.ok) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
    setAdding(false);
  };

  const toggleWishlist = async () => {
    if (!token || !product) return;
    try {
      const res = await fetch("/api/campus-cart/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      if (res.ok) setWishlisted(data.wishlisted);
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !product) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/campus-cart/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product._id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setUserHasReviewed(true);
        setShowReviewForm(false);
        setReviewComment("");
        // Update avg
        const newTotal = reviews.length + 1;
        const newAvg =
          (avgRating * reviews.length + reviewRating) / newTotal;
        setAvgRating(Math.round(newAvg * 10) / 10);
      } else {
        alert(data.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Submit review error:", err);
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-display text-2xl mb-2">Product not found</h2>
        <Link
          href="/campus-cart/shop"
          className="text-primary hover:underline text-sm"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["📦"];
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "General";
  const sellerName =
    typeof product.seller === "string"
      ? product.seller
      : product.seller?.name || "Unknown";
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const qualityInfo =
    QUALITY_LABELS[product.qualityVerification] || QUALITY_LABELS.pending;

  return (
    <div style={{ maxWidth: 1000, margin: "32px auto", padding: "0 16px" }}>
      <Link
        href="/campus-cart/shop"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        style={{ textDecoration: "none" }}
      >
        ← Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        {/* Image Carousel */}
        <div>
          <div className="relative bg-card rounded-3xl ring-1 ring-border p-6 flex items-center justify-center min-h-[300px] group overflow-hidden">
            {images[selectedImage]?.startsWith("http") ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-[300px] object-contain rounded-xl transition-all duration-500 transform hover:scale-[1.02]"
              />
            ) : (
              <span className="text-8xl select-none">
                {images[selectedImage]}
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 hover:bg-primary hover:text-primary-foreground flex items-center justify-center border border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-sm font-bold z-10"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 hover:bg-primary hover:text-primary-foreground flex items-center justify-center border border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-sm font-bold z-10"
                >
                  →
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === selectedImage
                          ? "bg-primary w-4"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                      }`}
                      style={{ border: "none", padding: 0 }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl ring-1 overflow-hidden transition-all cursor-pointer shrink-0 ${
                    i === selectedImage
                      ? "ring-primary ring-2 scale-105"
                      : "ring-border hover:ring-primary/50"
                  }`}
                  style={{
                    border: "none",
                    padding: 0,
                    background: "var(--card)",
                  }}
                >
                  {url.startsWith("http") ? (
                    <img
                      src={url}
                      alt={`View ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl flex items-center justify-center w-full h-full">
                      {url}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-md">
              {product.condition}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
              {categoryName}
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md ${qualityInfo.color}`}
            >
              {qualityInfo.label}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-2">
            {product.name}
          </h1>

          {/* Rating summary */}
          {(product.averageRating > 0 || avgRating > 0) && (
            <div className="flex items-center gap-2 mb-3">
              <StarDisplay rating={avgRating || product.averageRating} />
              <span className="text-sm text-muted-foreground">
                {avgRating || product.averageRating} · {reviews.length || product.reviewCount}{" "}
                review{(reviews.length || product.reviewCount) !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <p className="text-muted-foreground text-sm mb-4">
            {product.description}
          </p>

          {/* Price Breakdown */}
          <div className="bg-card rounded-2xl ring-1 ring-border p-4 mb-6 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Seller price</span>
              <span>₹{product.sellerPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Platform fee ({product.commissionPercent}%)
              </span>
              <span className="text-primary">
                + ₹{product.commissionAmount}
              </span>
            </div>
            <div className="border-t border-border pt-1.5 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-bold">
                ₹{product.price}
              </span>
            </div>
            {product.originalPrice &&
              product.originalPrice > product.price && (
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>MRP</span>
                  <span className="line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-primary font-semibold">
                    {discount}% off
                  </span>
                </div>
              )}
          </div>

          <div className="space-y-2 mb-6 text-sm text-muted-foreground">
            <div>📍 {product.college}</div>
            <div>
              👤 Sold by{" "}
              <span className="font-semibold text-foreground">
                {sellerName}
              </span>
            </div>
            <div>
              📦 Stock:{" "}
              <span className="font-semibold text-foreground">
                {product.stock} unit{product.stock !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0 || !isAuthenticated}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: "none" }}
            >
              {!isAuthenticated
                ? "Sign In to Buy"
                : product.stock === 0
                ? "Out of Stock"
                : added
                ? "✓ Added to Cart"
                : adding
                ? "Adding..."
                : "Add to Cart"}
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <button
                onClick={toggleWishlist}
                className={`p-3.5 rounded-full ring-1 transition-all cursor-pointer ${
                  wishlisted
                    ? "ring-primary bg-primary/10 text-primary"
                    : "ring-border hover:ring-primary/30"
                }`}
                style={{ border: "none", background: wishlisted ? undefined : "none", color: wishlisted ? undefined : "var(--foreground)" }}
                title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={wishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            )}

            <button
              onClick={() => router.push("/campus-cart/cart")}
              className="px-6 py-3.5 rounded-full text-sm font-semibold ring-1 ring-border hover:bg-card transition-colors cursor-pointer"
              style={{
                border: "none",
                background: "none",
                color: "var(--foreground)",
              }}
            >
              View Cart
            </button>
          </div>
        </div>
      </div>

      {/* ─── Reviews Section ─── */}
      <div className="mt-16 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">
            Reviews{" "}
            {reviews.length > 0 && (
              <span className="text-muted-foreground text-lg">
                ({reviews.length})
              </span>
            )}
          </h2>
          {isAuthenticated && !userHasReviewed && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
              style={{ border: "none" }}
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={submitReview}
            className="bg-card rounded-2xl ring-1 ring-border p-6 mb-6"
          >
            <h3 className="font-semibold mb-4">Your Review</h3>
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="text-2xl cursor-pointer transition-transform hover:scale-110"
                    style={{
                      border: "none",
                      background: "none",
                      color: star <= reviewRating ? "#F59E0B" : "var(--border)",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Comment
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                style={{ fontFamily: "inherit", color: "var(--foreground)" }}
                placeholder="Share your experience with this product..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all cursor-pointer disabled:opacity-40"
                style={{ border: "none" }}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold ring-1 ring-border hover:bg-card transition-colors cursor-pointer"
                style={{ border: "none", background: "none", color: "var(--foreground)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl ring-1 ring-border">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-muted-foreground text-sm">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-card rounded-2xl ring-1 ring-border p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {review.user?.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      review.user?.name?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-sm">
                      {review.user?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <StarDisplay rating={review.rating} size={12} />
                {review.comment && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
}
