import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { filterOrderForBuyer } from "@/lib/utils/info-filter";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(_req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findOne({ _id: id, user: auth.user.userId })
      .populate("items.product");

    if (!order) return apiError("Order not found.", 404);
    return apiResponse({ order: filterOrderForBuyer(order.toObject()) });
  } catch (err) {
    console.error("Get Order Error:", err);
    return apiError("Error fetching order.", 500);
  }
}

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

    const order = await Order.findById(id);
    if (!order) return apiError("Order not found.", 404);
    if (order.user.toString() !== auth.user.userId)
      return apiError("Not authorized.", 403);

    if (status === "cancelled" && order.status === "pending") {
      order.status = "cancelled";
      order.fulfillmentStatus = "failed";
      order.refundStatus = "requested";
      await order.save();
      return apiResponse({ order });
    }

    return apiError("Cannot update order status.", 400);
  } catch (err) {
    console.error("Update Order Error:", err);
    return apiError("Error updating order.", 500);
  }
}
