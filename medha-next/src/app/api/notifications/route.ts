import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Notification from "@/lib/models/Notification";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/notifications — Get notifications for the current user */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: auth.user.userId }).sort({ createdAt: -1 }).limit(50),
      Notification.countDocuments({ recipient: auth.user.userId, read: false }),
    ]);
    return apiResponse({ notifications, unreadCount });
  } catch { return apiError("Failed to fetch notifications", 500); }
}
