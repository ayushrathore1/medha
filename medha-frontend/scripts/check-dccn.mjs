import { findTopicMatch, expandSearchTerms, subjectMatchesQuery, SUBJECTS, resolveSearchQuery } from "../src/data/subjectCatalog.js";
for (const q of ["dccn", "DCCN", "cn", "CN"]) {
  const m = findTopicMatch(q, { subjects: SUBJECTS });
  const hits = SUBJECTS.filter(s => subjectMatchesQuery(s, q, SUBJECTS)).map(s => s.short);
  console.log(q, "=>", m?.subject?.short, m?.subject?.name, "| expand", expandSearchTerms(q).slice(0,2).join("; "), "| subjects", hits.join(","), "| res", resolveSearchQuery(q));
}
