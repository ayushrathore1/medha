import SYLLABUS_DATA from "./syllabusData";
import { ARYA_SEM3_SUBJECTS } from "./aryaSem3Syllabus";
import { RTU_SEM5_SUBJECTS } from "./rtuSem5Syllabus";

export function semesterLabel(sem) {
  const n = Number(sem);
  if (n === 1) return "1st Semester";
  if (n === 2) return "2nd Semester";
  if (n === 3) return "3rd Semester";
  return `${n}th Semester`;
}

export function yearLabel(sem) {
  const n = Number(sem);
  if (!n) return "";
  if (n <= 2) return "I Year";
  if (n <= 4) return "II Year";
  if (n <= 6) return "III Year";
  return "IV Year";
}

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Labels intentionally blank — do not surface university/scheme brand tags in UI.
export const SCHEME = {
  rtu: { id: "rtu", label: "" },
  arya: { id: "arya", label: "" },
};

export function schemeTag(id, label) {
  if (id && SCHEME[id]) return SCHEME[id];
  const text = String(label || "").trim();
  if (!text) return null;
  return { id: "other-" + slugify(text), label: text, tone: "other" };
}

function normalizeTagKey(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const PALETTE = [
  { bg: "#DCEFE0", accent: "#3F8F4C", ink: "#1F4D28" },
  { bg: "#F6E3C8", accent: "#C07828", ink: "#6B3E10" },
  { bg: "#E4D7F4", accent: "#7C3AED", ink: "#4C1D95" },
  { bg: "#D7ECF4", accent: "#0F766E", ink: "#134E4A" },
  { bg: "#F8D9D4", accent: "#BE123C", ink: "#881337" },
  { bg: "#E8E4C8", accent: "#A16207", ink: "#713F12" },
  { bg: "#DCE4F8", accent: "#1D4ED8", ink: "#1E3A8A" },
  { bg: "#E2F0D8", accent: "#3F6212", ink: "#365314" },
  { bg: "#F3D9E8", accent: "#BE185D", ink: "#9D174D" },
  { bg: "#D9E8E2", accent: "#0F766E", ink: "#115E59" },
];

const SHORT_NAMES = {
  "Discrete Mathematics Structure": "DMS",
  "Technical Communication": "TC",
  "Microprocessor & Interfaces": "MPI",
  "Database Management System": "DBMS",
  "Theory Of Computation": "TOC",
  "Data Communication & Computer Networks": "CN",
  "Data Structures and Algorithms": "DSA",
  "Digital Electronics": "DE",
  "Object Oriented Programming": "OOP",
  "Software Engineering": "SE",
  "Python Programming": "PY",
  ...Object.fromEntries(RTU_SEM5_SUBJECTS.map((s) => [s.name, s.short])),
};

const META = {
  "Discrete Mathematics Structure": { semester: 4, code: "4CS2-01" },
  "Technical Communication": { semester: 4, code: "4CS1-02" },
  "Microprocessor & Interfaces": { semester: 4, code: "4CS3-04" },
  "Database Management System": { semester: 4, code: "4CS4-05" },
  "Theory Of Computation": { semester: 4, code: "4CS4-06" },
  "Data Communication & Computer Networks": { semester: 4, code: "4CS4-07" },
  "Advanced Engineering Mathematics": { semester: 3, code: "3CS2-01" },
  "Managerial Economics and Financial Accounting": { semester: 3, code: "3CS1-03" },
  "Digital Electronics": { semester: 3, code: "3CS3-04" },
  "Data Structures and Algorithms": { semester: 3, code: "3CS4-05" },
  "Object Oriented Programming": { semester: 3, code: "3CS4-06" },
  "Software Engineering": { semester: 3, code: "3CS4-07" },
  "Python Programming": { semester: 3, code: "Python" },
  ...Object.fromEntries(RTU_SEM5_SUBJECTS.map((s) => [s.name, { semester: 5, code: s.code }])),
};

const EXTRA_UNITS = {
  "Data Structures and Algorithms": [
    { unitNumber: 1, title: "Arrays, Pointers & Recursion", topics: ["Array representations and operations", "Pointers and dynamic memory allocation", "Time and Space complexity, Big-O notation", "Recursion principles, Tower of Hanoi"] },
    { unitNumber: 2, title: "Linked Lists, Stacks & Queues", topics: ["Singly, Doubly, and Circular Linked Lists", "Stack operations: Push, Pop, Infix to Postfix", "Queue operations: Linear, Circular, Deque, Priority queue"] },
    { unitNumber: 3, title: "Trees & Binary Search Trees", topics: ["Binary Tree properties and traversals", "Binary Search Trees: Insertion, Deletion, Search", "AVL Tree rotations", "B-Trees, Heaps"] },
    { unitNumber: 4, title: "Graphs & Graph Algorithms", topics: ["Adjacency Matrix and Adjacency List", "BFS and DFS", "Dijkstra and Bellman-Ford", "Kruskal and Prim MST"] },
    { unitNumber: 5, title: "Sorting & Searching", topics: ["Bubble, Selection, Insertion Sort", "Merge Sort, Quick Sort, Heap Sort", "Linear Search, Binary Search", "Hashing and collision resolution"] },
  ],
  "Digital Electronics": [
    { unitNumber: 1, title: "Number Systems & Boolean Algebra", topics: ["Binary, Octal, Decimal, Hexadecimal", "Complements and binary arithmetic", "Boolean algebra, DeMorgan's laws", "SOP and POS forms"] },
    { unitNumber: 2, title: "Karnaugh Map & Logic Minimization", topics: ["2 to 5 variable K-Maps", "Prime implicants", "Don't care conditions", "NAND and NOR implementation"] },
    { unitNumber: 3, title: "Combinational Logic Circuits", topics: ["Adders and Subtractors", "Multiplexers and Demultiplexers", "Decoders and Encoders", "Parity Generator and Checker"] },
    { unitNumber: 4, title: "Sequential Logic & Flip Flops", topics: ["Latches vs Flip-Flops", "SR, D, JK, T Flip-Flops", "Shift Registers", "Counters"] },
    { unitNumber: 5, title: "Memories & Programmable Logic", topics: ["RAM and ROM families", "PAL, PLA, FPGA", "DAC and ADC converters"] },
  ],
  "Object Oriented Programming": [
    { unitNumber: 1, title: "OOP Paradigm & C++ Basics", topics: ["Procedural vs Object-Oriented Programming", "Encapsulation, Abstraction, Inheritance, Polymorphism", "C++ functions and inline functions"] },
    { unitNumber: 2, title: "Classes, Objects & Constructors", topics: ["Class declaration and access specifiers", "Static members", "Friend functions", "Constructors and Destructors"] },
    { unitNumber: 3, title: "Inheritance & Polymorphism", topics: ["Types of inheritance", "Function and operator overloading", "Virtual functions and abstract classes", "Early vs late binding"] },
    { unitNumber: 4, title: "Templates, Exceptions & Files", topics: ["Function and class templates", "try, catch, throw", "File streams", "STL overview"] },
  ],
  "Software Engineering": [
    { unitNumber: 1, title: "Software Process Models", topics: ["Software engineering paradigms", "Waterfall, Prototype, Spiral, Incremental, RAD", "Agile, Scrum, Extreme Programming"] },
    { unitNumber: 2, title: "Requirements & Design", topics: ["Software Requirements Specification", "Functional and non-functional requirements", "DFD and use case diagrams", "Cohesion and Coupling"] },
    { unitNumber: 3, title: "Testing & Maintenance", topics: ["Verification and Validation", "Black-box and White-box testing", "Unit to Acceptance testing", "Maintenance and reverse engineering"] },
  ],
  ...Object.fromEntries(RTU_SEM5_SUBJECTS.map((s) => [s.name, s.units])),
};

function decorateUnits(units = []) {
  return units.map((unit) => {
    const topics = unit.topics || [];
    const videoCount = Array.isArray(unit.videos) ? unit.videos.length : 0;
    // Strip video ids / URLs from the client bundle — lectures resolve via /api/resources
    const { videos: _videos, ...rest } = unit;
    return {
      ...rest,
      slug: slugify(unit.title),
      topicCount: topics.length,
      videoCount,
      resourceCount: topics.length + videoCount + 1,
    };
  });
}

function buildSubject(name, units, index, extra = {}) {
  const palette = PALETTE[index % PALETTE.length];
  const meta = META[name] || { semester: 4, code: "" };
  const decorated = decorateUnits(units);
  return {
    name,
    slug: extra.slug || slugify(name),
    short: extra.short || SHORT_NAMES[name] || name.split(" ").map((w) => w[0]).join("").slice(0, 4),
    semester: extra.semester ?? meta.semester,
    code: extra.code || meta.code,
    scheme: extra.scheme || "rtu",
    course: extra.course || "B.Tech",
    branch: extra.branch || "CSE",
    color: palette,
    units: decorated,
    topicCount: decorated.reduce((sum, unit) => sum + unit.topicCount, 0),
    unitCount: decorated.length,
  };
}

const fromSyllabus = Object.entries(SYLLABUS_DATA).map(([name, units], i) =>
  buildSubject(name, units, i, { scheme: "rtu" })
);

const extraSubjects = Object.entries(EXTRA_UNITS)
  .filter(([name]) => !SYLLABUS_DATA[name])
  .map(([name, units], i) => buildSubject(name, units, fromSyllabus.length + i, { scheme: "rtu" }));

const aryaSubjects = ARYA_SEM3_SUBJECTS.map((subject, i) =>
  buildSubject(subject.name, subject.units, fromSyllabus.length + extraSubjects.length + i, {
    slug: slugify(`${subject.name}-${subject.code}`),
    short: subject.short,
    semester: 3,
    code: subject.code,
    scheme: "arya",
  })
);

export const SUBJECTS = [...extraSubjects, ...fromSyllabus, ...aryaSubjects].sort((a, b) => {
  if (a.semester !== b.semester) return a.semester - b.semester;
  if (a.name !== b.name) return a.name.localeCompare(b.name);
  return String(a.code).localeCompare(String(b.code));
});

const SCHEME_INDEX = new Map();
for (const subject of SUBJECTS) {
  const tag = SCHEME[subject.scheme];
  if (!tag) continue;
  const add = (text) => {
    const key = normalizeTagKey(text);
    if (!key) return;
    const current = SCHEME_INDEX.get(key) || [];
    if (!current.some((item) => item.id === tag.id)) current.push(tag);
    SCHEME_INDEX.set(key, current);
  };
  add(subject.name);
  add(subject.short);
  add(subject.code);
  for (const unit of subject.units) {
    add(unit.title);
    for (const topic of unit.topics || []) add(topic);
  }
}

export function tagsForText() {
  // Scheme brand tags (RTU / Autonomous) are not shown in the product UI.
  return [];
}

export function tagsForSubject() {
  return [];
}

export const POPULAR_TOPICS = [
  { label: "Binary Search", query: "Binary Search", subject: "Data Structures and Algorithms" },
  { label: "DBMS Normalization", query: "Normalization", subject: "Database Management System" },
  { label: "K-Map", query: "K-Map", subject: "Digital Electronics" },
  { label: "Trees", query: "Binary Search Tree", subject: "Data Structures and Algorithms" },
  { label: "Computer Networks", query: "TCP Handshake", subject: "Data Communication & Computer Networks" },
  { label: "OOP in C++", query: "Virtual Functions", subject: "Object Oriented Programming" },
  { label: "OS Scheduling", query: "CPU Scheduling", subject: "Operating System" },
  { label: "Huffman Coding", query: "Huffman code", subject: "Information Theory & Coding" },
  { label: "LR Parsers", query: "LR parsers", subject: "Compiler Design" },
];

export const RECENT_SEARCH_KEY = "medha_recent_searches_v3";
export const RECENT_SUBJECTS_KEY = "medha_recent_subjects_v1";
export const RECENT_TOPICS_KEY = "medha_recent_topics_v1";
export const FAVOURITE_SUBJECTS_KEY = "medha_favourite_subjects_v1";
export const SELECTED_UNIVERSITY_KEY = "medha-university";
export const CUSTOM_UNIVERSITY_KEY = "medha-custom-university";

export function getSelectedUniversity() {
  try {
    const stored = localStorage.getItem(SELECTED_UNIVERSITY_KEY) || "";
    const custom = localStorage.getItem(CUSTOM_UNIVERSITY_KEY) || "";
    return stored === "Other" ? custom.trim() : stored.trim();
  } catch {
    return "";
  }
}

export const UNIVERSITY_OPTIONS = [
  {
    key: "Rajasthan Technical University, Kota",
    label: "Curriculum · Semester V",
    scheme: "rtu",
    year: "III",
    semester: 5,
    storageKey: "medha-rtu-sem5-subject",
  },
  {
    key: "Rajasthan Technical University, Kota (Arya Autonomous)",
    label: "Curriculum · Semester III",
    scheme: "arya",
    year: "II",
    semester: 3,
    storageKey: "medha-arya-sem3-subject",
  },
];

export function getUniversityOption(key) {
  return UNIVERSITY_OPTIONS.find((item) => item.key === key) || null;
}

function yearToSemester(year) {
  const y = String(year || "").trim().toUpperCase();
  if (!y) return "";
  if (y === "1" || y === "I" || y === "1ST" || y.includes("FIRST")) return 1;
  if (y === "2" || y === "II" || y === "2ND" || y.includes("SECOND")) return 3;
  if (y === "3" || y === "III" || y === "3RD" || y.includes("THIRD")) return 5;
  if (y === "4" || y === "IV" || y === "4TH" || y.includes("FOURTH")) return 7;
  const n = Number(y);
  if (n >= 1 && n <= 4) return n * 2 - 1;
  return "";
}

export function getAcademicContext(user) {
  // Guests: never invent a personal semester/branch from stale localStorage.
  // "Mine" and profile banners require a logged-in account.
  if (!user) {
    return {
      university: "",
      storedKey: "",
      branch: "",
      course: "",
      curriculum: "",
      year: "",
      semester: "",
      scheme: "",
      hasContext: false,
      isGuest: true,
    };
  }

  let stored = "";
  try {
    stored = localStorage.getItem(SELECTED_UNIVERSITY_KEY) || "";
  } catch {
    stored = "";
  }
  const selected = getSelectedUniversity();
  const option = getUniversityOption(stored);
  const university = String(user?.university || "").trim() || selected;
  const branch = String(user?.branch || "").trim() || (option ? "CSE" : "");
  const year = String(user?.year || "").trim() || option?.year || "";
  const semester =
    Number(user?.semester) ||
    option?.semester ||
    yearToSemester(year) ||
    "";
  return {
    university,
    storedKey: stored,
    branch,
    course: branch || university ? "B.Tech" : "",
    curriculum: "",
    year,
    semester,
    scheme: option?.scheme || "",
    hasContext: Boolean(university || branch || semester),
    isGuest: false,
  };
}

export function getCatalogSemesters() {
  return [...new Set(SUBJECTS.map((subject) => Number(subject.semester)))].sort((a, b) => a - b);
}

export function getSubjectByCode(code) {
  return SUBJECTS.find((subject) => subject.code === code) || null;
}

export function catalogStats(list = SUBJECTS) {
  return {
    subjects: list.length,
    units: list.reduce((sum, subject) => sum + (subject.unitCount || 0), 0),
    topics: list.reduce((sum, subject) => sum + (subject.topicCount || 0), 0),
  };
}

export function getSharedTitlePairs() {
  const groups = new Map();
  for (const subject of SUBJECTS) {
    const key = subject.name.toLowerCase();
    const list = groups.get(key) || [];
    list.push(subject);
    groups.set(key, list);
  }
  return [...groups.values()].filter((group) => new Set(group.map((item) => item.scheme)).size > 1);
}

export function topicIsShared(text) {
  const tags = SCHEME_INDEX.get(normalizeTagKey(text)) || [];
  return tags.some((tag) => tag.id === "rtu") && tags.some((tag) => tag.id === "arya");
}

export function searchPath(query, context = {}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (context.code) params.set("code", context.code);
  if (context.unit) params.set("unit", context.unit);
  if (context.scheme) params.set("scheme", context.scheme);
  return `/search?${params.toString()}`;
}

function readSlugList(key, limit = 8) {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(raw) ? raw.slice(0, limit) : [];
  } catch {
    return [];
  }
}

