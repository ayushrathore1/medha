/**
 * RTU CSE / AIDS past-paper subject map.
 * Folder codes under `medha pyq/{N}sem/{CODE}/` map via SUBJECT_BY_CODE.
 */

const CURRENT_YEAR = new Date().getFullYear();

/** Default year chips when archive is empty (last N calendar years). */
function targetYears(count = 5) {
  const years = [];
  for (let i = 0; i < count; i += 1) years.push(CURRENT_YEAR - i);
  return years;
}

/**
 * Short folder code → subject metadata (slug used in Cloudinary paths).
 * subjectCode values are RTU scheme codes from the syllabus PDFs under
 * `medha pyq/{1,3,5,7}sem/` (not question-paper codes like 1E31xx / 5E17xx).
 */
const SUBJECT_BY_CODE = {
  // Sem 1 / first-year pool — Syllabus-I-Year.pdf
  EM: {
    subjectName: "Engineering Mathematics",
    subjectCode: "1FY2-01",
    slug: "engineering-mathematics",
    semesters: [1, 2],
  },
  EP: {
    subjectName: "Engineering Physics",
    subjectCode: "1FY2-02",
    slug: "engineering-physics",
    semesters: [1, 2],
  },
  EC: {
    subjectName: "Engineering Chemistry",
    subjectCode: "1FY2-03",
    slug: "engineering-chemistry",
    semesters: [1, 2],
  },
  CS: {
    subjectName: "Communication Skills",
    subjectCode: "1FY1-04",
    slug: "communication-skills",
    semesters: [1, 2],
  },
  HV: {
    subjectName: "Human Values",
    subjectCode: "1FY1-05",
    slug: "human-values",
    semesters: [1, 2],
  },
  PPS: {
    subjectName: "Programming for Problem Solving",
    subjectCode: "1FY3-06",
    slug: "pps",
    semesters: [1, 2],
  },
  BME: {
    subjectName: "Basic Mechanical Engineering",
    subjectCode: "1FY3-07",
    slug: "bme",
    semesters: [1, 2],
  },
  BEE: {
    subjectName: "Basic Electrical Engineering",
    subjectCode: "1FY3-08",
    slug: "bee",
    semesters: [1, 2],
  },
  BCE: {
    subjectName: "Basic Civil Engineering",
    subjectCode: "1FY3-09",
    slug: "bce",
    semesters: [1, 2],
  },

  // Sem 3 — CSE scheme (parallel to Syllabus CS III AI: 3CAI* → 3CS*)
  AEM: {
    subjectName: "Advanced Engineering Mathematics",
    subjectCode: "3CS2-01",
    slug: "aem",
    semesters: [3],
  },
  TC: {
    subjectName: "Technical Communication",
    subjectCode: "3CS1-02",
    subjectCodesBySemester: { 3: "3CS1-02", 4: "4CS1-02" },
    slug: "tech-comm",
    semesters: [3, 4],
  },
  MEFA: {
    subjectName: "Managerial Economics and Financial Accounting",
    subjectCode: "3CS1-03",
    subjectCodesBySemester: { 3: "3CS1-03", 4: "4CS1-03" },
    slug: "mefa",
    semesters: [3, 4],
  },
  DE: {
    subjectName: "Digital Electronics",
    subjectCode: "3CS3-04",
    slug: "digital-electronics",
    semesters: [3],
  },
  DSA: {
    subjectName: "Data Structures and Algorithms",
    subjectCode: "3CS4-05",
    slug: "dsa",
    semesters: [3],
  },
  OOPS: {
    subjectName: "Object Oriented Programming",
    subjectCode: "3CS4-06",
    slug: "oop",
    semesters: [3],
  },
  SE: {
    subjectName: "Software Engineering",
    subjectCode: "3CS4-07",
    slug: "software-engineering",
    semesters: [3],
  },

  // Sem 4 — Syllabus-CS.pdf
  DMS: {
    subjectName: "Discrete Mathematics Structure",
    subjectCode: "4CS2-01",
    slug: "dms",
    semesters: [4],
  },
  MP: {
    subjectName: "Microprocessor & Interfaces",
    subjectCode: "4CS3-04",
    slug: "microprocessor",
    semesters: [4],
  },
  DBMS: {
    subjectName: "Database Management System",
    subjectCode: "4CS4-05",
    slug: "dbms",
    semesters: [4],
  },
  TOC: {
    subjectName: "Theory Of Computation",
    subjectCode: "4CS4-06",
    slug: "toc",
    semesters: [4],
  },
  DCCN: {
    subjectName: "Data Communication and Computer Networks",
    subjectCode: "4CS4-07",
    slug: "dccn",
    semesters: [4],
  },

  // Sem 5 — CS.pdf (B.Tech. V Semester CSE)
  ITC: {
    subjectName: "Information Theory and Coding",
    subjectCode: "5CS3-01",
    slug: "itc",
    semesters: [5],
  },
  CD: {
    subjectName: "Compiler Design",
    subjectCode: "5CS4-02",
    slug: "compiler-design",
    semesters: [5],
  },
  OS: {
    // Keep plural to match already-seeded PastPaper.subjectName rows
    subjectName: "Operating Systems",
    subjectCode: "5CS4-03",
    slug: "operating-systems",
    semesters: [5],
  },
  CG: {
    subjectName: "Computer Graphics and Multimedia",
    subjectCode: "5CS4-04",
    slug: "cgmm",
    semesters: [5],
  },
  AOA: {
    subjectName: "Analysis of Algorithms",
    subjectCode: "5CS4-05",
    slug: "aoa",
    semesters: [5],
  },
  WC: {
    subjectName: "Wireless Communication",
    subjectCode: "5CS5-11",
    slug: "wireless-communication",
    semesters: [5],
  },
  // AI / AIDS Sem 5 electives (replace ITC / WC)
  DMC: {
    subjectName: "Data Mining Concepts and Techniques",
    subjectCode: "5E1821",
    slug: "dmc",
    semesters: [5],
  },
  BLOCKCHAIN: {
    subjectName: "Fundamentals of Blockchain",
    subjectCode: "5E1826",
    slug: "blockchain",
    semesters: [5],
  },

  // Sem 6 — CS.pdf (B.Tech. VI Semester CSE)
  DIP: {
    subjectName: "Digital Image Processing",
    subjectCode: "6CS3-01",
    slug: "dip",
    semesters: [6],
  },
  ML: {
    subjectName: "Machine Learning",
    subjectCode: "6CS4-02",
    slug: "machine-learning",
    semesters: [6],
  },
  ISS: {
    subjectName: "Information Security System",
    subjectCode: "6CS4-03",
    slug: "iss",
    semesters: [6],
  },
  CAO: {
    subjectName: "Computer Architecture and Organization",
    subjectCode: "6CS4-04",
    slug: "cao",
    semesters: [6],
  },
  AI: {
    subjectName: "Artificial Intelligence",
    subjectCode: "6CS4-05",
    slug: "ai",
    semesters: [6],
  },
  CC: {
    subjectName: "Cloud Computing",
    subjectCode: "6CS4-06",
    slug: "cloud-computing",
    semesters: [6],
  },
  DS: {
    subjectName: "Distributed System",
    subjectCode: "6CS5-11",
    slug: "distributed-system",
    semesters: [6],
  },
  SDN: {
    subjectName: "Software Defined Network",
    subjectCode: "6CS5-12",
    slug: "sdn",
    semesters: [6],
  },
  EERP: {
    subjectName: "Ecommerce & ERP",
    subjectCode: "6CS5-13",
    slug: "eerp",
    semesters: [6],
  },

  // Sem 7 — Computer Science Engg. VII & VIII Sem.pdf
  IOT: {
    subjectName: "Internet of Things",
    subjectCode: "7CS4-01",
    slug: "iot",
    semesters: [7],
  },
};

