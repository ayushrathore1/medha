import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import ChatSession from "@/lib/models/ChatSession";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are Medha AI, a friendly and intelligent study assistant for Indian engineering students (especially RTU).
You help with: explaining concepts, solving problems step-by-step, creating study plans, answering doubts, and providing exam tips.
Be concise, use examples, and format with markdown when helpful. If you don't know something, say so.`;

/** POST /api/chatbot — Send message to AI chatbot */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  if (!GROQ_API_KEY) return apiError("AI service not configured.", 503);

  try {
    await connectDB();
    const { message, sessionId } = (await req.json()) as { message: string; sessionId?: string };
    if (!message?.trim()) return apiError("Message is required", 400);

    // Get or create session
    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, user: auth.user.userId });
    }
    if (!session) {
      session = await ChatSession.create({
        user: auth.user.userId,
        title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        messages: [],
      });
    }

    // Add user message
    session.messages.push({ role: "user", content: message.trim(), timestamp: new Date() });

    // Build context from last 10 messages
    const recent = session.messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...recent],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    const aiData = await aiRes.json();
    const reply = aiData.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    // Add assistant reply
    session.messages.push({ role: "assistant", content: reply, timestamp: new Date() });
    await session.save();

    return apiResponse({ reply, sessionId: session._id });
  } catch (err) {
    console.error("[CHATBOT]", err);
    return apiError("Chatbot error. Please try again.", 500);
  }
}

/** GET /api/chatbot — Get chat sessions or messages */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const session = await ChatSession.findOne({ _id: sessionId, user: auth.user.userId });
      return apiResponse({ messages: session?.messages || [] });
    }

    const sessions = await ChatSession.find({ user: auth.user.userId })
      .select("title updatedAt")
      .sort({ updatedAt: -1 }).limit(20);
    return apiResponse({ sessions });
  } catch { return apiError("Error fetching chat history", 500); }
}
