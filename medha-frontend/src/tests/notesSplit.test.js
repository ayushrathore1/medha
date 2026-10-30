import { describe, it, expect } from "vitest";
import {
  resolveFileUrl,
  getSubjectColor,
  formatDate,
  MAX_NOTE_UPLOAD_BYTES,
  NOTE_TYPES,
  SEMESTERS,
} from "../components/Notes/notesConstants";

describe("Notes helpers after page split", () => {
  it("keeps the 25MB upload cap", () => {
    expect(MAX_NOTE_UPLOAD_BYTES).toBe(25 * 1024 * 1024);
  });

  it("resolves local file paths against the API origin", () => {
    expect(resolveFileUrl("")).toBe("");
    expect(resolveFileUrl("https://res.cloudinary.com/note.pdf")).toBe(
      "https://res.cloudinary.com/note.pdf"
    );
    expect(resolveFileUrl("/uploads/notes/a.pdf")).toBe(
      `${import.meta.env.VITE_BACKEND_URL}/uploads/notes/a.pdf`
    );
  });

  it("maps known subjects and still returns a color for unknown names", () => {
    expect(getSubjectColor("DBMS").tagColor).toBe("#4A9E47");
    expect(getSubjectColor("Mystery Subject").bg).toBeTruthy();
  });

  it("formats relative dates", () => {
    expect(formatDate(new Date())).toBe("Today");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatDate(yesterday)).toBe("Yesterday");
  });

  it("exposes the original semester and type filters", () => {
    expect(SEMESTERS[0]).toBe("All");
    expect(NOTE_TYPES.map((t) => t.key)).toEqual([
      "all",
      "pyq",
      "handwritten",
      "typed",
      "diagrams",
    ]);
  });
});
