import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import User from "@/lib/models/User";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const college = searchParams.get("college");
    const university = searchParams.get("university");
    const condition = searchParams.get("condition");
    const seller = searchParams.get("seller");
    const featured = searchParams.get("featured");
    const status = searchParams.get("status") || "active";
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sort = searchParams.get("sort") || "-createdAt";

    const filter: Record<string, unknown> = {};
    if (status !== "all") {
      filter.status = status;
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          filter.category = cat._id;
        } else {
          filter.category = new mongoose.Types.ObjectId();
        }
      }
    }
    if (college) filter.college = { $regex: college, $options: "i" };
    if (university) {
      const usersInUniversity = await User.find({ university: { $regex: university, $options: "i" } }).select("_id");
      const userIds = usersInUniversity.map((u) => u._id);
      filter.seller = { $in: userIds };
    }
    if (condition) filter.condition = condition;
    if (seller) filter.seller = seller;
    if (featured === "true") filter.featured = true;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, unknown>).$gte = parseFloat(minPrice);
      if (maxPrice) (filter.price as Record<string, unknown>).$lte = parseFloat(maxPrice);
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("seller", "name avatar")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return apiResponse({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Get Products Error:", err);
    return apiError("Error fetching products.", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as {
      name: string;
      slug: string;
      description?: string;
      sellerPrice: number;
      originalPrice?: number;
      images?: string[];
      category: string;
      stock?: number;
      condition?: string;
      college?: string;
      tags?: string[];
    };

    if (!body.name || !body.slug || !body.sellerPrice || !body.category)
      return apiError("Name, slug, sellerPrice, and category are required.", 400);

    // Resolve category by slug if not a valid ObjectId
    let categoryId = body.category;
    let categorySlug = "";
    if (mongoose.Types.ObjectId.isValid(body.category)) {
      const cat = await Category.findById(body.category);
      if (!cat) return apiError("Invalid category.", 400);
      categoryId = cat._id.toString();
      categorySlug = cat.slug;
    } else {
      const cat = await Category.findOne({ slug: body.category });
      if (!cat) return apiError("Invalid category.", 400);
      categoryId = cat._id.toString();
      categorySlug = cat.slug;
    }

    const LIMITS: Record<string, number> = {
      "textbooks": 1500,
      "drafters": 800,
      "calculators": 2000,
      "stationery": 500,
      "electronics": 35000,
      "hostel-essentials": 4000
    };

    const maxLimit = LIMITS[categorySlug] || 5000;

    if (body.sellerPrice < 10 || body.sellerPrice > maxLimit)
      return apiError(`Price must be between ₹10 and ₹${maxLimit} for this category.`, 400);

    const product = await Product.create({
      ...body,
      category: categoryId,
      sellerPrice: body.sellerPrice,
      commissionPercent: 6,
      seller: auth.user.userId,
      images: body.images || [],
      tags: body.tags || [],
    });
    return apiResponse({ product }, 201);
  } catch (err) {
    console.error("Create Product Error:", err);
    return apiError("Error creating product.", 500);
  }
}
