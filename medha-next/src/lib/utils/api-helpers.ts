import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/auth";

/**
 * Authenticated user info extracted from JWT
 */
export interface AuthUser {
  _id: string;
  id: string;
  userId: string;
  email?: string;
}

/**
 * Standard API response helper
 */
export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Error response helper
 */
export function apiError(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status });
}

/**
 * Extracts and verifies auth token from request headers.
 * Returns the authenticated user or null.
 */
export function getAuthUser(req: NextRequest): AuthUser | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = verifyToken(token);
    return {
      _id: decoded.userId,
      id: decoded.userId,
      userId: decoded.userId,
      email: decoded.email as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Requires authentication — returns user or error response.
 */
export function requireAuth(
  req: NextRequest
): { user: AuthUser } | { error: NextResponse } {
  const user = getAuthUser(req);
  if (!user) {
    return { error: apiError("No token, authorization denied", 401) };
  }
  return { user };
}

/**
 * Rate limiting helper using in-memory store (for serverless, consider Upstash Redis)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;

  entry.count++;
  return true;
}
