import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Note from "@/lib/models/Note";
import mongoose from "mongoose";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/notes/public — Get all public notes with search/filters */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const subject = searchParams.get("subject");
    const semester = searchParams.get("semester");
    const noteType = searchParams.get("noteType");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [
      { $match: { isPublic: true } },
      { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "ownerData" } },
      { $unwind: { path: "$ownerData", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "subjects", localField: "subject", foreignField: "_id", as: "subjectData" } },
      { $unwind: { path: "$subjectData", preserveNullAndEmptyArrays: true } },
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
            { subjectTag: { $regex: search, $options: "i" } },
            { "ownerData.name": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    if (subject) pipeline.push({ $match: { subject: new mongoose.Types.ObjectId(subject) } });
    if (semester) pipeline.push({ $match: { semester } });
    if (noteType) pipeline.push({ $match: { noteType: { $regex: new RegExp(noteType, "i") } } });

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
      {
        $project: {
          _id: 1, title: 1, content: 1, subjectTag: 1, fileUrl: 1, fileType: 1,
          originalName: 1, extractedText: 1, likes: 1, isPublic: 1, createdAt: 1, semester: 1, noteType: 1,
          owner: { _id: "$ownerData._id", name: "$ownerData.name", email: "$ownerData.email", avatar: "$ownerData.avatar" },
          subject: { _id: "$subjectData._id", name: "$subjectData.name" },
        },
      }
    );

    const notes = await Note.aggregate(pipeline);
    return apiResponse({ notes });
  } catch (err) {
    console.error("[PUBLIC NOTES]", err);
    return apiError("Error fetching public notes.", 500);
  }
}
