import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Payment from "@/lib/models/Payment";
import Wallet from "@/lib/models/Wallet";

function getCommission(amount: number) {
  return Math.round(amount * 0.06 * 100) / 100;
}

export async function holdInEscrow(orderId: string, amount: number, razorpayOrderId: string, razorpayPaymentId: string) {
  await connectDB();
  return Payment.findOneAndUpdate(
    { order: orderId },
    {
      order: orderId,
      amount,
      razorpayOrderId,
      razorpayPaymentId,
      status: "paid",
      escrowStatus: "held",
    },
    { upsert: true, new: true }
  );
}

export async function releaseFromEscrow(orderId: string) {
  await connectDB();
  const order = await Order.findById(orderId);
  if (!order) return null;

  const payment = await Payment.findOne({ order: orderId });
  if (!payment || payment.escrowStatus === "released") return payment;

  const grouped = new Map<string, number>();
  for (const item of order.items) {
    const sellerId = item.seller?.toString?.() || order.sellerId?.toString?.() || "";
    if (!sellerId) continue;
    grouped.set(sellerId, (grouped.get(sellerId) || 0) + Number(item.sellerEarning || 0));
  }

  for (const [sellerId, rawAmount] of grouped.entries()) {
    const net = Math.max(rawAmount - getCommission(rawAmount), 0);
    await Wallet.findOneAndUpdate(
      { user: sellerId },
      {
        $setOnInsert: { user: sellerId },
        $inc: { availableBalance: net, totalEarned: net },
        $push: {
          transactions: {
            type: "credit",
            amount: net,
            description: `Escrow release for order ${order.orderNumber}`,
            orderId: order._id,
            status: "completed",
            createdAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );
  }

  payment.escrowStatus = "released";
  payment.escrowReleasedAt = new Date();
  await payment.save();
  return payment;
}

export async function refundFromEscrow(orderId: string, reason: string, amount?: number) {
  await connectDB();
  const payment = await Payment.findOne({ order: orderId });
  if (!payment) return null;

  payment.escrowStatus = "refunded";
  payment.refundReason = reason;
  payment.refundAmount = amount ?? payment.amount;
  payment.refundId = payment.refundId || `rf_${Date.now()}`;
  await payment.save();

  const order = await Order.findById(orderId);
  if (order) {
    order.refundStatus = "completed";
    order.paymentStatus = "refunded";
    await order.save();
  }

  return payment;
}