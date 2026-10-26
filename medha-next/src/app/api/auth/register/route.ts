import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/utils/auth";
import { apiResponse, apiError, checkRateLimit } from "@/lib/utils/api-helpers";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`register:${ip}`, 5, 60_000)) {
    return apiError("Too many registration attempts.", 429);
  }

  try {
    await connectDB();

    const { name, email, password, college, university, branch, year } =
      (await req.json()) as {
        name?: string;
        email?: string;
        password?: string;
        college?: string;
        university?: string;
        branch?: string;
        year?: string;
      };

    if (!name || !email || !password) {
      return apiError("Name, email, and password are required", 400);
    }

    if (password.length < 6) {
      return apiError("Password must be at least 6 characters", 400);
    }

    // Check for existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return apiError("User already exists with this email", 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      college: college?.trim() || "",
      university: university?.trim() || "",
      branch: branch?.trim() || "",
      year: year?.trim() || "",
    });

    // Generate JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    return apiResponse(
      { success: true, token, user: userWithoutPassword },
      201
    );
  } catch (err) {
    console.error("[AUTH REGISTER]", err);
    return apiError("Server error during registration", 500);
  }
}
