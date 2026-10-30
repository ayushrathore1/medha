import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Payment from "@/lib/models/Payment";
import Order from "@/lib/models/Order";
import { notify } from "@/lib/services/notification-service";
import { requireAdmin } from "@/lib/utils/admin-guard";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const payments = await Payment.find()
      .populate({ path: "order", populate: [{ path: "user", select: "name email college" }, { path: "items.product", select: "name images" }] })
      .sort({ createdAt: -1 })
      .limit(200);

    return apiResponse({ payments });
  } catch (err) {
    console.error("Admin payments fetch error:", err);
    return apiError("Failed to fetch payments.", 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as {
      paymentId: string;
      action: "hold" | "release" | "refund";
      refundReason?: string;
    };

    const payment = await Payment.findById(body.paymentId);
    if (!payment) return apiError("Payment not found.", 404);

    const order = await Order.findById(payment.order).select("user orderNumber sellerPayouts refundStatus");
    if (!order) return apiError("Order not found.", 404);

    if (body.action === "hold") {
      payment.escrowStatus = "held";
      payment.status = "paid";
    }

    if (body.action === "release") {
      payment.escrowStatus = "released";
      payment.escrowReleasedAt = new Date();
      payment.status = "paid";
      order.sellerPayouts = order.sellerPayouts.map((payout) => ({ ...payout, status: "paid" }));
    }

    if (body.action === "refund") {
      payment.escrowStatus = "refunded";
      payment.status = "refunded";
      payment.refundReason = body.refundReason || payment.refundReason || "Refund approved by admin";
      payment.refundAmount = payment.amount;
      order.refundStatus = "completed";
    }

    await payment.save();
    await order.save();

    await notify(order.user.toString(), {
      type: "info",
      title: "Payment updated",
      message: `Your order ${order.orderNumber} payment status changed to ${body.action}.`,
      category: "payment",
      priority: body.action === "refund" ? "high" : "normal",
      actionUrl: `/campus-cart/order/${order._id}`,
      data: { paymentId: payment._id.toString(), orderId: order._id.toString(), action: body.action },
    });

    return apiResponse({ payment });
  } catch (err) {
    console.error("Admin payments update error:", err);
    return apiError("Failed to update payment.", 500);
  }
}