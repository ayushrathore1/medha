import { describe, expect, it } from "vitest";
import { mapCurriculumSubject, subjectIdentityKey } from "./useMergedSubjects";
import { subjectMatchesBranch } from "../data/branchScope";

// Re-implement merge path expectations via identity + branch meta (hook merge is module-private).
function mergeLikeHook(staticList, curriculumList) {
  const byKey = new Map();
  for (const s of staticList) byKey.set(subjectIdentityKey(s), { ...s });
  for (const raw of curriculumList) {
    const subject = mapCurriculumSubject(raw);
    const key = subjectIdentityKey(subject);
    const prev = byKey.get(key);
    const branches = [
      ...new Set(
        [...(prev?.branches || []), ...(subject.branches || []), prev?.branch, subject.branch]
          .map((b) => String(b || "").trim().toUpperCase())
          .filter(Boolean)
      ),
    ];
    byKey.set(key, {
      ...prev,
      ...subject,
      branch: prev?.branch === "COMMON" || subject.branch === "COMMON" ? "COMMON" : subject.branch || prev?.branch,
      branches,
      aliases: [...new Set([...(prev?.aliases || []), ...(subject.aliases || [])])],
    });
  }
  return [...byKey.values()];
}

describe("Sem 5 merge dedupe", () => {
  it("collapses CSE curriculum + COMMON static into one AOA row", () => {
    const staticList = [
      {
        name: "Analysis of Algorithms",
        code: "5CS4-05",
        short: "AOA",
        semester: 5,
        branch: "COMMON",
        branches: ["COMMON"],
        units: [{ topics: ["a", "b"] }],
        topicCount: 2,
      },
      {
        name: "Information Theory & Coding",
        code: "5CS3-01",
        short: "ITC",
        semester: 5,
        branch: "CSE",
        branches: ["CSE", "IT"],
        units: [{ topics: ["x"] }],
        topicCount: 1,
      },
    ];
    const curriculum = [
      {
        name: "Analysis of Algorithms",
        code: "5CS4-05",
        short: "5CS4-05",
        semester: 5,
        branch: "CSE",
        units: [{ title: "U1", topics: ["a", "b", "c"] }],
      },
      {
        name: "Information Theory & Coding",
        code: "5CS3-01",
        semester: 5,
        branch: "CSE",
        units: [{ title: "U1", topics: ["x", "y"] }],
      },
    ];

    const merged = mergeLikeHook(staticList, curriculum);
    const sem5 = merged.filter((s) => s.semester === 5);
    expect(sem5).toHaveLength(2);

    const aoa = sem5.find((s) => s.code === "5CS4-05");
    const itc = sem5.find((s) => s.code === "5CS3-01");
    expect(aoa).toBeTruthy();
    expect(itc).toBeTruthy();
    expect(subjectMatchesBranch(aoa, "IT")).toBe(true);
    expect(subjectMatchesBranch(itc, "IT")).toBe(true);
    expect(subjectMatchesBranch(itc, "AIDS")).toBe(false);
  });
});
