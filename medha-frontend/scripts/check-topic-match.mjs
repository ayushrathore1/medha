import {
  SUBJECTS,
  findTopicMatch,
  resolveSearchQuery,
  subjectMatchesQuery,
  expandSearchTerms,
} from "../src/data/subjectCatalog.js";

const cases = ["inter", "ipc", "os", "OS", "dsa", "aoa", "cd", "itc", "dbms", "oop", "k-map", "pointers"];
for (const q of cases) {
  const m = findTopicMatch(q, { subjects: SUBJECTS });
  const subjectHits = SUBJECTS.filter((s) => subjectMatchesQuery(s, q, SUBJECTS)).map((s) => s.short);
  console.log(
    q,
    "=>",
    m?.subject?.short || "-",
    "|",
    m?.topic || m?.unit?.title || m?.subject?.name || "none",
    "| type",
    m?.matchType || "-",
    "| res",
    resolveSearchQuery(q, SUBJECTS),
    "| expand",
    expandSearchTerms(q, SUBJECTS).slice(0, 2).join("; "),
    "| subjects",
    subjectHits.slice(0, 5).join(",")
  );
}
