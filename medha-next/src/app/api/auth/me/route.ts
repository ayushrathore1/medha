import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const user = await User.findById(auth.user.userId);
    if (!user) return apiError("User not found", 404);

    return apiResponse({ success: true, user });
  } catch (err) {
    console.error("[AUTH ME]", err);
    return apiError("Server error", 500);
  }
}
