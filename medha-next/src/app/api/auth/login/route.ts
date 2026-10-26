import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/utils/auth";
import { apiResponse, apiError, checkRateLimit } from "@/lib/utils/api-helpers";

export async function POST(req: NextRequest) {
  // Rate limiting: 10 login attempts per minute per IP
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`login:${ip}`, 10, 60_000)) {
    return apiError("Too many login attempts. Please try again later.", 429);
  }

  try {
    await connectDB();

    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return apiError("Email and password are required", 400);
    }

    // Find user with password field included
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+password"
    );

    if (!user) {
      return apiError("Invalid email or password", 401);
    }

    if (!user.password) {
      return apiError(
        "This account uses Google sign-in. Please continue with Google.",
        401
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiError("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Return user data without password
    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    return apiResponse({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("[AUTH LOGIN]", err);
    return apiError("Server error during login", 500);
  }
}
