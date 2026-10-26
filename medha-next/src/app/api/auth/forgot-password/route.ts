import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Otp from "@/lib/models/Otp";
import PasswordResetToken from "@/lib/models/PasswordResetToken";
import { apiResponse, apiError, checkRateLimit } from "@/lib/utils/api-helpers";
import crypto from "crypto";

/** POST /api/auth/forgot-password — Send password reset link */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`forgot:${ip}`, 3, 300_000)) {
    return apiError("Too many requests. Wait 5 minutes.", 429);
  }

  try {
    await connectDB();
    const { email } = (await req.json()) as { email: string };
    if (!email) return apiError("Email is required", 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always return success to prevent email enumeration
    if (!user) return apiResponse({ message: "If an account exists, a reset link was sent." });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.deleteMany({ userId: user._id });
    await PasswordResetToken.create({ userId: user._id, token, expiresAt: expires });

    // TODO: Send email with reset link containing token
    // In production: await sendEmail(user.email, `${FRONTEND_URL}/reset-password?token=${token}`)

    return apiResponse({ message: "If an account exists, a reset link was sent." });
  } catch (err) {
    console.error("[FORGOT PASSWORD]", err);
    return apiError("Server error", 500);
  }
}
