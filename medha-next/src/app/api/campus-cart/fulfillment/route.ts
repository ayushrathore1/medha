import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Shipment from "@/lib/models/Shipment";
import { createShipment } from "@/lib/services/fulfillment";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";
import { requireAdmin } from "@/lib/utils/admin-guard";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;
    const shipments = await Shipment.find(filter).sort({ createdAt: -1 }).limit(200);
    return apiResponse({ shipments });
  } catch (err) {
    console.error("Get fulfillment error:", err);
    return apiError("Failed to fetch shipments.", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const body = (await req.json()) as { orderId: string };
    if (!body.orderId) return apiError("Order ID is required.", 400);
    const shipment = await createShipment(body.orderId);
    return apiResponse({ shipment }, 201);
  } catch (err) {
    console.error("Create shipment error:", err);
    return apiError("Failed to create shipment.", 500);
  }
}