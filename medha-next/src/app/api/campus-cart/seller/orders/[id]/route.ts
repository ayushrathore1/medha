import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { notify } from "@/lib/services/notification-service";
import { filterOrderForSeller } from "@/lib/utils/info-filter";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/**
 * PUT /api/campus-cart/seller/orders/[id]
 * Seller updates order status (confirm, ship, deliver)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const { status } = (await req.json()) as { status: string };

    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed"],
      confirmed: ["shipped"],
      shipped: ["delivered"],
    };

    const order = await Order.findById(id).populate("items.product", "seller");
    if (!order) return apiError("Order not found.", 404);

    // Verify seller owns at least one product in this order
    const isSellerOrder = order.items.some((item) => {
      const product = item.product as unknown as { seller: { toString: () => string } };
      return product?.seller?.toString() === auth.user.userId;
    });
    if (!isSellerOrder) return apiError("Not authorized.", 403);

    const allowed = validTransitions[order.status];
    if (!allowed || !allowed.includes(status)) {
      return apiError(
        `Cannot transition from "${order.status}" to "${status}".`,
        400
      );
    }

    order.status = status as typeof order.status;
    if (status === "confirmed") order.fulfillmentStatus = "pickup_scheduled";
    if (status === "shipped") order.fulfillmentStatus = "in_transit";
    if (status === "delivered") {
      order.fulfillmentStatus = "delivered";
      order.buyerConfirmedAt = order.buyerConfirmedAt || new Date();
    }
    await order.save();

    await notify(order.user.toString(), {
      type: status === "delivered" ? "success" : "message",
      title: `Order ${status}`,
      message: `Your order ${order.orderNumber} is now ${status}.`,
      category: "delivery",
      priority: status === "delivered" ? "high" : "normal",
      actionUrl: `/campus-cart/orders/${order._id}`,
      data: { orderId: order._id.toString(), status },
    });

    return apiResponse({ order: filterOrderForSeller(order.toObject()) });
  } catch (err) {
    console.error("Seller Update Order Error:", err);
    return apiError("Error updating order.", 500);
  }
}
