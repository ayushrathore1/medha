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

export const SCHEME = {
  rtu: { id: "rtu", label: "RTU" },
  arya: { id: "arya", label: "RTU · Arya Autonomous" },
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
  "Data Structures and Algorithms": { semester: 3, code: "3CS4-04" },
  "Digital Electronics": { semester: 3, code: "3CS4-05" },
  "Object Oriented Programming": { semester: 3, code: "3CS4-06" },
  "Software Engineering": { semester: 3, code: "3CS4-07" },
  "Python Programming": { semester: 3, code: "Python" },
  ...Object.fromEntries(RTU_SEM5_SUBJECTS.map((s) => [s.name, { semester: 5, code: s.code }])),
};

const EXTRA_UNITS = {
  "Data Structures and Algorithms": [
    { unitNumber: 1, title: "Arrays, Pointers & Recursion", topics: ["Array representations and operations", "Pointers and dynamic memory allocation", "Time and Space complexity, Big-O notation", "Recursion principles, Tower of Hanoi"], videos: [{ videoId: "AT14lCXuMKI", title: "Data Structures & Algorithms | Arrays & Complexity", thumbnail: "https://i.ytimg.com/vi/AT14lCXuMKI/mqdefault.jpg", duration: "30m 10s", channelTitle: "Jenny's Lectures CS IT" }] },
    { unitNumber: 2, title: "Linked Lists, Stacks & Queues", topics: ["Singly, Doubly, and Circular Linked Lists", "Stack operations: Push, Pop, Infix to Postfix", "Queue operations: Linear, Circular, Deque, Priority queue"], videos: [{ videoId: "RDPGLmvpt6Q", title: "Linked List in Data Structures", thumbnail: "https://i.ytimg.com/vi/RDPGLmvpt6Q/mqdefault.jpg", duration: "26m", channelTitle: "Jenny's Lectures CS IT" }] },
    { unitNumber: 3, title: "Trees & Binary Search Trees", topics: ["Binary Tree properties and traversals", "Binary Search Trees: Insertion, Deletion, Search", "AVL Tree rotations", "B-Trees, Heaps"], videos: [{ videoId: "qH6yxkw0s0Y", title: "Binary Search Tree Explained", thumbnail: "https://i.ytimg.com/vi/qH6yxkw0s0Y/mqdefault.jpg", duration: "24m", channelTitle: "Jenny's Lectures CS IT" }] },
    { unitNumber: 4, title: "Graphs & Graph Algorithms", topics: ["Adjacency Matrix and Adjacency List", "BFS and DFS", "Dijkstra and Bellman-Ford", "Kruskal and Prim MST"], videos: [{ videoId: "tWVWeR8JqSk", title: "Graph Algorithms", thumbnail: "https://i.ytimg.com/vi/tWVWeR8JqSk/mqdefault.jpg", duration: "25m", channelTitle: "Jenny's Lectures CS IT" }] },
    { unitNumber: 5, title: "Sorting & Searching", topics: ["Bubble, Selection, Insertion Sort", "Merge Sort, Quick Sort, Heap Sort", "Linear Search, Binary Search", "Hashing and collision resolution"], videos: [{ videoId: "oSQbwlepoCU", title: "Binary Search", thumbnail: "https://i.ytimg.com/vi/oSQbwlepoCU/mqdefault.jpg", duration: "18m", channelTitle: "Jenny's Lectures CS IT" }] },
  ],
  "Digital Electronics": [
    { unitNumber: 1, title: "Number Systems & Boolean Algebra", topics: ["Binary, Octal, Decimal, Hexadecimal", "Complements and binary arithmetic", "Boolean algebra, DeMorgan's laws", "SOP and POS forms"], videos: [{ videoId: "M0ox87LNd60", title: "Number Systems Conversion", thumbnail: "https://i.ytimg.com/vi/M0ox87LNd60/mqdefault.jpg", duration: "23m", channelTitle: "Code Smashers" }] },
    { unitNumber: 2, title: "Karnaugh Map & Logic Minimization", topics: ["2 to 5 variable K-Maps", "Prime implicants", "Don't care conditions", "NAND and NOR implementation"], videos: [{ videoId: "RO5alU6PpSU", title: "Karnaugh Map Simplification", thumbnail: "https://i.ytimg.com/vi/RO5alU6PpSU/mqdefault.jpg", duration: "25m", channelTitle: "Code Smashers" }] },
    { unitNumber: 3, title: "Combinational Logic Circuits", topics: ["Adders and Subtractors", "Multiplexers and Demultiplexers", "Decoders and Encoders", "Parity Generator and Checker"], videos: [{ videoId: "4BQuJ4vM6qE", title: "Multiplexer Design", thumbnail: "https://i.ytimg.com/vi/4BQuJ4vM6qE/mqdefault.jpg", duration: "22m", channelTitle: "Code Smashers" }] },
    { unitNumber: 4, title: "Sequential Logic & Flip Flops", topics: ["Latches vs Flip-Flops", "SR, D, JK, T Flip-Flops", "Shift Registers", "Counters"], videos: [] },
    { unitNumber: 5, title: "Memories & Programmable Logic", topics: ["RAM and ROM families", "PAL, PLA, FPGA", "DAC and ADC converters"], videos: [] },
  ],
  "Object Oriented Programming": [
    { unitNumber: 1, title: "OOP Paradigm & C++ Basics", topics: ["Procedural vs Object-Oriented Programming", "Encapsulation, Abstraction, Inheritance, Polymorphism", "C++ functions and inline functions"], videos: [{ videoId: "j8nAHeVKL08", title: "Object Oriented Programming in C++", thumbnail: "https://i.ytimg.com/vi/j8nAHeVKL08/mqdefault.jpg", duration: "31m", channelTitle: "CodeWithHarry" }] },
    { unitNumber: 2, title: "Classes, Objects & Constructors", topics: ["Class declaration and access specifiers", "Static members", "Friend functions", "Constructors and Destructors"], videos: [] },
    { unitNumber: 3, title: "Inheritance & Polymorphism", topics: ["Types of inheritance", "Function and operator overloading", "Virtual functions and abstract classes", "Early vs late binding"], videos: [] },
    { unitNumber: 4, title: "Templates, Exceptions & Files", topics: ["Function and class templates", "try, catch, throw", "File streams", "STL overview"], videos: [] },
  ],
  "Software Engineering": [
    { unitNumber: 1, title: "Software Process Models", topics: ["Software engineering paradigms", "Waterfall, Prototype, Spiral, Incremental, RAD", "Agile, Scrum, Extreme Programming"], videos: [] },
    { unitNumber: 2, title: "Requirements & Design", topics: ["Software Requirements Specification", "Functional and non-functional requirements", "DFD and use case diagrams", "Cohesion and Coupling"], videos: [] },
    { unitNumber: 3, title: "Testing & Maintenance", topics: ["Verification and Validation", "Black-box and White-box testing", "Unit to Acceptance testing", "Maintenance and reverse engineering"], videos: [] },
  ],
  ...Object.fromEntries(RTU_SEM5_SUBJECTS.map((s) => [s.name, s.units])),
};