export function getRecentSubjectSlugs() {
  return readSlugList(RECENT_SUBJECTS_KEY, 6);
}

export function saveRecentSubject(slug) {
  const next = [slug, ...getRecentSubjectSlugs().filter((item) => item !== slug)].slice(0, 6);
  localStorage.setItem(RECENT_SUBJECTS_KEY, JSON.stringify(next));
}

export function getFavouriteSubjectSlugs() {
  return readSlugList(FAVOURITE_SUBJECTS_KEY, 40);
}

export function toggleFavouriteSubject(slug) {
  const current = getFavouriteSubjectSlugs();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [slug, ...current];
  localStorage.setItem(FAVOURITE_SUBJECTS_KEY, JSON.stringify(next));
  return next;
}

export function getRecentTopics() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_TOPICS_KEY) || "[]");
    return Array.isArray(raw) ? raw.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export function saveRecentTopic(entry) {
  if (!entry?.subjectSlug || !entry?.unitSlug) return;
  const next = [
    entry,
    ...getRecentTopics().filter(
      (item) => !(item.subjectSlug === entry.subjectSlug && item.unitSlug === entry.unitSlug)
    ),
  ].slice(0, 6);
  localStorage.setItem(RECENT_TOPICS_KEY, JSON.stringify(next));
}

