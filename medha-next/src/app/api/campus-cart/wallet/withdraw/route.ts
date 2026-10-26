import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Wallet from "@/lib/models/Wallet";
import WithdrawalRequest from "@/lib/models/WithdrawalRequest";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as {
      amount: number;
      bankDetails: { accountName: string; accountNumber: string; ifsc: string; upiId?: string };
    };

    if (!body.amount || body.amount <= 0) return apiError("Invalid withdrawal amount.", 400);

    const wallet = await Wallet.findOne({ user: auth.user.userId });
    if (!wallet || wallet.availableBalance < body.amount) return apiError("Insufficient wallet balance.", 400);

    const request = await WithdrawalRequest.create({
      user: auth.user.userId,
      amount: body.amount,
      bankDetails: body.bankDetails,
      status: "pending",
    });

    wallet.pendingBalance += body.amount;
    wallet.availableBalance -= body.amount;
    wallet.transactions.push({
      type: "payout",
      amount: body.amount,
      description: "Withdrawal request created",
      status: "pending",
      createdAt: new Date(),
    });
    await wallet.save();

    return apiResponse({ request, wallet });
  } catch (err) {
    console.error("Withdrawal request error:", err);
    return apiError("Failed to create withdrawal request.", 500);
  }
}