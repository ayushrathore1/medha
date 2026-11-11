import { POPULAR_TOPICS, SUBJECTS, searchPath, slugify } from "./subjectCatalog";

const BRANCHES = ["CSE", "AIDS"];
const PAPER_YEARS = () => {
  const y = new Date().getFullYear();
  return [y, y - 1, y - 2, y - 3, y - 4];
};

/**
 * Static indexable URLs for sitemap + Search Console.
 * Topics → /search?q=… · Units → /subjects/:slug/:unit · Papers → /past-papers?…
 */
export function collectSeoUrls() {
  const urls = new Map();
  const add = (path, { changefreq = "weekly", priority = 0.6 } = {}) => {
    if (!path) return;
    urls.set(path, { path, changefreq, priority });
  };

  add("/", { changefreq: "daily", priority: 1 });
  add("/subjects", { changefreq: "weekly", priority: 0.9 });
  add("/search", { changefreq: "daily", priority: 0.9 });
  add("/past-papers", { changefreq: "daily", priority: 0.95 });
  add("/notes", { changefreq: "weekly", priority: 0.7 });

  for (const subject of SUBJECTS) {
    add(`/subjects/${subject.slug}`, { priority: 0.85 });
    for (const unit of subject.units || []) {
      if (unit?.slug) {
        add(`/subjects/${subject.slug}/${unit.slug}`, { priority: 0.8 });
      }
      for (const topic of unit.topics || []) {
        const label = typeof topic === "string" ? topic : topic?.title;
        if (!label) continue;
        add(searchPath(label, { code: subject.code }), { priority: 0.75 });
      }
    }
  }

  for (const topic of POPULAR_TOPICS) {
    add(searchPath(topic.query || topic.label), { priority: 0.8 });
  }

  // High-intent short queries students type into Google
  const aliases = [
    "DSA",
    "OS",
    "DBMS",
    "CN",
    "OOP",
    "TOC",
    "CD",
    "AOA",
    "Quick Sort",
    "Dijkstra",
    "Normalization",
    "Paging",
    "TCP Handshake",
    "K-Map",
    "AVL Tree",
    "LR parsers",
    "Deadlock",
    "Binary Search",
  ];
  for (const q of aliases) add(searchPath(q), { priority: 0.78 });

  const years = PAPER_YEARS();
  for (const branch of BRANCHES) {
    for (let sem = 1; sem <= 8; sem += 1) {
      add(`/past-papers?branch=${branch}&sem=${sem}`, { priority: 0.85 });
      const semSubjects = SUBJECTS.filter((s) => Number(s.semester) === sem);
      for (const subject of semSubjects) {
        const subjectQ = encodeURIComponent(subject.name);
        add(
          `/past-papers?branch=${branch}&sem=${sem}&subject=${subjectQ}`,
          { priority: 0.8 }
        );
        for (const year of years) {
          add(
            `/past-papers?branch=${branch}&sem=${sem}&subject=${subjectQ}&year=${year}`,
            { priority: 0.77 }
          );
        }
      }
    }
  }

  return [...urls.values()];
}

export function topicSearchPath(topic, subjectCode) {
  return searchPath(topic, subjectCode ? { code: subjectCode } : {});
}

export function paperPath({ branch = "CSE", sem = 3, subject, year } = {}) {
  const params = new URLSearchParams();
  params.set("branch", String(branch).toUpperCase());
  params.set("sem", String(sem));
  if (subject) params.set("subject", subject);
  if (year) params.set("year", String(year));
  return `/past-papers?${params.toString()}`;
}

export { slugify };