export function getSubjectsBySlugs(slugs = []) {
  return slugs.map(getSubjectBySlug).filter(Boolean);
}

export function getSubjectBySlug(slug) {
  return SUBJECTS.find((s) => s.slug === slug) || null;
}

export function getUnitBySlug(subjectSlug, unitSlug) {
  const subject = getSubjectBySlug(subjectSlug);
  if (!subject) return { subject: null, unit: null };
  const unit = subject.units.find((u) => u.slug === unitSlug) || null;
  return { subject, unit };
}

export function getRecentSearches() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || "[]");
    return Array.isArray(raw) ? raw.slice(0, 8) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query) {
  const trimmed = String(query || "").trim();
  if (!trimmed) return;
  const next = [trimmed, ...getRecentSearches().filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
  localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_SEARCH_KEY);
  } catch {
    /* ignore */
  }
  return [];
}

/** Topic / concept shorthand → syllabus phrases. */
export const TOPIC_ALIASES = {
  ipc: ["inter-process communication", "interprocess communication", "inter process communication"],
  inter: ["inter-process communication"],
  "inter process": ["inter-process communication"],
  interprocess: ["inter-process communication"],
  mutex: ["mutual exclusion"],
  "cpu scheduling": ["process scheduling and algorithms", "cpu scheduling"],
  "process scheduling": ["process scheduling and algorithms"],
  thrashing: ["thrashing"],
  paging: ["paging", "demand paging", "page replacement"],
  "virtual memory": ["virtual memory"],
  deadlock: ["deadlock detection", "deadlock avoidance", "deadlock prevention"],
  bst: ["binary search trees", "binary search tree"],
  "binary tree": ["binary tree properties and traversals", "binary search trees"],
  dfs: ["bfs and dfs", "depth first"],
  bfs: ["bfs and dfs", "breadth first"],
  mst: ["kruskal and prim mst", "minimum spanning"],
  dijkstra: ["dijkstra and bellman-ford"],
  oops: ["object oriented programming", "oop paradigm"],
  oop: ["object oriented programming"],
  "o o p": ["object oriented programming"],
  "oo ps": ["object oriented programming"],
  dbms: ["database management system"],
  db: ["database management system"],
  database: ["database management system"],
  os: ["operating system"],
  "o s": ["operating system"],
  dsa: ["data structures and algorithms"],
  ds: ["data structures and algorithms"],
  "d s a": ["data structures and algorithms"],
  "data structures": ["data structures and algorithms"],
  aoa: ["analysis of algorithms"],
  daa: ["analysis of algorithms"],
  "a o a": ["analysis of algorithms"],
  "d a a": ["analysis of algorithms"],
  "algo": ["analysis of algorithms"],
  algorithms: ["analysis of algorithms"],
  "analysis of algorithms": ["analysis of algorithms"],
  cgmm: ["computer graphics & multimedia", "computer graphics and multimedia"],
  cg: ["computer graphics & multimedia", "computer graphics and multimedia"],
  "c g": ["computer graphics & multimedia", "computer graphics and multimedia"],
  "c g m m": ["computer graphics & multimedia", "computer graphics and multimedia"],
  graphics: ["computer graphics & multimedia", "computer graphics and multimedia"],
  "computer graphics": ["computer graphics & multimedia", "computer graphics and multimedia"],
  cd: ["compiler design"],
  "c d": ["compiler design"],
  compiler: ["compiler design"],
  itc: ["information theory & coding", "information theory and coding"],
  "i t c": ["information theory & coding", "information theory and coding"],
  "info theory": ["information theory & coding", "information theory and coding"],
  wc: ["wireless communication"],
  "w c": ["wireless communication"],
  wireless: ["wireless communication"],
  mpi: ["microprocessor & interfaces", "microprocessor and interfaces"],
  mp: ["microprocessor & interfaces", "microprocessor and interfaces"],
  mup: ["microprocessor & interfaces", "microprocessor and interfaces"],
  "mu p": ["microprocessor & interfaces", "microprocessor and interfaces"],
  "m p": ["microprocessor & interfaces", "microprocessor and interfaces"],
  "m u p": ["microprocessor & interfaces", "microprocessor and interfaces"],
  micro: ["microprocessor & interfaces", "microprocessor and interfaces"],
  microprocessor: ["microprocessor & interfaces", "microprocessor and interfaces"],
  "micro processor": ["microprocessor & interfaces", "microprocessor and interfaces"],
  dms: ["discrete mathematics structure"],
  "d m s": ["discrete mathematics structure"],
  discrete: ["discrete mathematics structure"],
  "discrete maths": ["discrete mathematics structure"],
  "discrete math": ["discrete mathematics structure"],
  cn: ["data communication & computer networks", "computer networks"],
  dccn: ["data communication & computer networks", "computer networks"],
  dcnn: ["data communication & computer networks", "computer networks"],
  "d c c n": ["data communication & computer networks", "computer networks"],
  "c n": ["data communication & computer networks", "computer networks"],
  networking: ["data communication & computer networks", "computer networks"],
  networks: ["data communication & computer networks", "computer networks"],
  "computer networks": ["data communication & computer networks", "computer networks"],
  toc: ["theory of computation"],
  "t o c": ["theory of computation"],
  "theory of computation": ["theory of computation"],
  automata: ["theory of computation"],
  se: ["software engineering"],
  "s e": ["software engineering"],
  "soft engg": ["software engineering"],
  "software engg": ["software engineering"],
  de: ["digital electronics"],
  "d e": ["digital electronics"],
  "digi elec": ["digital electronics"],
  "digital elec": ["digital electronics"],
  py: ["python programming"],
  python: ["python programming"],
  tc: ["technical communication"],
  "t c": ["technical communication"],
  "tech comm": ["technical communication"],
  "k map": ["karnaugh map", "2 to 5 variable k-maps"],
  kmap: ["karnaugh map", "2 to 5 variable k-maps"],
  "k-map": ["karnaugh map", "2 to 5 variable k-maps"],
  normalization: ["normalization"],
  "er diagram": ["er model", "entity relationship"],
  tcp: ["tcp handshake", "tcp"],
  udp: ["udp"],
  "osi model": ["osi"],
};

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const INITIAL_STOPWORDS = new Set(["and", "of", "the", "a", "an", "for", "in", "to", "with", "on"]);

