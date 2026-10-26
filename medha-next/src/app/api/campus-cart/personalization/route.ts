import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import UserPreferences from "@/lib/models/UserPreferences";
import UserSyllabus from "@/lib/models/UserSyllabus";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import Notification from "@/lib/models/Notification";
import Wallet from "@/lib/models/Wallet";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const preferences = await UserPreferences.findOne({ user: auth.user.userId });
    const syllabus = await UserSyllabus.findOne({ userId: auth.user.userId }).populate("semesters.subjects");
    const wallet = await Wallet.findOne({ user: auth.user.userId });
    const unreadCount = await Notification.countDocuments({ recipient: auth.user.userId, read: false });
    const products = await Product.find({ status: "active" }).sort({ createdAt: -1 }).limit(8).populate("category", "name slug");
    const recentOrders = await Order.find({ user: auth.user.userId }).sort({ createdAt: -1 }).limit(4).select("orderNumber status totalAmount createdAt");

    return apiResponse({
      preferences,
      syllabus,
      wallet: wallet || { availableBalance: 0, pendingBalance: 0, totalEarned: 0, totalWithdrawn: 0 },
      unreadCount,
      recommendedProducts: products,
      recentOrders,
    });
  } catch (err) {
    console.error("Personalization fetch error:", err);
    return apiError("Failed to load personalization data.", 500);
  }
}