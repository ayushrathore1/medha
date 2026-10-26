import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Category from "@/lib/models/Category";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return apiResponse({ categories });
  } catch (err) {
    console.error("Get Categories Error:", err);
    return apiError("Error fetching categories.", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = (await req.json()) as {
      name: string;
      slug: string;
      description?: string;
      image?: string;
      parentCategory?: string;
    };
    if (!body.name || !body.slug)
      return apiError("Name and slug are required.", 400);

    const category = await Category.create({
      name: body.name,
      slug: body.slug,
      description: body.description || "",
      image: body.image || "",
      parentCategory: body.parentCategory || undefined,
    });
    return apiResponse({ category }, 201);
  } catch (err) {
    console.error("Create Category Error:", err);
    return apiError("Error creating category.", 500);
  }
}
