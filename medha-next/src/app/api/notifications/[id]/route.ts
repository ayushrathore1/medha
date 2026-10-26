import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Notification from "@/lib/models/Notification";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** PATCH /api/notifications/[id] — Mark a single notification or all as read */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    if (id === "all") {
      await Notification.updateMany({ recipient: auth.user.userId, read: false }, { read: true });
    } else {
      await Notification.findOneAndUpdate({ _id: id, recipient: auth.user.userId }, { read: true });
    }
    return apiResponse({ success: true });
  } catch { return apiError("Failed to update notification", 500); }
}
