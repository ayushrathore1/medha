import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Shipment from "@/lib/models/Shipment";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const auth = requireAuth(_req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { orderId } = await params;
    const order = await Order.findById(orderId).select("user");
    if (!order) return apiError("Order not found.", 404);
    if (order.user.toString() !== auth.user.userId) {
      return apiError("Not authorized.", 403);
    }

    const shipment = await Shipment.findOne({ order: orderId });
    if (!shipment) return apiError("Tracking not found.", 404);
    return apiResponse({ trackingEvents: shipment.trackingEvents, status: shipment.status, estimatedDelivery: shipment.estimatedDelivery, actualDelivery: shipment.actualDelivery });
  } catch (err) {
    console.error("Get shipment tracking error:", err);
    return apiError("Failed to fetch tracking.", 500);
  }
}