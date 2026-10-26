import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Cart from "@/lib/models/Cart";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Payment from "@/lib/models/Payment";
import { holdInEscrow } from "@/lib/services/escrow";
import { createShipment } from "@/lib/services/fulfillment";
import { notify } from "@/lib/services/notification-service";
import { verifyRazorpaySignature } from "@/lib/services/razorpay";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MCC-${ts}-${rand}`;
}

/**
 * POST /api/campus-cart/payment/verify
 * Verifies Razorpay payment signature, creates the order, decrements stock, clears cart
 */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();

    const body = (await req.json()) as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      shippingAddress: {
        fullName: string;
        phone: string;
        college: string;
        hostel?: string;
        room?: string;
        landmark?: string;
      };
      orderNotes?: string;
    };

    // Validate required fields
    if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
      return apiError("Payment verification data is incomplete.", 400);
    }

    if (!body.shippingAddress?.fullName || !body.shippingAddress?.phone || !body.shippingAddress?.college) {
      return apiError("Shipping address is incomplete.", 400);
    }

    // Check for duplicate order (idempotency)
    const existingOrder = await Order.findOne({ razorpayOrderId: body.razorpay_order_id });
    if (existingOrder) {
      return apiResponse({ order: existingOrder, message: "Order already processed." });
    }

    // Verify Razorpay signature
    const isValid = verifyRazorpaySignature({
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_signature: body.razorpay_signature,
    });

    if (!isValid) {
      return apiError("Payment verification failed. Invalid signature.", 400);
    }

    // Fetch cart and create order
    const cart = await Cart.findOne({ user: auth.user.userId }).populate<{
      items: Array<{
        product: {
          _id: string;
          price: number;
          sellerPrice: number;
          stock: number;
          seller: string;
          commissionAmount: number;
        };
        quantity: number;
      }>;
    }>("items.product");

    if (!cart || cart.items.length === 0) {
      return apiError("Cart is empty.", 400);
    }

    const orderItems = [];
    let totalAmount = 0;
    const sellerPayoutsMap = new Map<string, number>();

    for (const item of cart.items) {
      const product = item.product;
      if (!product) continue;

      // Check stock
      if (typeof product.stock === "number" && product.stock < item.quantity) {
        return apiError(`Insufficient stock for product.`, 400);
      }

      const price = product.price;
      const sellerEarning = product.sellerPrice * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price,
        seller: product.seller,
        sellerEarning,
      });
      totalAmount += price * item.quantity;

      // Aggregate seller payouts
      const sellerId = product.seller.toString();
      sellerPayoutsMap.set(sellerId, (sellerPayoutsMap.get(sellerId) || 0) + sellerEarning);

      // Decrement stock
      if (typeof product.stock === "number") {
        await Product.findByIdAndUpdate(product._id, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // Build seller payouts array
    const sellerPayouts = Array.from(sellerPayoutsMap.entries()).map(([seller, amount]) => ({
      seller,
      amount,
      status: "pending" as const,
    }));

    const order = await Order.create({
      user: auth.user.userId,
      sellerId: orderItems[0]?.seller,
      items: orderItems,
      totalAmount,
      status: "confirmed",
      fulfillmentStatus: "pending",
      shippingAddress: body.shippingAddress,
      paymentMethod: "online",
      paymentStatus: "paid",
      razorpayOrderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      razorpaySignature: body.razorpay_signature,
      paidAt: new Date(),
      orderNotes: body.orderNotes || "",
      orderNumber: generateOrderNumber(),
      sellerPayouts,
      isDisputed: false,
      refundStatus: "none",
    });

    await Payment.findOneAndUpdate(
      { order: order._id },
      {
        order: order._id,
        razorpayOrderId: body.razorpay_order_id,
        razorpayPaymentId: body.razorpay_payment_id,
        amount: totalAmount,
        status: "paid",
        escrowStatus: "held",
      },
      { upsert: true, new: true }
    );

    await holdInEscrow(
      order._id.toString(),
      totalAmount,
      body.razorpay_order_id,
      body.razorpay_payment_id
    );

    await createShipment(order._id.toString());

    const sellerIds = Array.from(new Set(orderItems.map((item) => item.seller?.toString()).filter(Boolean))) as string[];
    await Promise.all([
      notify(auth.user.userId, {
        type: "success",
        title: "Payment confirmed",
        message: `Your payment for order ${order.orderNumber} is now held in escrow.`,
        category: "payment",
        priority: "high",
        actionUrl: "/campus-cart/orders",
        data: { orderId: order._id.toString(), orderNumber: order.orderNumber },
      }),
      ...sellerIds.map((sellerId) =>
        notify(sellerId, {
          type: "message",
          title: "Order confirmed",
          message: `Order ${order.orderNumber} is confirmed and queued for pickup.`,
          category: "delivery",
          priority: "high",
          actionUrl: "/campus-cart/dashboard",
          data: { orderId: order._id.toString(), orderNumber: order.orderNumber },
        })
      ),
    ]);

    // Clear cart
    cart.items = [];
    await cart.save();

    return apiResponse({ order }, 201);
  } catch (err) {
    console.error("Payment Verify Error:", err);
    return apiError("Error verifying payment.", 500);
  }
}
