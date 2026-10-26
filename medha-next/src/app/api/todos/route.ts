import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Todo from "@/lib/models/Todo";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/todos — Get all todos for user */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const todos = await Todo.find({ user: auth.user.userId }).sort({ createdAt: 1 });
    return apiResponse({ todos });
  } catch { return apiError("Error fetching todos", 500); }
}

/** POST /api/todos — Add a new todo */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { task } = (await req.json()) as { task?: string };
    if (!task) return apiError("Task is required", 400);
    const todo = await Todo.create({ user: auth.user.userId, task });
    return apiResponse({ message: "Todo added", todo }, 201);
  } catch { return apiError("Error adding todo", 500); }
}
