import { NextRequest } from "next/server";
import { cloudinary } from "@/lib/db/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return Response.json({ error: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "medha/campus-cart" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string });
        }
      );
      uploadStream.end(buffer);
    });

    return Response.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload Error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
