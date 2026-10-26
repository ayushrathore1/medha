import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Flashcard from "@/lib/models/Flashcard";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/flashcards/[id] — Get single flashcard */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const flashcard = await Flashcard.findOne({ _id: id, owner: auth.user.userId });
    if (!flashcard) return apiError("Flashcard not found", 404);
    return apiResponse({ flashcard });
  } catch { return apiError("Could not get flashcard.", 500); }
}

/** PUT /api/flashcards/[id] — Update flashcard */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const { question, answer, subject } = (await req.json()) as { question?: string; answer?: string; subject?: string };
    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: id, owner: auth.user.userId },
      { question, answer, subject, updatedAt: Date.now() },
      { new: true }
    );
    if (!flashcard) return apiError("Flashcard not found or not owned by user", 404);
    return apiResponse({ message: "Flashcard updated.", flashcard });
  } catch { return apiError("Could not update flashcard.", 500); }
}

/** DELETE /api/flashcards/[id] — Delete flashcard */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const flashcard = await Flashcard.findOneAndDelete({ _id: id, owner: auth.user.userId });
    if (!flashcard) return apiError("Flashcard not found or not owned by user", 404);
    return apiResponse({ message: "Flashcard deleted." });
  } catch { return apiError("Could not delete flashcard.", 500); }
}

/** PATCH /api/flashcards/[id] — Update difficulty or mark viewed */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const { action, difficulty } = (await req.json()) as { action: "difficulty" | "viewed"; difficulty?: string };

    if (action === "viewed") {
      const flashcard = await Flashcard.findOneAndUpdate(
        { _id: id, owner: auth.user.userId }, { viewed: true }, { new: true }
      );
      if (!flashcard) return apiError("Flashcard not found", 404);
      return apiResponse({ message: "Marked as viewed", flashcard });
    }

    if (action === "difficulty") {
      if (!difficulty || !["easy", "medium", "hard"].includes(difficulty))
        return apiError("Invalid difficulty level", 400);
      const flashcard = await Flashcard.findOneAndUpdate(
        { _id: id, owner: auth.user.userId }, { difficulty }, { new: true }
      );
      if (!flashcard) return apiError("Flashcard not found", 404);
      return apiResponse({ message: "Difficulty updated", flashcard });
    }

    return apiError("Invalid action", 400);
  } catch { return apiError("Error updating flashcard", 500); }
}
