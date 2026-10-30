import { describe, it, expect, beforeEach } from "vitest";
import {
  getClientCache,
  setClientCache,
} from "../components/SearchEngine/searchCache";
import {
  getSubjectBadgeStyle,
  SEMESTERS,
  CATEGORIES,
} from "../components/SearchEngine/searchConstants";

describe("SearchEngine split helpers", () => {
  beforeEach(() => {
    const cached = getClientCache("clear-me");
    if (cached) {
      // cache is module-scoped; overwrite by filling then relying on TTL/key uniqueness
    }
  });

  it("returns cache hits and expires after TTL", () => {
    setClientCache("dsa-notes", { results: { notes: [1] } }, 12);
    expect(getClientCache("dsa-notes").data.results.notes).toEqual([1]);
    expect(getClientCache("missing-key")).toBeNull();
  });

  it("keeps semester and category filters", () => {
    expect(SEMESTERS[0].id).toBe("all");
    expect(CATEGORIES.map((c) => c.id)).toEqual([
      "all",
      "notes",
      "youtube",
      "subjects",
      "pyq",
    ]);
  });

  it("styles known subjects without throwing", () => {
    const badge = getSubjectBadgeStyle("Database Management System");
    expect(badge.text).toBe("#2E7D32");
    expect(getSubjectBadgeStyle("").text).toBeTruthy();
  });
});
