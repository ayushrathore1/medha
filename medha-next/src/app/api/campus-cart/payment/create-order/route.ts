import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Cart from "@/lib/models/Cart";
import { createRazorpayOrder, RAZORPAY_KEY_ID } from "@/lib/services/razorpay";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/**
 * POST /api/campus-cart/payment/create-order
 * Creates a Razorpay order from the user's cart contents
 */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();

    // Fetch user's cart with populated products
    const cart = await Cart.findOne({ user: auth.user.userId }).populate<{
      items: Array<{
        product: { _id: string; price: number; stock: number; name: string; seller: string; sellerPrice: number };
        quantity: number;
      }>;
    }>("items.product");

    if (!cart || cart.items.length === 0) {
      return apiError("Cart is empty.", 400);
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    const validItems = [];

    for (const item of cart.items) {
      if (!item.product) continue;

      if (typeof item.product.stock === "number" && item.product.stock < item.quantity) {
        return apiError(`Insufficient stock for "${item.product.name}".`, 400);
      }

      totalAmount += item.product.price * item.quantity;
      validItems.push(item);
    }

    if (validItems.length === 0) {
      return apiError("No valid items in cart.", 400);
    }

    // Create Razorpay order (amount in paisa)
    const razorpayOrder = await createRazorpayOrder({
      amount: Math.round(totalAmount * 100),
      receipt: `cart_${auth.user.userId}_${Date.now()}`,
      notes: {
        userId: auth.user.userId,
        itemCount: String(validItems.length),
      },
    });

    return apiResponse({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: RAZORPAY_KEY_ID,
      totalAmount,
    });
  } catch (err) {
    console.error("Create Payment Order Error:", err);
    return apiError("Error creating payment order.", 500);
  }
}
