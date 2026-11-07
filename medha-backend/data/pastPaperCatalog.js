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

/** Short folder code → subject metadata (slug used in Cloudinary paths). */
const SUBJECT_BY_CODE = {
  // Sem 1 / first-year pool
  EM: {
    subjectName: "Engineering Mathematics",
    subjectCode: "1E3101",
    slug: "engineering-mathematics",
    semesters: [1, 2],
  },
  EP: {
    subjectName: "Engineering Physics",
    subjectCode: "1E3102",
    slug: "engineering-physics",
    semesters: [1, 2],
  },
  EC: {
    subjectName: "Engineering Chemistry",
    subjectCode: "1E3103",
    slug: "engineering-chemistry",
    semesters: [1, 2],
  },
  CS: {
    subjectName: "Communication Skills",
    subjectCode: "1E3104",
    slug: "communication-skills",
    semesters: [1, 2],
  },
  HV: {
    subjectName: "Human Values",
    subjectCode: "1E3105",
    slug: "human-values",
    semesters: [1, 2],
  },
  BEE: {
    subjectName: "Basic Electrical Engineering",
    subjectCode: "1E3106",
    slug: "bee",
    semesters: [1, 2],
  },
  BME: {
    subjectName: "Basic Mechanical Engineering",
    subjectCode: "1E3107",
    slug: "bme",
    semesters: [1, 2],
  },
  BCE: {
    subjectName: "Basic Civil Engineering",
    subjectCode: "1E3109",
    slug: "bce",
    semesters: [1, 2],
  },
  PPS: {
    subjectName: "Programming for Problem Solving",
    subjectCode: "1E3108",
    slug: "pps",
    semesters: [1, 2],
  },

  // Sem 3
  DSA: {
    subjectName: "Data Structures and Algorithms",
    subjectCode: "3E1202",
    slug: "dsa",
    semesters: [3],
  },
  DE: {
    subjectName: "Digital Electronics",
    subjectCode: "3E1203",
    slug: "digital-electronics",
    semesters: [3],
  },
  OOPS: {
    subjectName: "Object Oriented Programming",
    subjectCode: "3E1204",
    slug: "oop",
    semesters: [3],
  },
  SE: {
    subjectName: "Software Engineering",
    subjectCode: "3E1205",
    slug: "software-engineering",
    semesters: [3],
  },
  AEM: {
    subjectName: "Advanced Engineering Mathematics",
    subjectCode: "3E1201",
    slug: "aem",
    semesters: [3],
  },
  MEFA: {
    subjectName: "Managerial Economics and Financial Accounting",
    subjectCode: "3E1200",
    slug: "mefa",
    semesters: [3],
  },
  TC: {
    subjectName: "Technical Communication",
    subjectCode: "3E1250",
    slug: "tech-comm",
    semesters: [3],
  },

  // Sem 5
  AOA: {
    subjectName: "Analysis of Algorithms",
    subjectCode: "5CS4-05",
    slug: "aoa",
    semesters: [5],
  },
  CD: {
    subjectName: "Compiler Design",
    subjectCode: "5CS4-03",
    slug: "compiler-design",
    semesters: [5],
  },
  OS: {
    subjectName: "Operating Systems",
    subjectCode: "5E1753",
    slug: "operating-systems",
    semesters: [5],
  },
  CG: {
    subjectName: "Computer Graphics and Multimedia",
    subjectCode: "5E1754",
    slug: "cgmm",
    semesters: [5],
  },
  ITC: {
    subjectName: "Information Theory and Coding",
    subjectCode: "5CS5-11",
    slug: "itc",
    semesters: [5],
  },
  WC: {
    subjectName: "Wireless Communication",
    subjectCode: "5E1756",
    slug: "wireless-communication",
    semesters: [5],
  },

  // Sem 7
  IOT: {
    subjectName: "Internet of Things",
    subjectCode: "7E1721",
    slug: "iot",
    semesters: [7],
  },
};

const CSE_SUBJECTS_BY_SEMESTER = {
  1: ["EM", "EP", "EC", "CS", "HV", "BEE", "BME", "BCE", "PPS"].map((code) => ({
    code,
    ...SUBJECT_BY_CODE[code],
  })),
  2: ["EM", "EP", "EC", "CS", "HV", "BEE", "BME", "BCE", "PPS"].map((code) => ({
    code,
    ...SUBJECT_BY_CODE[code],
  })),
  3: ["DSA", "DE", "OOPS", "SE", "AEM", "MEFA", "TC"].map((code) => ({
    code,
    ...SUBJECT_BY_CODE[code],
  })),
  4: [],
  5: ["AOA", "CD", "OS", "CG", "ITC", "WC"].map((code) => ({
    code,
    ...SUBJECT_BY_CODE[code],
  })),
  6: [],
  7: ["IOT"].map((code) => ({ code, ...SUBJECT_BY_CODE[code] })),
  8: [],
};

const SUPPORTED_BRANCHES = [
  { id: "CSE", label: "CSE" },
  { id: "AIDS", label: "AI / AIDS" },
];

function subjectsForSemester(semester) {
  const sem = Number(semester);
  return CSE_SUBJECTS_BY_SEMESTER[sem] || [];
}

function resolveSubjectCode(code) {
  const key = String(code || "")
    .trim()
    .toUpperCase();
  return SUBJECT_BY_CODE[key] ? { code: key, ...SUBJECT_BY_CODE[key] } : null;
}

module.exports = {
  CURRENT_YEAR,
  targetYears,
  SUBJECT_BY_CODE,
  CSE_SUBJECTS_BY_SEMESTER,
  SUPPORTED_BRANCHES,
  subjectsForSemester,
  resolveSubjectCode,
};