function mapSemesterSubjects(codes, semester) {
  return codes.map((code) => {
    const meta = SUBJECT_BY_CODE[code];
    const subjectCode =
      (meta.subjectCodesBySemester && meta.subjectCodesBySemester[semester]) ||
      meta.subjectCode;
    return {
      code,
      ...meta,
      subjectCode,
      semesters: meta.semesters || [semester],
    };
  });
}

const CSE_SUBJECTS_BY_SEMESTER = {
  // Order matches syllabus PDF scheme tables
  1: mapSemesterSubjects(
    ["EM", "EP", "EC", "CS", "HV", "PPS", "BME", "BEE", "BCE"],
    1
  ),
  2: mapSemesterSubjects(
    ["EM", "EP", "EC", "CS", "HV", "PPS", "BME", "BEE", "BCE"],
    2
  ),
  3: mapSemesterSubjects(
    ["AEM", "TC", "MEFA", "DE", "DSA", "OOPS", "SE"],
    3
  ),
  4: mapSemesterSubjects(
    ["DMS", "TC", "MP", "DBMS", "TOC", "DCCN"],
    4
  ),
  5: mapSemesterSubjects(
    ["ITC", "CD", "OS", "CG", "AOA", "WC"],
    5
  ),
  6: mapSemesterSubjects(
    ["DIP", "ML", "ISS", "CAO", "AI", "CC", "DS", "SDN", "EERP"],
    6
  ),
  7: mapSemesterSubjects(["IOT"], 7),
  8: [],
};

/** AI / AIDS reuses CSE map except Sem 5 electives: DMC + Blockchain replace ITC + WC. */
const AIDS_SUBJECTS_BY_SEMESTER = {
  ...CSE_SUBJECTS_BY_SEMESTER,
  5: mapSemesterSubjects(
    ["DMC", "CD", "OS", "CG", "AOA", "BLOCKCHAIN"],
    5
  ),
};

const SUPPORTED_BRANCHES = [
  { id: "CSE", label: "CSE" },
  { id: "AIDS", label: "AI / AIDS" },
  { id: "IT", label: "IT" },
];

/**
 * Sem 5: CSE · AIDS · IT share CD, OS, CG, AOA.
 * Electives differ — CSE/IT use ITC+WC; AIDS uses DMC+Blockchain.
 * Other semesters: IT follows the CSE map until a dedicated IT scheme is seeded.
 */
function subjectsForSemester(semester, branch = "CSE") {
  const sem = Number(semester);
  const raw = String(branch || "CSE")
    .trim()
    .toUpperCase();
  const isAids =
    raw === "AIDS" || raw === "AI" || raw.includes("ARTIFICIAL");
  const map = isAids ? AIDS_SUBJECTS_BY_SEMESTER : CSE_SUBJECTS_BY_SEMESTER;
  return map[sem] || [];
}

function resolveSubjectCode(code, semester) {
  const key = String(code || "")
    .trim()
    .toUpperCase();
  const meta = SUBJECT_BY_CODE[key];
  if (!meta) return null;
  const sem = semester != null ? Number(semester) : null;
  const subjectCode =
    (sem && meta.subjectCodesBySemester && meta.subjectCodesBySemester[sem]) ||
    meta.subjectCode;
  return { code: key, ...meta, subjectCode };
}

module.exports = {
  CURRENT_YEAR,
  targetYears,
  SUBJECT_BY_CODE,
  CSE_SUBJECTS_BY_SEMESTER,
  AIDS_SUBJECTS_BY_SEMESTER,
  SUPPORTED_BRANCHES,
  subjectsForSemester,
  resolveSubjectCode,
};
