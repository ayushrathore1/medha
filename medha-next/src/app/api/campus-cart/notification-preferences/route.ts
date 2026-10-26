import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import UserPreferences from "@/lib/models/UserPreferences";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const preferences = await UserPreferences.findOne({ user: auth.user.userId });
    return apiResponse({ preferences });
  } catch (err) {
    console.error("Preferences fetch error:", err);
    return apiError("Failed to fetch notification preferences.", 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as Record<string, unknown>;
    const preferences = await UserPreferences.findOneAndUpdate(
      { user: auth.user.userId },
      { $set: { ...body, user: auth.user.userId } },
      { upsert: true, new: true }
    );
    return apiResponse({ preferences });
  } catch (err) {
    console.error("Preferences update error:", err);
    return apiError("Failed to update notification preferences.", 500);
  }
}