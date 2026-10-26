import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import DailyQuote from "@/lib/models/DailyQuote";
import { apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/dashboard/quote — Get daily inspirational quote */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const today = new Date().toISOString().split("T")[0];

    const cached = await DailyQuote.findOne({ date: today });
    if (cached) {
      return apiResponse({ quote: cached.quote, author: cached.author, source: cached.source, cached: true });
    }

    // If Groq API is configured, generate one. Otherwise fallback.
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return apiResponse({
        quote: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela", source: null, fallback: true,
      });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a curator of inspirational wisdom. Provide ONE motivational quote for students. Include the author. Output ONLY valid JSON: {"quote":"...","author":"...","source":null}`,
          },
          { role: "user", content: "Give me today's inspirational quote." },
        ],
        temperature: 0.9, max_tokens: 256,
        response_format: { type: "json_object" },
      }),
    });

    const aiData = await res.json();
    let quoteData: { quote: string; author: string; source: string | null };
    try {
      quoteData = JSON.parse(aiData.choices[0]?.message?.content || "{}");
    } catch {
      quoteData = { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", source: null };
    }

    await DailyQuote.create({ ...quoteData, date: today });
    return apiResponse({ ...quoteData, cached: false });
  } catch (err) {
    console.error("[DAILY QUOTE]", err);
    return apiResponse({
      quote: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela", source: null, fallback: true,
    });
  }
}
