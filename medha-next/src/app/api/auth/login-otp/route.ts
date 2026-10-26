import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Otp from "@/lib/models/Otp";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";
import { generateToken } from "@/lib/utils/auth";

/** POST /api/auth/login-otp — Verify OTP and login */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, code } = (await req.json()) as { email: string; code: string };
    if (!email || !code) return apiError("Email and code are required", 400);

    const otp = await Otp.findOne({
      email: email.toLowerCase(), code,
      expiresAt: { $gt: new Date() },
    });
    if (!otp) return apiError("Invalid or expired code", 400);

    const user = await User.findOne({ email: email.toLowerCase() }).select("-password");
    if (!user) return apiError("User not found", 404);

    await Otp.deleteMany({ email: email.toLowerCase() });

    const token = generateToken({ userId: user._id.toString(), email: user.email });
    return apiResponse({ token, user, message: "Login successful" });
  } catch (err) {
    console.error("[LOGIN OTP]", err);
    return apiError("Verification failed", 500);
  }
}
