import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Subject from "@/lib/models/Subject";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/subjects — Get all subjects for the logged-in user */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const subjects = await Subject.find({ user: auth.user.userId }).sort({ name: 1 });
    return apiResponse({ subjects });
  } catch (err) {
    console.error("Get Subjects Error:", err);
    return apiError("Error fetching subjects.", 500);
  }
}

/** POST /api/subjects — Add a new subject */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { name } = (await req.json()) as { name?: string };
    if (!name) return apiError("Subject name is required.", 400);

    const existing = await Subject.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      user: auth.user.userId,
    });
    if (existing) return apiError("Subject already exists.", 409);

    const subject = await Subject.create({ name, user: auth.user.userId });
    return apiResponse({ message: "Subject added.", subject }, 201);
  } catch (err) {
    console.error("Create Subject Error:", err);
    return apiError("Error adding subject.", 500);
  }
}
