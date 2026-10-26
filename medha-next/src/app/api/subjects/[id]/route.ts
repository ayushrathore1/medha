import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Subject from "@/lib/models/Subject";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** PUT /api/subjects/[id] — Update a subject */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const { name } = (await req.json()) as { name?: string };
    if (!name) return apiError("Subject name is required.", 400);

    const exists = await Subject.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      user: auth.user.userId,
      _id: { $ne: id },
    });
    if (exists) return apiError("Subject name already in use.", 409);

    const updated = await Subject.findOneAndUpdate(
      { _id: id, user: auth.user.userId },
      { name },
      { new: true }
    );
    if (!updated) return apiError("Subject not found.", 404);
    return apiResponse({ message: "Subject updated.", subject: updated });
  } catch (err) {
    console.error("Update Subject Error:", err);
    return apiError("Error updating subject.", 500);
  }
}

/** DELETE /api/subjects/[id] — Delete a subject */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Subject.findOneAndDelete({ _id: id, user: auth.user.userId });
    if (!deleted) return apiError("Subject not found.", 404);
    return apiResponse({ message: "Subject deleted." });
  } catch (err) {
    console.error("Delete Subject Error:", err);
    return apiError("Error deleting subject.", 500);
  }
}
