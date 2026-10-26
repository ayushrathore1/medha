import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import ExamAnalysis from "@/lib/models/ExamAnalysis";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/rtu/exams/[subject] — Get detailed exam analysis for a subject */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ subject: string }> }
) {
  try {
    await connectDB();
    const { subject } = await params;
    const decoded = decodeURIComponent(subject);
    const analysis = await ExamAnalysis.findOne({ subjectName: { $regex: new RegExp(`^${decoded}$`, "i") } });
    if (!analysis) return apiError("Subject not found", 404);
    return apiResponse(analysis);
  } catch (err) {
    console.error("[RTU EXAM DETAIL]", err);
    return apiError("Error fetching exam analysis", 500);
  }
}
