import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Cart from "@/lib/models/Cart";
import { getAuthUser, apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const authUser = getAuthUser(req);
  if (!authUser) return apiError("No token, authorization denied", 401);

  try {
    await connectDB();
    const { itemId } = await params;

    const cart = await Cart.findOne({ user: authUser.userId });
    if (!cart) return apiError("Cart not found.", 404);

    cart.items = cart.items.filter((item) => {
      const id = (item as unknown as { _id: string })._id?.toString();
      return id !== itemId;
    });

    await cart.save();
    return apiResponse({ cart });
  } catch (err) {
    console.error("Remove Cart Item Error:", err);
    return apiError("Error removing item.", 500);
  }
}
