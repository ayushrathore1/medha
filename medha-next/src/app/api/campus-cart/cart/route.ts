import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Cart from "@/lib/models/Cart";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    let cart = await Cart.findOne({ user: auth.user.userId })
      .populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: auth.user.userId, items: [] });
    }

    return apiResponse({ cart });
  } catch (err) {
    console.error("Get Cart Error:", err);
    return apiError("Error fetching cart.", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { productId, quantity = 1 } = (await req.json()) as {
      productId: string;
      quantity?: number;
    };

    if (!productId) return apiError("Product ID is required.", 400);

    let cart = await Cart.findOne({ user: auth.user.userId });
    if (!cart) {
      cart = await Cart.create({ user: auth.user.userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId as unknown as typeof cart.items[0]["product"],
        quantity,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    return apiResponse({ cart });
  } catch (err) {
    console.error("Add to Cart Error:", err);
    return apiError("Error adding to cart.", 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { productId, quantity } = (await req.json()) as {
      productId: string;
      quantity: number;
    };

    if (!productId || quantity === undefined)
      return apiError("Product ID and quantity are required.", 400);

    const cart = await Cart.findOne({ user: auth.user.userId });
    if (!cart) return apiError("Cart not found.", 404);

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) return apiError("Item not in cart.", 404);

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");

    return apiResponse({ cart });
  } catch (err) {
    console.error("Update Cart Error:", err);
    return apiError("Error updating cart.", 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { productId } = (await req.json()) as { productId?: string };

    const cart = await Cart.findOne({ user: auth.user.userId });
    if (!cart) return apiError("Cart not found.", 404);

    if (productId) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      cart.items = [];
    }

    await cart.save();
    return apiResponse({ cart });
  } catch (err) {
    console.error("Remove from Cart Error:", err);
    return apiError("Error removing from cart.", 500);
  }
}
