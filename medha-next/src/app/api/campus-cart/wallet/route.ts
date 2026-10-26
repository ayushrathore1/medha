import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Wallet from "@/lib/models/Wallet";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";
import { requireAdmin } from "@/lib/utils/admin-guard";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const wallet = await Wallet.findOne({ user: auth.user.userId });
    return apiResponse({ wallet: wallet || { availableBalance: 0, pendingBalance: 0, totalEarned: 0, totalWithdrawn: 0, transactions: [] } });
  } catch (err) {
    console.error("Wallet fetch error:", err);
    return apiError("Failed to fetch wallet.", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as { userId: string; amount: number; type: "credit" | "debit" | "refund"; description?: string };
    if (!body.userId || !body.amount || body.amount <= 0) return apiError("Invalid wallet request.", 400);

    const wallet = await Wallet.findOneAndUpdate(
      { user: body.userId },
      {
        $setOnInsert: { user: body.userId },
        $inc: {
          availableBalance: body.type === "debit" ? -body.amount : body.amount,
          totalEarned: body.type === "credit" || body.type === "refund" ? body.amount : 0,
          totalWithdrawn: body.type === "debit" ? body.amount : 0,
        },
        $push: {
          transactions: {
            type: body.type,
            amount: body.amount,
            description: body.description || "Wallet adjustment",
            status: "completed",
            createdAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    return apiResponse({ wallet });
  } catch (err) {
    console.error("Wallet update error:", err);
    return apiError("Failed to update wallet.", 500);
  }
}