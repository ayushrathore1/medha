import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Wallet from "@/lib/models/Wallet";
import { requireAdmin } from "@/lib/utils/admin-guard";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const [totalOrders, revenue, pendingPayouts] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Wallet.aggregate([{ $group: { _id: null, total: { $sum: "$pendingBalance" } } }]),
    ]);

    return apiResponse({
      totalOrders,
      revenue: revenue[0]?.total || 0,
      pendingPayouts: pendingPayouts[0]?.total || 0,
    });
  } catch (err) {
    console.error("Reports fetch error:", err);
    return apiError("Failed to fetch reports.", 500);
  }
}