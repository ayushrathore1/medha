import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Otp from "@/lib/models/Otp";
import { apiResponse, apiError, checkRateLimit } from "@/lib/utils/api-helpers";
import { generateToken } from "@/lib/utils/auth";

/** POST /api/auth/send-otp — Send OTP to email */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`otp:${ip}`, 5, 300_000)) {
    return apiError("Too many OTP requests. Wait 5 minutes.", 429);
  }

  try {
    await connectDB();
    const { email, type } = (await req.json()) as { email: string; type: "login" | "verify" };
    if (!email) return apiError("Email is required", 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return apiError("No account found with this email", 404);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await Otp.deleteMany({ email: email.toLowerCase() });
    await Otp.create({ email: email.toLowerCase(), code, type: type || "login", expiresAt: expires });

    // TODO: Send OTP via email
    // In production: await sendEmail(user.email, `Your code: ${code}`)

    return apiResponse({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("[SEND OTP]", err);
    return apiError("Error sending OTP", 500);
  }
}
