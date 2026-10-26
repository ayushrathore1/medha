import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/**
 * GET /api/campus-cart/seller/stats
 * Returns aggregated seller statistics: revenue, order counts, product counts, recent activity
 */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();

    // Get seller's products
    const products = await Product.find({ seller: auth.user.userId });
    const productIds = products.map((p) => p._id);

    const activeProducts = products.filter((p) => p.status === "active").length;
    const soldProducts = products.filter((p) => p.status === "sold").length;
    const pendingVerification = products.filter(
      (p) => p.qualityVerification === "pending" && p.status === "active"
    ).length;

    // Get orders containing seller's products
    const orders = await Order.find({
      "items.product": { $in: productIds },
    });

    let totalRevenue = 0;
    let totalOrders = orders.length;
    let pendingOrders = 0;
    let confirmedOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;

    const monthlyRevenue: Record<string, number> = {};

    for (const order of orders) {
      // Count seller's revenue from this order
      for (const item of order.items) {
        if (productIds.some((id) => id.toString() === item.product.toString())) {
          totalRevenue += item.sellerEarning || 0;
        }
      }

      // Count order statuses
      switch (order.status) {
        case "pending":
          pendingOrders++;
          break;
        case "confirmed":
          confirmedOrders++;
          break;
        case "shipped":
          shippedOrders++;
          break;
        case "delivered":
          deliveredOrders++;
          break;
      }

      // Monthly revenue for chart
      const monthKey = order.createdAt
        ? `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`
        : "unknown";
      if (!monthlyRevenue[monthKey]) monthlyRevenue[monthKey] = 0;

      for (const item of order.items) {
        if (productIds.some((id) => id.toString() === item.product.toString())) {
          monthlyRevenue[monthKey] += item.sellerEarning || 0;
        }
      }
    }

    // Convert monthly revenue to array sorted by date
    const revenueChart = Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }));

    return apiResponse({
      totalRevenue: Math.round(totalRevenue),
      totalOrders,
      activeProducts,
      soldProducts,
      pendingVerification,
      totalProducts: products.length,
      orderBreakdown: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
      },
      revenueChart,
    });
  } catch (err) {
    console.error("Seller Stats Error:", err);
    return apiError("Error fetching seller stats.", 500);
  }
}
