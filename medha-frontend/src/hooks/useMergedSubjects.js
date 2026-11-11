import { useEffect, useMemo, useState } from "react";
import { fetchCurriculumTree } from "../api/curriculum";
import { SUBJECTS, slugify } from "../data/subjectCatalog";
import { isCommonBranch, isSem5SharedCore, normalizeName } from "../data/branchScope";

const PALETTE = [
  { bg: "#DCEFE0", accent: "#3F8F4C", ink: "#1F4D28" },
  { bg: "#F6E3C8", accent: "#C07828", ink: "#6B3E10" },
  { bg: "#E4D7F4", accent: "#7C3AED", ink: "#4C1D95" },
  { bg: "#D7ECF4", accent: "#0F766E", ink: "#134E4A" },
];

export function mapCurriculumSubject(subject, index = 0) {
  const units = (subject.units || []).map((unit) => {
    const topics = (unit.topics || []).map((t) => (typeof t === "string" ? t : t.title)).filter(Boolean);
    return {
      unitNumber: unit.unitNumber,
      title: unit.title,
      slug: slugify(unit.title),
      topics,
      topicCount: topics.length,
      videoCount: 0,
      resourceCount: topics.length + 1,
      id: unit.id,
    };
  });

  const nameSlug = slugify(subject.name);
  const codeSlug = slugify(`${subject.name}-${subject.code || ""}`);
  return {
    id: subject.id,
    name: subject.name,
    slug: subject.slug || nameSlug || codeSlug,
    slugAliases: [nameSlug, codeSlug].filter(Boolean),
    short: subject.short || subject.code || subject.name.slice(0, 4),
    semester: subject.semester,
    code: subject.code,
    scheme: subject.scheme || "rtu",
    course: subject.course || "B.Tech",
    branch: subject.branch || "CSE",
    branches: subject.branches || undefined,
    aliases: subject.aliases || undefined,
    color: PALETTE[index % PALETTE.length],
    units,
    topicCount: units.reduce((n, u) => n + u.topicCount, 0),
    unitCount: units.length,
    fromCurriculum: true,
  };
}

/**
 * One row per syllabus subject (semester + code/name).
 * Do NOT key by branch — Sem 5 cores were duplicated as CSE + COMMON.
 */
export function subjectIdentityKey(subject) {
  const sem = subject?.semester ?? "";
  const code = String(subject?.code || "").trim().toUpperCase();
  if (code) return `${sem}|code:${code}`;
  return `${sem}|name:${normalizeName(subject?.name)}`;
}

function topicScore(subject) {
  return (subject?.units || []).reduce(
    (n, u) => n + ((u.topics || []).length || Number(u.topicCount) || 0),
    0
  );
}

function mergeBranchMeta(prev = {}, next = {}) {
  const branchList = [
    ...new Set(
      [...(prev.branches || []), ...(next.branches || []), prev.branch, next.branch]
        .map((b) => String(b || "").trim().toUpperCase())
        .filter(Boolean)
    ),
  ];
  const preferCommon =
    isCommonBranch(prev.branch) ||
    isCommonBranch(next.branch) ||
    isSem5SharedCore(prev) ||
    isSem5SharedCore(next);
  return {
    branch: preferCommon ? "COMMON" : next.branch || prev.branch || "CSE",
    branches: branchList.length ? branchList : undefined,
    aliases: [...new Set([...(prev.aliases || []), ...(next.aliases || [])].filter(Boolean))],
  };
}

function mergeSubjects(staticList, curriculumList) {
  const mapped = (curriculumList || []).map((s, i) => mapCurriculumSubject(s, i));
  const byKey = new Map();

  // Keep static catalog as base so existing /subjects/:slug links keep resolving.
  for (const subject of staticList || []) {
    const nameSlug = slugify(subject.name);
    const codeSlug = slugify(`${subject.name}-${subject.code || ""}`);
    byKey.set(subjectIdentityKey(subject), {
      ...subject,
      slugAliases: [...new Set([subject.slug, nameSlug, codeSlug].filter(Boolean))],
    });
  }

  // Curriculum enriches matching semester+code (or name). Preserve static branch scope
  // so CSE/IT electives and Sem 5 commons stay visible after API merge.
  for (const subject of mapped) {
    const key = subjectIdentityKey(subject);
    const prev = byKey.get(key);
    const curriculumShort = String(subject.short || "").trim();
    const prevShort = String(prev?.short || "").trim();
    const shortLooksLikeCode =
      !curriculumShort ||
      curriculumShort === String(subject.code || "").trim() ||
      /^\d/.test(curriculumShort) ||
      (/\d/.test(curriculumShort) && curriculumShort.includes("-"));

    const preferCurriculumUnits = !prev || topicScore(subject) >= topicScore(prev);
    const branchMeta = mergeBranchMeta(prev || {}, subject);

    byKey.set(key, {
      ...prev,
      ...subject,
      ...branchMeta,
      slug: prev?.slug || subject.slug,
      slugAliases: [
        ...new Set(
          [...(prev?.slugAliases || []), ...(subject.slugAliases || []), prev?.slug, subject.slug].filter(Boolean)
        ),
      ],
      short: shortLooksLikeCode && prevShort ? prevShort : curriculumShort || prevShort || subject.code,
      color: prev?.color || subject.color,
      units: preferCurriculumUnits ? subject.units : prev.units,
      topicCount: preferCurriculumUnits ? subject.topicCount : prev.topicCount,
      unitCount: preferCurriculumUnits ? subject.unitCount : prev.unitCount,
      fromCurriculum: Boolean(prev?.fromCurriculum || subject.fromCurriculum),
    });
  }

  return [...byKey.values()].sort((a, b) => {
    if (a.semester !== b.semester) return a.semester - b.semester;
    return a.name.localeCompare(b.name);
  });
}

export function useMergedSubjects() {
  const [curriculumSubjects, setCurriculumSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchCurriculumTree();
        if (!cancelled) setCurriculumSubjects(data.subjects || []);
      } catch {
        if (!cancelled) setCurriculumSubjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const subjects = useMemo(
    () => mergeSubjects(SUBJECTS, curriculumSubjects),
    [curriculumSubjects]
  );

  const semesters = useMemo(
    () => [...new Set(subjects.map((s) => s.semester).filter(Boolean))].sort((a, b) => a - b),
    [subjects]
  );

  return { subjects, semesters, loading };
}

export function findMergedSubject(subjects, subjectSlug) {
  const slug = String(subjectSlug || "").trim().toLowerCase();
  if (!slug) return null;

  const list = subjects || [];
  const direct =
    list.find((s) => String(s.slug || "").toLowerCase() === slug) ||
    list.find((s) => (s.slugAliases || []).some((alias) => String(alias).toLowerCase() === slug));
  if (direct) return direct;

  return (
    list.find((s) => {
      const nameSlug = slugify(s.name);
      const codeSlug = slugify(`${s.name}-${s.code || ""}`);
      const shortSlug = slugify(s.short || "");
      return nameSlug === slug || codeSlug === slug || shortSlug === slug;
    }) || null
  );
}

export function findMergedUnit(subject, unitSlug) {
  if (!subject) return null;
  const slug = String(unitSlug || "").trim().toLowerCase();
  if (!slug) return null;

  const units = subject.units || [];
  return (
    units.find((u) => String(u.slug || "").toLowerCase() === slug) ||
    units.find((u) => slugify(u.title) === slug) ||
    units.find((u) => String(u.unitNumber) === slug) ||
    units.find((u) => String(u.unitNumber).padStart(2, "0") === slug) ||
    null
  );
}
