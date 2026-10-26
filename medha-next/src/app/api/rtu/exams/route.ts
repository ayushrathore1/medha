import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import ExamAnalysis from "@/lib/models/ExamAnalysis";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/rtu/exams — Get all exam analysis subjects */
export async function GET() {
  try {
    await connectDB();
    const subjects = await ExamAnalysis.find().select("subjectName totalPaperMarks");
    return apiResponse({ subjects });
  } catch { return apiError("Error fetching exam subjects", 500); }
}
