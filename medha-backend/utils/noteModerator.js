const fs = require("fs");
const Groq = require("groq-sdk");

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

async function extractPdfText(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const pdfParse = require("pdf-parse");
    const parse = typeof pdfParse === "function" ? pdfParse : pdfParse?.default;
    if (typeof parse !== "function") return "";
    const result = await parse(buffer);
    return String(result?.text || "").trim();
  } catch (err) {
    console.warn("[Moderator] PDF text extract failed:", err.message);
    return "";
  }
}

async function moderateNote({ title, subject, description, filename, extractedText }) {
  if (!groq) {
    return {
      allowed: false,
      reason: "Note checks are down right now. Wait a minute and try again.",
      label: "unavailable",
    };
  }

  const sample = [title, subject, description, filename, extractedText]
    .filter(Boolean)
    .join("\n")
    .slice(0, 6000);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 250,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You review student file uploads for an engineering exam library. Reply with valid JSON only.",
      },
      {
        role: "user",
        content: `Decide if this upload is real academic study material for college or university: class notes, PYQ papers, syllabus, lecture slides, handwritten notes, or subject diagrams.

REJECT adult or sexual content, comics, manga, memes, entertainment, novels, spam, personal junk, or anything that is not study material.

UPLOAD
${sample}

Return JSON: {"allowed":true|false,"reason":"one short sentence for the student","label":"notes|pyq|slides|handwritten|rejected"}`,
      },
    ],
  });

  let parsed = {};
  try {
    parsed = JSON.parse(response.choices?.[0]?.message?.content || "{}");
  } catch {
    parsed = {};
  }

  const allowed = parsed.allowed === true;
  return {
    allowed,
    reason: parsed.reason || (allowed ? "Looks like course material." : "This does not look like study material."),
    label: parsed.label || (allowed ? "notes" : "rejected"),
  };
}

module.exports = { extractPdfText, moderateNote };
