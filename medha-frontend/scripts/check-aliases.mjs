import { findTopicMatch, SUBJECTS, expandSearchTerms } from "../src/data/subjectCatalog.js";
for (const q of ["mup","mu p","MP","mp","daa","aoa","cg","CG","dsa","dccn","dbms","toc"]) {
  const m = findTopicMatch(q, { subjects: SUBJECTS });
  console.log(q, "=>", m?.subject?.short, "|", m?.subject?.name, "|", expandSearchTerms(q)[0]);
}
