import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/lib/utils/admin-guard";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;
    const orders = await Order.find(filter).populate("user items.product items.seller sellerId").sort({ createdAt: -1 }).limit(200);
    return apiResponse({ orders });
  } catch (err) {
    console.error("Admin orders fetch error:", err);
    return apiError("Failed to fetch orders.", 500);
  }
}