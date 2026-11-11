/**
 * Branch visibility for RTU subjects / notes / desk filters.
 *
 * Sem 5 CSE · AIDS · IT share four cores (AOA, CG, CD, OS).
 * The other two slots are branch electives (CSE/IT ≈ ITC+WC, AIDS ≈ DMC+Blockchain).
 */

export const CS_FAMILY_BRANCHES = new Set([
  "CSE",
  "CS",
  "IT",
  "AIDS",
  "AI",
  "CAI",
  "CSD",
  "CSIT",
]);

/** Sem 5 cores shared across the CS family (not branch electives). */
const SEM5_SHARED_CODES = new Set([
  "5CS4-05", // AOA
  "5CS4-04", // CG / CGMM
  "5CS4-03", // OS
  "5CS4-02", // CD
]);

const SEM5_SHARED_SHORTS = new Set(["AOA", "CG", "CGMM", "OS", "CD"]);

const SEM5_SHARED_NAMES = new Set(
  [
    "Analysis of Algorithms",
    "Computer Graphics & Multimedia",
    "Computer Graphics and Multimedia",
    "Computer Graphics",
    "Operating System",
    "Operating Systems",
    "Compiler Design",
  ].map((n) => normalizeName(n))
);

export function normalizeBranch(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}

export function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isCommonBranch(branch) {
  const b = normalizeBranch(branch);
  return !b || b === "COMMON" || b === "ALL" || b === "GENERAL" || b === "SHARED";
}

export function isCsFamilyBranch(branch) {
  const b = normalizeBranch(branch);
  if (!b) return false;
  if (CS_FAMILY_BRANCHES.has(b)) return true;
  if (b.includes("ARTIFICIAL") || b.includes("AIDS")) return true;
  if (b === "INFORMATION TECHNOLOGY" || b.startsWith("IT ")) return true;
  return false;
}

function branchEquals(a, b) {
  const left = normalizeBranch(a);
  const right = normalizeBranch(b);
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
}

/** True for the four Sem 5 cores that CSE / AIDS / IT all study. */
export function isSem5SharedCore(subject) {
  if (!subject) return false;
  if (subject.semester != null && Number(subject.semester) !== 5) return false;
  const code = String(subject.code || "").trim().toUpperCase();
  if (code && SEM5_SHARED_CODES.has(code)) return true;
  const short = String(subject.short || "").trim().toUpperCase();
  if (short && SEM5_SHARED_SHORTS.has(short)) return true;
  const name = normalizeName(subject.name);
  if (name && SEM5_SHARED_NAMES.has(name)) return true;
  return false;
}

/**
 * Should this subject appear for the viewer's branch?
 * - COMMON / missing → yes (Sem 5 commons limited to CS family)
 * - Sem 5 shared cores → yes for CSE / AIDS / IT even if stored as CSE
 * - branches[] → any listed branch
 * - else exact/fuzzy branch match
 */
export function subjectMatchesBranch(subject, userBranch) {
  if (!userBranch) return true;
  if (!subject) return true;
  const ub = normalizeBranch(userBranch);

  if (isSem5SharedCore(subject) && isCsFamilyBranch(ub)) return true;

  if (isCommonBranch(subject.branch)) {
    if (Number(subject.semester) === 5) return isCsFamilyBranch(ub);
    return true;
  }

  if (Array.isArray(subject.branches) && subject.branches.length) {
    return subject.branches.some((b) => branchEquals(b, ub));
  }

  return branchEquals(subject.branch || "CSE", ub);
}

/** Pick the best catalog subject for a note title / subject label. */
export function findCatalogSubject(catalog, subjectName) {
  const needle = normalizeName(subjectName);
  if (!needle || !Array.isArray(catalog)) return null;
  return (
    catalog.find((s) => normalizeName(s.name) === needle) ||
    catalog.find((s) => normalizeName(s.short) === needle) ||
    catalog.find((s) => (s.aliases || []).some((a) => normalizeName(a) === needle)) ||
    null
  );
}