/** "Data Communication & Computer Networks" → dccn (skips "and"). */
function nameInitials(name) {
  return tokenize(name)
    .filter((w) => !INITIAL_STOPWORDS.has(w))
    .map((w) => w[0])
    .join("");
}

function uniqStrings(values) {
  const out = [];
  const seen = new Set();
  for (const value of values) {
    const v = String(value || "").toLowerCase().trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function shortLooksLikeCourseCode(short) {
  const s = String(short || "").trim();
  if (!s) return true;
  if (/^\d/.test(s)) return true;
  if (/\d/.test(s) && s.includes("-")) return true;
  return false;
}

/**
 * Global short-form index: hardcoded topic aliases + every subject.short / SHORT_NAMES entry.
 * Pass a live/merged subject list so curriculum shorts stay searchable.
 */
export function buildSearchAliasIndex(subjects = SUBJECTS) {
  const index = Object.create(null);

  const add = (key, ...phrases) => {
    const k = String(key || "").toLowerCase().trim();
    if (!k || shortLooksLikeCourseCode(k)) return;
    index[k] = uniqStrings([...(index[k] || []), ...phrases]);
  };

  for (const [alias, phrases] of Object.entries(TOPIC_ALIASES)) {
    add(alias, ...phrases);
  }

  for (const [name, short] of Object.entries(SHORT_NAMES)) {
    add(short, name);
  }

  for (const subject of subjects || []) {
    const name = subject?.name;
    if (!name) continue;
    add(subject.short, name);
    // Always index initials so DCCN, DBMS-style queries resolve even when short is CN/etc.
    const initials = nameInitials(name);
    if (initials.length >= 2 && initials.length <= 6) add(initials, name);
  }

  // Static catalog names (covers subjects not yet in the live/merged list)
  for (const name of Object.keys(SHORT_NAMES)) {
    const initials = nameInitials(name);
    if (initials.length >= 2 && initials.length <= 6) add(initials, name);
  }

  return index;
}

/** Expand a query into subject names / topic phrases (global short-form support). */
export function expandSearchTerms(query, subjects = SUBJECTS) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return [];
  const index = buildSearchAliasIndex(subjects);
  const compact = q.replace(/\s+/g, " ");
  const nospace = q.replace(/\s+/g, "");
  const tokens = tokenize(q);

  const out = [];
  if (index[q]) out.push(...index[q]);
  if (index[compact]) out.push(...index[compact]);
  // "mu p" / "d a a" / "c g" → mup / daa / cg
  if (nospace && index[nospace]) out.push(...index[nospace]);

  // "os deadlock" / "dsa trees" — expand the leading subject short
  if (tokens.length >= 1 && tokens.length <= 4) {
    if (index[tokens[0]]) out.push(...index[tokens[0]]);
    const leadJoin = tokens.slice(0, Math.min(3, tokens.length)).join("");
    if (leadJoin && index[leadJoin]) out.push(...index[leadJoin]);
  }

  // Exact subject short match from the live list
  for (const subject of subjects || []) {
    const short = String(subject.short || "").toLowerCase().trim();
    if (short && (short === q || short === nospace || short === compact)) {
      out.push(String(subject.name || "").toLowerCase());
    }
  }

  return uniqStrings(out);
}

/** True when `needle` appears as its own token / hyphen-separated word — not inside "pointers". */
function hasWordBoundaryMatch(haystack, needle) {
  if (!needle) return false;
  const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(needle)}(?:[^a-z0-9]|$)`, "i");
  return re.test(haystack);
}

function scoreAgainstText(haystack, query, expansions = []) {
  const hay = String(haystack || "").toLowerCase().trim();
  if (!hay) return 0;
  const hayTokens = tokenize(hay);
  let best = 0;

  const variants = [query, ...expansions]
    .map((v) => String(v || "").toLowerCase().trim())
    .filter(Boolean);

  for (const variant of variants) {
    if (hay === variant) {
      best = Math.max(best, 100);
      continue;
    }
    if (hay.startsWith(variant) && variant.length >= 3) {
      best = Math.max(best, 94);
    }

    const qTokens = tokenize(variant);
    if (!qTokens.length) continue;

    if (qTokens.length === 1) {
      const token = qTokens[0];
      if (hayTokens.includes(token)) best = Math.max(best, 90);
      else if (hayTokens.some((ht) => ht.startsWith(token) && token.length >= 3)) {
        best = Math.max(best, token.length >= 4 ? 78 : 68);
      }
    } else {
      const covered = qTokens.filter((qt) =>
        hayTokens.some((ht) => ht === qt || (qt.length >= 3 && ht.startsWith(qt)))
      ).length;
      if (covered === qTokens.length) best = Math.max(best, 88);
      else if (covered >= Math.ceil(qTokens.length * 0.66)) best = Math.max(best, 70);
    }

    // Substring only with a real word boundary (blocks "inter" ⊂ "pointers")
    if (variant.length >= 3 && hasWordBoundaryMatch(hay, variant)) {
      best = Math.max(best, variant.length >= 6 ? 72 : 64);
    }
  }

  return best;
}

/** Subject list filter — understands OS, DSA, IPC, AOA, and full names. */
export function subjectMatchesQuery(subject, query, allSubjects = SUBJECTS) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return true;
  if (!subject) return false;

  const index = buildSearchAliasIndex(allSubjects);
  const expansions = expandSearchTerms(q, allSubjects);
  const short = String(subject.short || "").toLowerCase().trim();
  const name = String(subject.name || "").toLowerCase().trim();

  if (short && short === q) return true;
  if (name && expansions.includes(name)) return true;

  // Known short forms / aliases: match the expanded subject/topic, not the raw stub
  // (prevents "cd" hitting random subjects, "inter" hitting "Interfaces").
  if (index[q]) {
    for (const unit of subject.units || []) {
      for (const exp of expansions) {
        if (scoreAgainstText(unit.title, exp, []) >= 90) return true;
        for (const topic of unit.topics || []) {
          if (scoreAgainstText(topic, exp, []) >= 90) return true;
        }
      }
    }
    return false;
  }

  const fieldThreshold = q.length <= 5 ? 90 : 64;
  const topicThreshold = q.length <= 5 ? 90 : 70;

  const fields = [subject.name, subject.short, subject.code, subject.course, subject.branch];
  for (const field of fields) {
    if (scoreAgainstText(field, q, expansions) >= fieldThreshold) return true;
  }

  for (const unit of subject.units || []) {
    if (scoreAgainstText(unit.title, q, expansions) >= topicThreshold) return true;
    for (const topic of unit.topics || []) {
      if (scoreAgainstText(topic, q, expansions) >= topicThreshold) return true;
    }
  }
  return false;
}

/**
 * Ranked syllabus hits for a library query.
 * Pass `subjects` (e.g. merged curriculum list) for global short-form coverage.
 */
export function findTopicMatches(query, { limit = 5, subjects = SUBJECTS } = {}) {
  const raw = String(query || "").trim();
  if (!raw) return [];
  const list = Array.isArray(subjects) && subjects.length ? subjects : SUBJECTS;
  const q = raw.toLowerCase();
  const expansions = expandSearchTerms(q, list);
  const hits = [];

  for (const subject of list) {
    const short = String(subject.short || "").toLowerCase().trim();
    const exactShort = short && short === q;

    const subjectScore = exactShort
      ? 120
      : Math.max(
          scoreAgainstText(subject.name, q, expansions),
          scoreAgainstText(subject.short, q, expansions) >= 90
            ? 110
            : scoreAgainstText(subject.short, q, expansions),
          scoreAgainstText(subject.code, q, expansions),
          expansions.includes(String(subject.name || "").toLowerCase()) ? 108 : 0
        );

    if (subjectScore >= 88) {
      hits.push({
        subject,
        unit: null,
        topic: null,
        score: subjectScore,
        matchType: "subject",
        expansions,
      });
    }

    // Exact subject short → don't drown the subject hit with weak topic noise
    if (exactShort) continue;

    for (const unit of subject.units || []) {
      const unitScore = scoreAgainstText(unit.title, q, expansions);
      if (unitScore >= 64) {
        hits.push({
          subject,
          unit,
          topic: null,
          score: unitScore + 2,
          matchType: "unit",
          expansions,
        });
      }
      for (const topic of unit.topics || []) {
        const topicScore = scoreAgainstText(topic, q, expansions);
        if (topicScore >= 64) {
          hits.push({
            subject,
            unit,
            topic,
            score: topicScore + 6,
            matchType: "topic",
            expansions,
          });
        }
      }
    }
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const rank = { subject: 0, topic: 1, unit: 2 };
    // Prefer subject hits when query is a subject short/name; else prefer topics
    const qIsSubjectish = expansions.some(Boolean) && a.matchType === "subject";
    if (qIsSubjectish || b.matchType === "subject") {
      return (rank[a.matchType] ?? 9) - (rank[b.matchType] ?? 9);
    }
    const topicFirst = { topic: 0, unit: 1, subject: 2 };
    return (topicFirst[a.matchType] ?? 9) - (topicFirst[b.matchType] ?? 9);
  });

  const seen = new Set();
  const unique = [];
  for (const hit of hits) {
    const key = `${hit.subject.slug}|${hit.unit?.slug || ""}|${hit.topic || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(hit);
    if (unique.length >= limit) break;
  }
  return unique;
}

export function findTopicMatch(query, subjectsOrOpts) {
  const opts = Array.isArray(subjectsOrOpts)
    ? { subjects: subjectsOrOpts, limit: 1 }
    : { ...(subjectsOrOpts || {}), limit: 1 };
  const [best] = findTopicMatches(query, opts);
  return best || null;
}

/** Query string to send to the resource API (prefer resolved syllabus topic / alias). */
export function resolveSearchQuery(query, subjects = SUBJECTS) {
  const raw = String(query || "").trim();
  if (!raw) return "";
  const list = Array.isArray(subjects) && subjects.length ? subjects : SUBJECTS;
  const match = findTopicMatch(raw, { subjects: list });
  if (match?.topic) return match.topic;
  const expansions = expandSearchTerms(raw.toLowerCase(), list);
  if (match?.matchType === "subject" && match.subject?.name) return match.subject.name;
  if (expansions[0]) return expansions[0];
  if (match?.unit?.title) return match.unit.title;
  if (match?.subject?.name) return match.subject.name;
  return raw;
}
