import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Wishlist from "@/lib/models/Wishlist";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/**
 * GET /api/campus-cart/wishlist
 * Get user's wishlist with populated product data
 */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    let wishlist = await Wishlist.findOne({ user: auth.user.userId })
      .populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: auth.user.userId, products: [] });
    }

    return apiResponse({ wishlist });
  } catch (err) {
    console.error("Get Wishlist Error:", err);
    return apiError("Error fetching wishlist.", 500);
  }
}

/**
 * POST /api/campus-cart/wishlist
 * Add a product to wishlist (toggle)
 */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { productId } = (await req.json()) as { productId: string };

    if (!productId) return apiError("Product ID is required.", 400);

    let wishlist = await Wishlist.findOne({ user: auth.user.userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: auth.user.userId, products: [] });
    }

    const idx = wishlist.products.findIndex(
      (id) => id.toString() === productId
    );

    if (idx > -1) {
      // Remove from wishlist
      wishlist.products.splice(idx, 1);
      await wishlist.save();
      return apiResponse({ wishlisted: false, message: "Removed from wishlist" });
    } else {
      // Add to wishlist
      wishlist.products.push(productId as unknown as typeof wishlist.products[0]);
      await wishlist.save();
      return apiResponse({ wishlisted: true, message: "Added to wishlist" });
    }
  } catch (err) {
    console.error("Toggle Wishlist Error:", err);
    return apiError("Error updating wishlist.", 500);
  }
}

/**
 * DELETE /api/campus-cart/wishlist
 * Remove a product from wishlist
 */
export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { productId } = (await req.json()) as { productId: string };

    if (!productId) return apiError("Product ID is required.", 400);

    const wishlist = await Wishlist.findOne({ user: auth.user.userId });
    if (!wishlist) return apiResponse({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    return apiResponse({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("Remove Wishlist Error:", err);
    return apiError("Error removing from wishlist.", 500);
  }
}
