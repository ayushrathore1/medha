import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Payment from "@/lib/models/Payment";
import { notify } from "@/lib/services/notification-service";
import { requireAdmin } from "@/lib/utils/admin-guard";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const disputes = await Order.find({ isDisputed: true })
      .populate("user items.product items.seller")
      .sort({ updatedAt: -1 })
      .limit(200);

    return apiResponse({ disputes });
  } catch (err) {
    console.error("Admin disputes fetch error:", err);
    return apiError("Failed to fetch disputes.", 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as {
      orderId: string;
      action: "resolve" | "refund" | "keep-open";
      note?: string;
    };

    const order = await Order.findById(body.orderId).select("user orderNumber isDisputed disputeReason refundStatus paymentStatus");
    if (!order) return apiError("Order not found.", 404);

    if (body.action === "resolve") {
      order.isDisputed = false;
      order.disputeReason = body.note || order.disputeReason || "Resolved by admin";
      order.refundStatus = "none";
    }

    if (body.action === "refund") {
      order.isDisputed = false;
      order.disputeReason = body.note || order.disputeReason || "Refunded by admin";
      order.refundStatus = "completed";
      order.paymentStatus = "refunded";
      const payment = await Payment.findOne({ order: order._id });
      if (payment) {
        payment.escrowStatus = "refunded";
        payment.status = "refunded";
        payment.refundReason = body.note || payment.refundReason || "Refund approved by admin";
        payment.refundAmount = payment.amount;
        await payment.save();
      }
    }

    if (body.action === "keep-open") {
      order.isDisputed = true;
      order.disputeReason = body.note || order.disputeReason || "Under review";
      order.refundStatus = "requested";
    }

    await order.save();

    await notify(order.user.toString(), {
      type: "system",
      title: "Dispute updated",
      message: `Your order ${order.orderNumber} dispute was ${body.action}.`,
      category: "system",
      priority: body.action === "refund" ? "high" : "normal",
      actionUrl: `/campus-cart/order/${order._id}`,
      data: { orderId: order._id.toString(), action: body.action },
    });

    return apiResponse({ order });
  } catch (err) {
    console.error("Admin disputes update error:", err);
    return apiError("Failed to update dispute.", 500);
  }
}