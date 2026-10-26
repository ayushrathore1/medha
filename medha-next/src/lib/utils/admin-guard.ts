import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { requireAuth, apiError } from "@/lib/utils/api-helpers";

export async function requireAdmin(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth;

  await connectDB();
  const user = await User.findById(auth.user.userId).select("isAdmin role email");

  if (!user || !user.isAdmin) {
    return { error: apiError("Not authorized.", 403) };
  }

  return auth;
}