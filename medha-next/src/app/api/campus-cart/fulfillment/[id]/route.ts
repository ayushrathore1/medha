import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Shipment from "@/lib/models/Shipment";
import { markDelivered, markPickedUp, schedulePickup } from "@/lib/services/fulfillment";
import { notify } from "@/lib/services/notification-service";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";
import { requireAdmin } from "@/lib/utils/admin-guard";
import Order from "@/lib/models/Order";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const body = (await req.json()) as { status?: string; note?: string; proofUrl?: string; agentId?: string };
    const shipment = await Shipment.findById(id);
    if (!shipment) return apiError("Shipment not found.", 404);

    let updated = shipment;
    if (body.status === "pickup_scheduled") updated = await schedulePickup(id, body.agentId);
    else if (body.status === "picked_up") updated = await markPickedUp(id, body.note);
    else if (body.status === "delivered") updated = await markDelivered(id, body.note, body.proofUrl);
    else {
      shipment.status = body.status as typeof shipment.status;
      shipment.trackingEvents.push({ status: shipment.status, timestamp: new Date(), note: body.note || "Status updated" });
      updated = await shipment.save();
    }

    const order = await Order.findById(shipment.order).select("user orderNumber");
    if (order) {
      await notify(order.user.toString(), {
        type: body.status === "delivered" ? "success" : "message",
        title: `Shipment ${body.status}`,
        message: `Your order ${order.orderNumber} is now ${body.status}.`,
        category: "delivery",
        priority: body.status === "delivered" ? "high" : "normal",
        actionUrl: `/campus-cart/fulfillment/tracking/${order._id}`,
        data: { orderId: order._id.toString(), shipmentId: id, status: body.status },
      });
    }

    return apiResponse({ shipment: updated });
  } catch (err) {
    console.error("Update shipment error:", err);
    return apiError("Failed to update shipment.", 500);
  }
}