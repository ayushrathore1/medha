import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { notify } from "@/lib/services/notification-service";
import { requireAdmin } from "@/lib/utils/admin-guard";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const users = await User.find()
      .select("name email college role isVerifiedStudent sellerVerified isAdmin createdAt")
      .sort({ createdAt: -1 })
      .limit(200);

    return apiResponse({ users });
  } catch (err) {
    console.error("Admin users fetch error:", err);
    return apiError("Failed to fetch users.", 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as {
      userId: string;
      isVerifiedStudent?: boolean;
      sellerVerified?: boolean;
      isAdmin?: boolean;
      role?: "user" | "team" | "admin" | "buyer" | "seller";
    };

    const user = await User.findById(body.userId);
    if (!user) return apiError("User not found.", 404);

    if (typeof body.isVerifiedStudent === "boolean") user.isVerifiedStudent = body.isVerifiedStudent;
    if (typeof body.sellerVerified === "boolean") user.sellerVerified = body.sellerVerified;
    if (typeof body.isAdmin === "boolean") user.isAdmin = body.isAdmin;
    if (body.role) user.role = body.role;

    if (user.isAdmin) user.role = "admin";
    await user.save();

    await notify(user._id.toString(), {
      type: "info",
      title: "Verification updated",
      message: "Your account verification status has been updated by admin.",
      category: "system",
      priority: "normal",
      actionUrl: "/profile",
      data: { userId: user._id.toString(), isVerifiedStudent: user.isVerifiedStudent, sellerVerified: user.sellerVerified },
    });

    return apiResponse({ user });
  } catch (err) {
    console.error("Admin users update error:", err);
    return apiError("Failed to update user.", 500);
  }
}