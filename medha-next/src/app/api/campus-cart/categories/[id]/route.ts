import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Category from "@/lib/models/Category";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) return apiError("Category not found.", 404);
    return apiResponse({ category });
  } catch (err) {
    console.error("Get Category Error:", err);
    return apiError("Error fetching category.", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = (await req.json()) as {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
    };
    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!category) return apiError("Category not found.", 404);
    return apiResponse({ category });
  } catch (err) {
    console.error("Update Category Error:", err);
    return apiError("Error updating category.", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return apiError("Category not found.", 404);
    return apiResponse({ message: "Category deleted." });
  } catch (err) {
    console.error("Delete Category Error:", err);
    return apiError("Error deleting category.", 500);
  }
}
