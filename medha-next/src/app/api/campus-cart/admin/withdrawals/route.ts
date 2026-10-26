import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import WithdrawalRequest from "@/lib/models/WithdrawalRequest";
import Wallet from "@/lib/models/Wallet";
import { requireAdmin } from "@/lib/utils/admin-guard";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const requests = await WithdrawalRequest.find().sort({ createdAt: -1 }).limit(200).populate("user", "name email college");
    return apiResponse({ requests });
  } catch (err) {
    console.error("Withdrawal list error:", err);
    return apiError("Failed to fetch withdrawal requests.", 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as { requestId: string; status: "approved" | "processed" | "rejected"; adminNote?: string };
    const request = await WithdrawalRequest.findById(body.requestId);
    if (!request) return apiError("Withdrawal request not found.", 404);

    request.status = body.status;
    request.adminNote = body.adminNote || request.adminNote || "";
    if (body.status === "processed") request.processedAt = new Date();
    await request.save();

    if (body.status === "processed") {
      await Wallet.findOneAndUpdate(
        { user: request.user },
        { $inc: { pendingBalance: -request.amount, totalWithdrawn: request.amount } },
        { new: true }
      );
    }

    return apiResponse({ request });
  } catch (err) {
    console.error("Withdrawal update error:", err);
    return apiError("Failed to update withdrawal request.", 500);
  }
}