function decorateUnits(units = []) {
  return units.map((unit) => {
    const topics = unit.topics || [];
    const videos = unit.videos || [];
    return {
      ...unit,
      slug: slugify(unit.title),
      topicCount: topics.length,
      videoCount: videos.length,
      resourceCount: topics.length + videos.length + 1,
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

export function tagsForText(text, fallbackScheme, extraLabel) {
  const found = SCHEME_INDEX.get(normalizeTagKey(text));
  if (found?.length) return found;
  if (fallbackScheme && SCHEME[fallbackScheme]) return [SCHEME[fallbackScheme]];
  const extra = schemeTag(null, extraLabel);
  return extra ? [{ id: extra.id, label: extra.label }] : [];
}

export function tagsForSubject(subject, extraLabel) {
  if (subject?.scheme && SCHEME[subject.scheme]) return [SCHEME[subject.scheme]];
  return tagsForText(subject?.name, null, extraLabel);
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
    label: "Rajasthan Technical University, Kota (RTU)",
    scheme: "rtu",
    year: "III",
    semester: 5,
    storageKey: "medha-rtu-sem5-subject",
  },
  {
    key: "Rajasthan Technical University, Kota (Arya Autonomous)",
    label: "RTU — Arya Autonomous (II Year / III Sem)",
    scheme: "arya",
    year: "II",
    semester: 3,
    storageKey: "medha-arya-sem3-subject",
  },
];

export function getUniversityOption(key) {
  return UNIVERSITY_OPTIONS.find((item) => item.key === key) || null;
}

export function getAcademicContext(user) {
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
  return {
    university,
    storedKey: stored,
    branch,
    course: branch || university ? "B.Tech" : "",
    curriculum: option ? SCHEME[option.scheme]?.label || "" : "",
    year: option?.year || "",
    semester: option?.semester || "",
    scheme: option?.scheme || "",
    hasContext: Boolean(university || branch),
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

export function subjectMatchesQuery(subject, query) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return true;
  const schemeLabel = SCHEME[subject.scheme]?.label || "";
  const haystack = [
    subject.name,
    subject.short,
    subject.code,
    subject.course,
    subject.branch,
    semesterLabel(subject.semester),
    yearLabel(subject.semester),
    schemeLabel,
    subject.scheme,
    ...(subject.units || []).flatMap((unit) => [unit.title, ...(unit.topics || [])]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
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

export function findTopicMatch(query) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return null;
  for (const subject of SUBJECTS) {
    if (subject.name.toLowerCase().includes(q) || subject.short.toLowerCase() === q) {
      return { subject, unit: null };
    }
    for (const unit of subject.units) {
      if (unit.title.toLowerCase().includes(q) || unit.topics.some((t) => t.toLowerCase().includes(q))) {
        return { subject, unit };
      }
    }
  }
  return null;
}
