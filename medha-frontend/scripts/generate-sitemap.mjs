/**
 * Build public/robots.txt + public/sitemap.xml without importing the React catalog
 * (avoids Node hanging on browser-only modules).
 *
 * Sources:
 *  - medha-backend/data/pastPaperCatalog.js  → branch/sem/subject/year paper URLs
 *  - src/data/{syllabusData,rtuSem5Syllabus,aryaSem3Syllabus}.js → topic search URLs
 *
 * Run: npm run seo:sitemap
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const SITE = (process.env.VITE_SITE_URL || "https://medharevision.shopcampuskart.in").replace(
  /\/$/,
  ""
);

const require = createRequire(import.meta.url);
const paperCatalog = require(join(root, "..", "medha-backend", "data", "pastPaperCatalog.js"));

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absolute(path) {
  return `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
}

function searchPath(query) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  return `/search?${params.toString()}`;
}

/** Pull quoted topic / title strings from syllabus source files. */
function extractQuotedTopics(filePath) {
  const src = readFileSync(filePath, "utf8");
  const topics = new Set();
  // Match topics: ["...", "..."] entries and title: "..."
  const re = /(?:topics:\s*\[|title:\s*|name:\s*|query:\s*|label:\s*)([\s\S]*?)(?=\n\s*(?:unitNumber|code|short|units|\{|\}|\]|,?\s*$))/g;
  // Simpler: all double-quoted strings that look like study topics (length 3–80, letters)
  const stringRe = /"([^"\\]{3,80})"/g;
  let m;
  while ((m = stringRe.exec(src))) {
    const text = m[1].trim();
    if (!text) continue;
    if (/^[a-z0-9-]+$/.test(text) && text.length < 12) continue; // skip codes/slugs
    if (/^\d/.test(text)) continue;
    if (/^(Introduction|Objective)/i.test(text) && text.length < 20) continue;
    topics.add(text);
  }
  void re;
  return [...topics];
}

function extractSubjectBlocks(filePath) {
  const src = readFileSync(filePath, "utf8");
  const subjects = [];
  // "Subject Name": [  OR name: "Subject Name"
  const nameRe = /(?:"([A-Za-z][^"]{2,80})"\s*:\s*\[)|(?:name:\s*"([^"]+)")/g;
  let m;
  while ((m = nameRe.exec(src))) {
    const name = (m[1] || m[2] || "").trim();
    if (!name) continue;
    if (/^(Introduction|Objective|scope)/i.test(name)) continue;
    subjects.push(name);
  }
  return [...new Set(subjects)];
}

function hubUrls() {
  return [
    { path: "/", changefreq: "daily", priority: 1 },
    { path: "/subjects", changefreq: "weekly", priority: 0.9 },
    { path: "/search", changefreq: "daily", priority: 0.9 },
    { path: "/past-papers", changefreq: "daily", priority: 0.95 },
    { path: "/notes", changefreq: "weekly", priority: 0.7 },
  ];
}

