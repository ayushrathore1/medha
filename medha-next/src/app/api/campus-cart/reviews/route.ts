import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { requireAuth, getAuthUser, apiResponse, apiError } from "@/lib/utils/api-helpers";

/**
 * GET /api/campus-cart/reviews?product=<id>
 * Fetch reviews for a product
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product");

    if (!productId) return apiError("Product ID is required.", 400);

    const reviews = await Review.find({ product: productId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate average rating
    const total = reviews.length;
    const avgRating =
      total > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    // Check if current user has reviewed
    const authUser = getAuthUser(req);
    let userReview = null;
    if (authUser) {
      userReview = reviews.find(
        (r) => r.user?._id?.toString() === authUser.userId
      );
    }

    return apiResponse({
      reviews,
      total,
      averageRating: Math.round(avgRating * 10) / 10,
      userHasReviewed: !!userReview,
    });
  } catch (err) {
    console.error("Get Reviews Error:", err);
    return apiError("Error fetching reviews.", 500);
  }
}

/**
 * POST /api/campus-cart/reviews
 * Create a review (must have purchased the product)
 */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as {
      product: string;
      rating: number;
      comment?: string;
      images?: string[];
    };

    if (!body.product || !body.rating) {
      return apiError("Product ID and rating are required.", 400);
    }

    if (body.rating < 1 || body.rating > 5) {
      return apiError("Rating must be between 1 and 5.", 400);
    }

    // Verify the user has purchased this product
    const order = await Order.findOne({
      user: auth.user.userId,
      "items.product": body.product,
      status: { $in: ["confirmed", "shipped", "delivered"] },
    });

    if (!order) {
      return apiError("You can only review products you have purchased.", 403);
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      user: auth.user.userId,
      product: body.product,
    });

    if (existingReview) {
      return apiError("You have already reviewed this product.", 409);
    }

    const review = await Review.create({
      user: auth.user.userId,
      product: body.product,
      order: order._id,
      rating: body.rating,
      comment: body.comment || "",
      images: body.images || [],
    });

    // Update product's average rating
    const allReviews = await Review.find({ product: body.product });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(body.product, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    await review.populate("user", "name avatar");

    return apiResponse({ review }, 201);
  } catch (err) {
    console.error("Create Review Error:", err);
    return apiError("Error creating review.", 500);
  }
}
