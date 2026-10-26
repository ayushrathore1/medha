import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Note from "@/lib/models/Note";
import User from "@/lib/models/User";
import Notification from "@/lib/models/Notification";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/notes/[noteId] — Get a single note by ID */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { noteId } = await params;

    let note = await Note.findOne({ _id: noteId, owner: auth.user.userId })
      .populate("owner", "name email").populate("subject", "name");
    if (!note) {
      note = await Note.findOne({ _id: noteId, isPublic: true })
        .populate("owner", "name email").populate("subject", "name");
    }
    if (!note) return apiError("Note not found.", 404);
    return apiResponse(note);
  } catch (err) {
    console.error("[NOTE GET BY ID]", err);
    return apiError("Error fetching note.", 500);
  }
}

/** PUT /api/notes/[noteId] — Update a note */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { noteId } = await params;
    const { title, content, subject, subjectTag, isPublic } = (await req.json()) as {
      title?: string; content?: string; subject?: string; subjectTag?: string; isPublic?: boolean;
    };

    if (!title?.trim()) return apiError("Title is required.", 400);
    if (!content?.trim()) return apiError("Content is required.", 400);
    if (!subject && !subjectTag) return apiError("Subject or subject tag is required.", 400);

    const updateData: Record<string, unknown> = {
      title: title.trim(), content: content.trim(), extractedText: content.trim(),
    };
    if (subjectTag) { updateData.subjectTag = subjectTag.trim(); updateData.subject = null; }
    else if (subject) updateData.subject = subject;
    if (typeof isPublic === "boolean") updateData.isPublic = isPublic;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, owner: auth.user.userId }, updateData,
      { new: true, runValidators: true }
    ).populate("owner", "name email");

    if (!updatedNote) return apiError("Note not found or you don't have permission.", 404);
    return apiResponse({ message: "Note updated successfully!", note: updatedNote });
  } catch (err) {
    console.error("[NOTE UPDATE]", err);
    return apiError("Error updating note.", 500);
  }
}

/** DELETE /api/notes/[noteId] — Delete a note */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { noteId } = await params;
    const note = await Note.findOneAndDelete({ _id: noteId, owner: auth.user.userId });
    if (!note) return apiError("Note not found.", 404);
    return apiResponse({ message: "Note deleted successfully." });
  } catch (err) {
    console.error("[NOTE DELETE]", err);
    return apiError("Error deleting note.", 500);
  }
}

/** PATCH /api/notes/[noteId] — Toggle like or visibility */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { noteId } = await params;
    const { action } = (await req.json()) as { action: "like" | "visibility" };
    const userId = auth.user.userId;

    if (action === "visibility") {
      const note = await Note.findOne({ _id: noteId, owner: userId });
      if (!note) return apiError("Note not found.", 404);
      note.isPublic = !note.isPublic;
      await note.save();
      return apiResponse({ message: `Note is now ${note.isPublic ? "public" : "private"}`, note });
    }

    if (action === "like") {
      const note = await Note.findById(noteId).populate("owner", "name");
      if (!note) return apiError("Note not found.", 404);

      const isLiked = note.likes.some((id) => id.toString() === userId);
      if (isLiked) {
        await Note.findByIdAndUpdate(noteId, { $pull: { likes: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { likedNotes: noteId } });
        return apiResponse({ success: true, isLiked: false, likesCount: note.likes.length - 1 });
      } else {
        await Note.findByIdAndUpdate(noteId, { $addToSet: { likes: userId } });
        await User.findByIdAndUpdate(userId, { $addToSet: { likedNotes: noteId } });

        if (note.owner && note.owner._id.toString() !== userId) {
          const liker = await User.findById(userId).select("name");
          await Notification.create({
            recipient: note.owner._id, type: "like", title: "New Like",
            message: `${liker?.name || "Someone"} liked your note "${note.title}"`,
            link: `/notes?view=${note._id}`, sender: userId,
          });
        }
        return apiResponse({ success: true, isLiked: true, likesCount: note.likes.length + 1 });
      }
    }

    return apiError("Invalid action.", 400);
  } catch (err) {
    console.error("[NOTE PATCH]", err);
    return apiError("Error processing note action.", 500);
  }
}
