import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Note from "@/lib/models/Note";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/notes — List user's own notes (optionally filtered by subject) */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");

    const filter: Record<string, unknown> = { owner: auth.user.userId };
    if (subject) {
      if (!mongoose.Types.ObjectId.isValid(subject)) {
        return apiError("Invalid subject ID format.", 400);
      }
      filter.subject = subject;
    }

    const notes = await Note.find(filter)
      .populate("owner", "name email")
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    return apiResponse({ notes });
  } catch (err) {
    console.error("[NOTES GET]", err);
    return apiError("Error fetching notes.", 500);
  }
}

/** POST /api/notes — Create a text note */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { title, content, subject, subjectTag, isPublic, semester, noteType } =
      (await req.json()) as {
        title?: string;
        content?: string;
        subject?: string;
        subjectTag?: string;
        isPublic?: boolean;
        semester?: string;
        noteType?: string;
      };

    if (!title?.trim()) return apiError("Title is required.", 400);
    if (!content?.trim()) return apiError("Content is required.", 400);
    if (!subject && !subjectTag) return apiError("Subject or subject tag is required.", 400);

    const noteData: Record<string, unknown> = {
      title: title.trim(),
      content: content.trim(),
      owner: auth.user.userId,
      fileUrl: null,
      fileType: null,
      originalName: null,
      extractedText: content.trim(),
      isPublic: isPublic || false,
    };

    if (semester) noteData.semester = semester.trim();
    if (noteType) noteData.noteType = noteType.trim();
    if (subjectTag) noteData.subjectTag = subjectTag.trim();
    else if (subject) noteData.subject = subject;

    const note = await Note.create(noteData);
    await note.populate("owner", "name email");

    return apiResponse({ message: "Text note created successfully!", note }, 201);
  } catch (err) {
    console.error("[NOTES POST]", err);
    return apiError("Error creating note.", 500);
  }
}
