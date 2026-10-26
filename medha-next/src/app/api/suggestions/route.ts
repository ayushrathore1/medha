import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Suggestion from "@/lib/models/Suggestion";
import { apiResponse, apiError, checkRateLimit } from "@/lib/utils/api-helpers";

/** POST /api/suggestions — Submit a suggestion (no auth required) */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`suggestion:${ip}`, 3, 300_000)) {
    return apiError("Too many suggestions. Wait 5 minutes.", 429);
  }

  try {
    await connectDB();
    const { message, emoji } = (await req.json()) as { message: string; emoji?: string };
    if (!message?.trim()) return apiError("Message is required", 400);

    const suggestion = await Suggestion.create({
      message: message.trim(),
      emoji: emoji || null,
      userAgent: req.headers.get("user-agent") || undefined,
      ip,
    });
    return apiResponse({ message: "Thank you for your feedback!", suggestion }, 201);
  } catch { return apiError("Error submitting suggestion", 500); }
}

/** GET /api/suggestions — Get all suggestions (admin only would be enforced in middleware) */
export async function GET() {
  try {
    await connectDB();
    const suggestions = await Suggestion.find().sort({ createdAt: -1 }).limit(100);
    return apiResponse({ suggestions });
  } catch { return apiError("Error fetching suggestions", 500); }
}
