import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/users/profile — Get current user profile */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const user = await User.findById(auth.user.userId).select("-password");
    if (!user) return apiError("User not found.", 404);
    return apiResponse({ user });
  } catch { return apiError("Server error fetching profile.", 500); }
}

/** PUT /api/users/profile — Update current user profile */
export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { name, college, university, branch, year, gender, avatar } = (await req.json()) as {
      name?: string; college?: string; university?: string; branch?: string; year?: string; gender?: string; avatar?: string;
    };

    const updateFields: Record<string, unknown> = {};
    if (name) updateFields.name = name;
    if (college) updateFields.college = college;
    if (university) updateFields.university = university;
    if (branch) updateFields.branch = branch;
    if (year) updateFields.year = year;
    if (gender) updateFields.gender = gender;
    if (avatar) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      auth.user.userId,
      { $set: updateFields },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!user) return apiError("User not found.", 404);
    return apiResponse({ message: "Profile updated.", user });
  } catch { return apiError("Server error updating profile.", 500); }
}

/** DELETE /api/users/profile — Delete own account */
export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(auth.user.userId);
    if (!user) return apiError("User not found.", 404);
    return apiResponse({ message: "User account deleted." });
  } catch { return apiError("Error deleting account.", 500); }
}
