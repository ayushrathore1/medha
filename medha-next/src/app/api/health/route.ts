import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";

export async function GET() {
  try {
    await connectDB();

    const healthCheck = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
      },
      database: {
        status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        name: mongoose.connection.name || "N/A",
      },
    };

    const statusCode = mongoose.connection.readyState === 1 ? 200 : 503;
    return NextResponse.json(healthCheck, { status: statusCode });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Health check failed" },
      { status: 503 }
    );
  }
}
