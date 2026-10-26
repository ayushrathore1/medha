import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { filterOrderForSeller } from "@/lib/utils/info-filter";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/**
 * GET /api/campus-cart/seller/orders
 * Fetch all orders containing the seller's products
 */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    // Find all products by this seller
    const sellerProducts = await Product.find({ seller: auth.user.userId }).select("_id");
    const productIds = sellerProducts.map((p) => p._id);

    if (productIds.length === 0) {
      return apiResponse({ orders: [], total: 0, page, totalPages: 0 });
    }

    // Find orders containing these products
    const filter: Record<string, unknown> = {
      "items.product": { $in: productIds },
    };
    if (status && status !== "all") {
      filter.status = status;
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("items.product", "name price sellerPrice images slug")
      .populate("user", "name email avatar college")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter items in each order to only show this seller's products
    const productIdStrings = productIds.map((id) => id.toString());
    const sellerOrders = orders.map((order) => {
      const orderObj = order.toObject();
      const filtered = filterOrderForSeller(orderObj);
      if (Array.isArray(filtered.items)) {
        filtered.items = filtered.items.filter((item: Record<string, unknown>) => {
          const prod = item.product as Record<string, unknown> | string | null;
          const prodId = prod && typeof prod === "object" ? String(prod._id) : String(prod || "");
          return productIdStrings.includes(prodId);
        });
      }
      return filtered;
    });

    return apiResponse({ orders: sellerOrders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Get Seller Orders Error:", err);
    return apiError("Error fetching seller orders.", 500);
  }
}