function subjectAndTopicUrls() {
  const files = [
    join(root, "src", "data", "syllabusData.js"),
    join(root, "src", "data", "rtuSem5Syllabus.js"),
    join(root, "src", "data", "aryaSem3Syllabus.js"),
    join(root, "src", "data", "subjectCatalog.js"),
  ];
  const urls = [];
  const subjectNames = new Set();
  const topics = new Set();

  for (const file of files) {
    try {
      for (const name of extractSubjectBlocks(file)) subjectNames.add(name);
      for (const topic of extractQuotedTopics(file)) topics.add(topic);
    } catch {
      /* optional file */
    }
  }

  for (const name of subjectNames) {
    const slug = slugify(name);
    if (slug.length < 3) continue;
    urls.push({ path: `/subjects/${slug}`, changefreq: "weekly", priority: 0.85 });
  }

  // Cap topic search URLs so the sitemap stays focused + crawlable
  const preferred = [
    "Binary Search",
    "Quick Sort",
    "Merge Sort",
    "Dijkstra",
    "Normalization",
    "K-Map",
    "Deadlock",
    "Paging",
    "TCP Handshake",
    "AVL Tree",
    "LR parsers",
    "Huffman code",
    "CPU Scheduling",
    "Virtual Functions",
    "BFS and DFS",
    "Knapsack Problem",
    "DSA",
    "OS",
    "DBMS",
    "CN",
    "OOP",
    "TOC",
    "CD",
    "AOA",
  ];
  for (const q of preferred) topics.add(q);

  let count = 0;
  for (const topic of topics) {
    if (count >= 400) break;
    if (topic.length < 3 || topic.length > 70) continue;
    if (/https?:|imagekit|localhost|function |import /i.test(topic)) continue;
    urls.push({ path: searchPath(topic), changefreq: "weekly", priority: 0.75 });
    count += 1;
  }

  // Unit pages: title strings that look like unit titles from syllabus
  let unitCount = 0;
  for (const topic of topics) {
    if (unitCount >= 200) break;
    if (!/&|and |Method|Systems|Logic|Structures|Networks|Programming|Algorithms|Theory/i.test(topic)) {
      continue;
    }
    // Attach to first matching subject slug heuristically via subject list
    for (const name of subjectNames) {
      const slug = slugify(name);
      const unitSlug = slugify(topic);
      if (slug.length < 3 || unitSlug.length < 3) continue;
      urls.push({
        path: `/subjects/${slug}/${unitSlug}`,
        changefreq: "weekly",
        priority: 0.7,
      });
      unitCount += 1;
      break;
    }
  }

  return urls;
}

function paperUrls() {
  const urls = [];
  const years = paperCatalog.targetYears(5);
  for (const branch of paperCatalog.SUPPORTED_BRANCHES) {
    for (let sem = 1; sem <= 8; sem += 1) {
      urls.push({
        path: `/past-papers?branch=${branch.id}&sem=${sem}`,
        changefreq: "weekly",
        priority: 0.85,
      });
      const subjects = paperCatalog.subjectsForSemester(sem, branch.id);
      for (const subject of subjects) {
        const name = encodeURIComponent(subject.subjectName);
        const slug = subject.slug || slugify(subject.subjectName);
        urls.push({
          path: `/past-papers?branch=${branch.id}&sem=${sem}&subject=${name}`,
          changefreq: "weekly",
          priority: 0.8,
        });
        // Also expose subject syllabus page
        urls.push({
          path: `/subjects/${slug}`,
          changefreq: "weekly",
          priority: 0.8,
        });
        for (const year of years) {
          urls.push({
            path: `/past-papers?branch=${branch.id}&sem=${sem}&subject=${name}&year=${year}`,
            changefreq: "monthly",
            priority: 0.77,
          });
        }
      }
    }
  }
  return urls;
}

function mergeUrls(...lists) {
  const map = new Map();
  for (const list of lists) {
    for (const item of list) {
      if (!item?.path) continue;
      map.set(item.path, item);
    }
  }
  return [...map.values()];
}

function writeRobots() {
  const body = `User-agent: *
Allow: /
Allow: /subjects
Allow: /subjects/
Allow: /search
Allow: /past-papers
Allow: /notes
Disallow: /login
Disallow: /register
Disallow: /signup
Disallow: /profile
Disallow: /admin
Disallow: /team-dashboard
Disallow: /dashboard
Disallow: /upload
Disallow: /auth/
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /verify-email
Disallow: /join-team
Disallow: /inside
Disallow: /coming-soon

Sitemap: ${SITE}/sitemap.xml
`;
  writeFileSync(join(publicDir, "robots.txt"), body, "utf8");
}

function writeSitemap(entries) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = entries
    .map((entry) => {
      const loc = escapeXml(absolute(entry.path));
      const priority = Number(entry.priority ?? 0.6).toFixed(1);
      const changefreq = entry.changefreq || "weekly";
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  writeFileSync(join(publicDir, "sitemap.xml"), xml, "utf8");
}

mkdirSync(publicDir, { recursive: true });
const all = mergeUrls(hubUrls(), subjectAndTopicUrls(), paperUrls());
writeRobots();
writeSitemap(all);
console.log(`[seo] Wrote ${all.length} URLs → public/sitemap.xml + robots.txt (${SITE})`);
