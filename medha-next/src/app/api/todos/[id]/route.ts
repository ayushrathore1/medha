import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Todo from "@/lib/models/Todo";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** PATCH /api/todos/[id] — Toggle todo completion */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const todo = await Todo.findOne({ _id: id, user: auth.user.userId });
    if (!todo) return apiError("Todo not found", 404);
    todo.isCompleted = !todo.isCompleted;
    await todo.save();
    return apiResponse({ message: "Todo updated", todo });
  } catch { return apiError("Error updating todo", 500); }
}

/** DELETE /api/todos/[id] — Delete a todo */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    await Todo.findOneAndDelete({ _id: id, user: auth.user.userId });
    return apiResponse({ message: "Todo deleted" });
  } catch { return apiError("Error deleting todo", 500); }
}
