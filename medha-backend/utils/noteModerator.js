const fs = require("fs");
const Groq = require("groq-sdk");
const { enqueueGroq, truncateForGroq, estimateTokens } = require("./groqQueue");
const { GROQ_MODERATION } = require("../config/groqModels");

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

async function extractPdfText(filePath) {
  try {
    if (!filePath || !fs.existsSync(filePath)) return "";
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

/**
 * Security / relevance criteria for public study uploads.
 * Returns { allowed, reason, label, confidence, criteria }
 */
async function moderateNote({ title, subject, description, filename, extractedText }) {
  if (!groq) {
    return {
      allowed: null,
      deferred: true,
      reason: "Automated review is temporarily unavailable. We will retry shortly.",
      label: "unavailable",
      confidence: 0,
      criteria: {},
    };
  }

  const sample = truncateForGroq(
    [title, subject, description, filename, extractedText].filter(Boolean).join("\n")
  );
  const estimate = estimateTokens(sample);

  try {
    const parsed = await enqueueGroq(
      async () => {
        const response = await groq.chat.completions.create({
          model: GROQ_MODERATION,
          temperature: 0.1,
          max_tokens: 320,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a security and relevance reviewer for Medha Revision, an engineering study library. Reply with valid JSON only.",
            },
            {
              role: "user",
              content: `Evaluate this student upload for PUBLIC sharing.

ALLOW only college/university academic study material: class notes, PYQs, syllabus, lecture slides, handwritten notes, diagrams, lab manuals, assignment solutions for coursework.

REJECT if any fail:
- adult/sexual content
- malware instructions, phishing, credentials dumps
- comics/manga/memes/entertainment/novels
- personal junk, spam, ads, resumes unrelated to sharing notes
- empty / unreadable document that cannot be study material
- clearly off-topic non-academic files

UPLOAD
${sample || "(no extractable text — judge from title/filename/subject only; if unclear, set allowed=true with low confidence so humans review)"}

Return JSON:
{
  "allowed": true|false,
  "reason": "one short formal sentence",
  "label": "notes|pyq|slides|handwritten|lab|rejected",
  "confidence": 0-1,
  "criteria": {
    "isAcademic": true|false,
    "isSafe": true|false,
    "hasStudyValue": true|false,
    "suggestedSubject": "string or empty",
    "suggestedSemester": "string or empty"
  }
}`,
            },
          ],
        });

        try {
          return JSON.parse(response.choices?.[0]?.message?.content || "{}");
        } catch {
          return {};
        }
      },
      { estimateTokens: estimate }
    );

    const allowed = parsed.allowed === true;
    const confidence = typeof parsed.confidence === "number" ? parsed.confidence : allowed ? 0.7 : 0.8;
    return {
      allowed,
      deferred: false,
      reason:
        parsed.reason ||
        (allowed ? "This appears to be academic study material." : "This does not meet our study-material guidelines."),
      label: parsed.label || (allowed ? "notes" : "rejected"),
      confidence,
      criteria: parsed.criteria || {},
    };
  } catch (err) {
    if (err.code === "GROQ_BUDGET" || /429|rate/i.test(err.message || "")) {
      return {
        allowed: null,
        deferred: true,
        reason: "Review queue is busy. We will retry automatically.",
        label: "queued",
        confidence: 0,
        criteria: {},
        error: err.message,
      };
    }
    throw err;
  }
}

module.exports = { extractPdfText, moderateNote };
