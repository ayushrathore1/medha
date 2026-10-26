import { connectDB } from "@/lib/db/mongoose";
import SearchHistory from "@/lib/models/SearchHistory";

export async function trackProductView(userId: string, productId: string) {
  await connectDB();
  return SearchHistory.create({ userId, query: `view:${productId}` });
}

export async function trackSearch(userId: string, query: string) {
  await connectDB();
  return SearchHistory.create({ userId, query });
}

export async function trackSubjectProgress(userId: string, subjectId: string, progress: number) {
  await connectDB();
  return SearchHistory.create({ userId, query: `subject:${subjectId}:${progress}` });
}