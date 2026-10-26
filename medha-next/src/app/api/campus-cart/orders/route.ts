import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Cart from "@/lib/models/Cart";
import Product from "@/lib/models/Product";
import { notify } from "@/lib/services/notification-service";
import { filterOrderForBuyer } from "@/lib/utils/info-filter";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MCC-${ts}-${rand}`;
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const total = await Order.countDocuments({ user: auth.user.userId });
    const orders = await Order.find({ user: auth.user.userId })
      .populate("items.product")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return apiResponse({
      orders: orders.map((order) => filterOrderForBuyer(order.toObject())),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Get Orders Error:", err);
    return apiError("Error fetching orders.", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as {
      shippingAddress: {
        fullName: string;
        phone: string;
        college: string;
        hostel?: string;
        room?: string;
        landmark?: string;
      };
      paymentMethod: "cod" | "online";
      orderNotes?: string;
    };

    if (!body.shippingAddress?.fullName || !body.shippingAddress?.phone || !body.shippingAddress?.college)
      return apiError("Shipping address is incomplete.", 400);

    const cart = await Cart.findOne({ user: auth.user.userId }).populate<{
      items: Array<{ product: { _id: string; price: number; sellerPrice: number; stock: number; seller: string; commissionAmount: number }; quantity: number }>;
    }>("items.product");

    if (!cart || cart.items.length === 0)
      return apiError("Cart is empty.", 400);

    const orderItems = [];
    let totalAmount = 0;
    const sellerPayoutsMap = new Map<string, number>();

    for (const item of cart.items) {
      const product = item.product;
      if (!product) continue;

      if (typeof product.stock === "number" && product.stock < item.quantity)
        return apiError(`Insufficient stock for product.`, 400);

      const price = product.price;
      const sellerEarning = (product.sellerPrice || price) * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price,
        seller: product.seller,
        sellerEarning,
      });
      totalAmount += price * item.quantity;

      // Aggregate seller payouts
      const sellerId = product.seller?.toString() || "unknown";
      sellerPayoutsMap.set(sellerId, (sellerPayoutsMap.get(sellerId) || 0) + sellerEarning);

      if (typeof product.stock === "number") {
        await Product.findByIdAndUpdate(product._id, {
          $inc: { stock: -item.quantity },
        });
      }
    }

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
      status: "pending",
      fulfillmentStatus: "pending",
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod || "cod",
      paymentStatus: body.paymentMethod === "cod" ? "pending" : "pending",
      orderNotes: body.orderNotes || "",
      orderNumber: generateOrderNumber(),
      sellerPayouts,
      isDisputed: false,
      refundStatus: "none",
    });

    const sellerIds = Array.from(new Set(orderItems.map((item) => item.seller?.toString()).filter(Boolean))) as string[];
    await Promise.all(
      sellerIds.map((sellerId) =>
        notify(sellerId, {
          type: "message",
          title: "New order received",
          message: `Order ${order.orderNumber} was placed and is waiting for fulfillment.`,
          category: "order",
          priority: "high",
          actionUrl: "/campus-cart/dashboard",
          data: { orderId: order._id.toString(), orderNumber: order.orderNumber },
        })
      )
    );

    cart.items = [];
    await cart.save();

    return apiResponse({ order }, 201);
  } catch (err) {
    console.error("Create Order Error:", err);
    return apiError("Error creating order.", 500);
  }
}
