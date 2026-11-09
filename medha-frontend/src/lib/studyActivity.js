import {
  getRecentSearches,
  getRecentSubjectSlugs,
  getRecentTopics,
  getSubjectBySlug,
  getUnitBySlug,
  saveRecentSearch,
  saveRecentSubject,
  saveRecentTopic,
  searchPath,
} from "../data/subjectCatalog";
import { pingDailyActivity } from "./dailyStreak";

const STORAGE_KEY = "medha_continue_studying_v1";
const MAX_ITEMS = 20;

function markStudyDay() {
  // Fire-and-forget — once per day on the server
  void pingDailyActivity();
}

function asText(value) {
  if (value == null || value === "") return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return String(value.name || value.title || value.code || value.label || "").trim();
  }
  return "";
}

function noteSubjectLabel(note) {
  return asText(note?.subject) || asText(note?.subjectTag) || "";
}

function readRaw() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((item) => item?.id && item?.to && item?.title) : [];
  } catch {
    return [];
  }
}

function writeRaw(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  } catch {
    /* ignore quota */
  }
}

function upsert(entry) {
  if (!entry?.id || !entry?.to || !entry?.title) return null;
  const next = {
    id: String(entry.id),
    kind: entry.kind || "item",
    title: String(entry.title).trim(),
    meta: String(entry.meta || "").trim(),
    to: String(entry.to),
    badge: String(entry.badge || entry.kind || "Study"),
    tone: entry.tone || "quiet",
    at: entry.at || new Date().toISOString(),
  };
  writeRaw([next, ...readRaw().filter((item) => item.id !== next.id)]);
  return next;
}

/** Seed from older recent-* keys once so existing local history still shows. */
function migrateLegacyIfNeeded() {
  if (readRaw().length) return;
  const seeded = [];

  getRecentTopics().forEach((entry) => {
    const { subject, unit } = getUnitBySlug(entry.subjectSlug, entry.unitSlug);
    if (!subject || !unit) return;
    seeded.push({
      id: `topic-${entry.subjectSlug}-${entry.unitSlug}`,
      kind: "topic",
      title: entry.topic || unit.title,
      meta: `${subject.short || subject.name} · ${unit.title}`,
      to: `/subjects/${subject.slug}/${unit.slug}`,
      badge: "Unit",
      tone: "quiet",
      at: entry.at || null,
    });
  });

  getRecentSubjectSlugs().forEach((slug) => {
    const subject = getSubjectBySlug(slug);
    if (!subject) return;
    seeded.push({
      id: `subject-${slug}`,
      kind: "subject",
      title: subject.name,
      meta: [subject.short || subject.code, subject.branch].filter(Boolean).join(" · "),
      to: `/subjects/${subject.slug}`,
      badge: "Subject",
      tone: "quiet",
      at: null,
    });
  });

  getRecentSearches().forEach((term) => {
    seeded.push({
      id: `search-${term.toLowerCase()}`,
      kind: "search",
      title: term,
      meta: "Recent search",
      to: searchPath(term),
      badge: "Search",
      tone: "busy",
      at: null,
    });
  });

  if (seeded.length) writeRaw(seeded);
}

export function getContinueStudying(limit = 12) {
  migrateLegacyIfNeeded();
  return readRaw()
    .slice()
    .sort((a, b) => {
      const ta = a.at ? Date.parse(a.at) : 0;
      const tb = b.at ? Date.parse(b.at) : 0;
      return tb - ta;
    })
    .slice(0, limit);
}

export function trackSubjectOpened(subject) {
  if (!subject?.slug) return;
  saveRecentSubject(subject.slug);
  upsert({
    id: `subject-${subject.slug}`,
    kind: "subject",
    title: subject.name || subject.slug,
    meta: [subject.short || subject.code, subject.branch, subject.semester ? `Sem ${subject.semester}` : ""]
      .filter(Boolean)
      .join(" · "),
    to: `/subjects/${subject.slug}`,
    badge: "Subject",
    tone: "quiet",
  });
  markStudyDay();
}

export function trackUnitOpened(subject, unit) {
  if (!subject?.slug || !unit?.slug) return;
  const at = new Date().toISOString();
  saveRecentTopic({
    subjectSlug: subject.slug,
    unitSlug: unit.slug,
    topic: unit.title,
    at,
  });
  upsert({
    id: `topic-${subject.slug}-${unit.slug}`,
    kind: "topic",
    title: unit.title || "Unit",
    meta: [
      subject.short || subject.name,
      unit.unitNumber != null ? `Unit ${unit.unitNumber}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    to: `/subjects/${subject.slug}/${unit.slug}`,
    badge: "Unit",
    tone: "quiet",
    at,
  });
  markStudyDay();
}

export function trackNoteOpened(note) {
  const id = note?._id || note?.id;
  if (!id) return;
  const subject = noteSubjectLabel(note);
  upsert({
    id: `note-${id}`,
    kind: "note",
    title: note.title || "Notes",
    meta: [subject, note.isPublic === false ? "Private" : "Library", "PDF"].filter(Boolean).join(" · "),
    to: `/note/${id}`,
    badge: "Notes",
    tone: "ok",
  });
  markStudyDay();
}

export function trackPaperOpened(paper, sharePath) {
  const id = paper?.id || paper?._id;
  if (!id) return;
  const path =
    sharePath ||
    `/past-papers?branch=${encodeURIComponent(paper.branch || "CSE")}&sem=${paper.semester || ""}&subject=${encodeURIComponent(
      paper.subjectName || ""
    )}&paper=${id}`;
  upsert({
    id: `paper-${id}`,
    kind: "paper",
    title: `${paper.subjectName || "Past paper"}${paper.year ? ` · ${paper.year}` : ""}`,
    meta: [
      "Past paper",
      paper.semester ? `Sem ${paper.semester}` : null,
      paper.examType || null,
    ]
      .filter(Boolean)
      .join(" · "),
    to: path,
    badge: "Paper",
    tone: "busy",
  });
  markStudyDay();
}

export function trackSearchOpened(term, path) {
  const trimmed = String(term || "").trim();
  if (!trimmed) return;
  saveRecentSearch(trimmed);
  upsert({
    id: `search-${trimmed.toLowerCase()}`,
    kind: "search",
    title: trimmed,
    meta: "Recent search",
    to: path || searchPath(trimmed),
    badge: "Search",
    tone: "busy",
  });
  markStudyDay();
}
