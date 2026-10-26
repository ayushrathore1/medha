import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("seller", "name avatar college");
    if (!product) return apiError("Product not found.", 404);
    return apiResponse({ product });
  } catch (err) {
    console.error("Get Product Error:", err);
    return apiError("Error fetching product.", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return apiError("Product not found.", 404);
    if (product.seller.toString() !== auth.user.userId)
      return apiError("Not authorized.", 403);

    const body = (await req.json()) as Record<string, any>;
    
    // Update fields dynamically and save to run hooks
    Object.keys(body).forEach((key) => {
      product.set(key, body[key]);
    });

    const updated = await product.save();
    return apiResponse({ product: updated });
  } catch (err) {
    console.error("Update Product Error:", err);
    return apiError("Error updating product.", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return apiError("Product not found.", 404);
    if (product.seller.toString() !== auth.user.userId)
      return apiError("Not authorized.", 403);

    await Product.findByIdAndDelete(id);
    return apiResponse({ message: "Product deleted." });
  } catch (err) {
    console.error("Delete Product Error:", err);
    return apiError("Error deleting product.", 500);
  }
}
