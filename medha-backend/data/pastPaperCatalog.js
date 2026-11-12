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
    semesters: [7, 8],
  },

  // IT-specific codes
  POC: {
    subjectName: "Principles of Communication",
    subjectCode: "4IT4-04",
    slug: "poc",
    semesters: [4],
  },
  STPM: {
    subjectName: "Software Testing and Project Management",
    subjectCode: "5IT5-12",
    slug: "stpm",
    semesters: [5],
  },
  BDA: {
    subjectName: "Big Data Analytics",
    subjectCode: "7IT4-01",
    slug: "bda",
    semesters: [7],
  },

  // Shared / non-clashing ECE·EE·ME folder codes
  DSD: {
    subjectName: "Digital System Design",
    subjectCode: "3EC4-04",
    slug: "digital-system-design",
    semesters: [3],
  },
  NT: {
    subjectName: "Network Theory",
    subjectCode: "3EC4-06",
    slug: "network-theory",
    semesters: [3],
  },
  SAS: {
    subjectName: "Signals and Systems",
    subjectCode: "3EC4-05",
    subjectCodesBySemester: { 3: "3EC4-05", 4: "4EE4-07" },
    slug: "signals-and-systems",
    semesters: [3, 4],
  },
  AEM2: {
    subjectName: "Advanced Engineering Mathematics II",
    subjectCode: "4EC2-01",
    slug: "aem-2",
    semesters: [4],
  },
  AC: {
    subjectName: "Analog Circuits",
    subjectCode: "4EC4-04",
    slug: "analog-circuits",
    semesters: [4],
  },
  ADC: {
    subjectName: "Analog and Digital Communication",
    subjectCode: "4EC4-07",
    slug: "analog-digital-communication",
    semesters: [4],
  },
  MCU: {
    subjectName: "Microcontrollers",
    subjectCode: "4EC4-05",
    slug: "microcontrollers",
    semesters: [4],
  },
  EMI: {
    subjectName: "Electronics Measurement and Instrumentation",
    subjectCode: "4EC3-06",
    subjectCodesBySemester: { 4: "4EC3-06" },
    slug: "emi",
    semesters: [4],
  },
  CA: {
    subjectName: "Computer Architecture",
    subjectCode: "5EC3-01",
    subjectCodesBySemester: { 5: "5EC3-01", 6: "6EE3-01" },
    slug: "computer-architecture",
    semesters: [5, 6],
  },
  DSP: {
    subjectName: "Digital Signal Processing",
    subjectCode: "5EC4-04",
    slug: "digital-signal-processing",
    semesters: [5],
  },
  ES: {
    subjectName: "Embedded Systems",
    subjectCode: "5EC5-12",
    slug: "embedded-systems",
    semesters: [5],
  },
  EW: {
    subjectName: "Electromagnetics Waves",
    subjectCode: "5EC4-02",
    slug: "electromagnetics-waves",
    semesters: [5],
  },
  MTT: {
    subjectName: "Microwave Theory and Techniques",
    subjectCode: "5EC4-05",
    slug: "microwave-theory",
    semesters: [5],
  },
  SC: {
    subjectName: "Satellite Communication",
    subjectCode: "5EC5-14",
    slug: "satellite-communication",
    semesters: [5],
  },
  AP: {
    subjectName: "Antennas and Propagation",
    subjectCode: "6EC4-04",
    slug: "antennas-and-propagation",
    semesters: [6],
  },
  CN: {
    subjectName: "Computer Network",
    subjectCode: "6EC4-02",
    slug: "computer-network",
    semesters: [6],
  },
  FOC: {
    subjectName: "Fiber Optics Communications",
    subjectCode: "6EC4-03",
    slug: "fiber-optics-communications",
    semesters: [6],
  },
  MEMS: {
    subjectName: "Introduction to MEMS",
    subjectCode: "6EC5-11",
    slug: "mems",
    semesters: [6],
  },
  CMOS: {
    subjectName: "CMOS Design",
    subjectCode: "7EC5-13",
    slug: "cmos-design",
    semesters: [7],
  },
  VLSI: {
    subjectName: "VLSI Design",
    subjectCode: "7EC5-11",
    slug: "vlsi-design",
    semesters: [7],
  },
  IPPR: {
    subjectName: "Digital Image and Video Processing",
    subjectCode: "8EC5-12",
    slug: "digital-image-video-processing",
    semesters: [8],
  },

  // EE-only (non-clashing folder codes)
  EM1: {
    subjectName: "Electrical Machine I",
    subjectCode: "3EE4-07",
    slug: "electrical-machine-1",
    semesters: [3],
  },
  EMF: {
    subjectName: "Electromagnetic Fields",
    subjectCode: "3EE4-08",
    slug: "electromagnetic-fields",
    semesters: [3],
  },
  PGP: {
    subjectName: "Power Generation Processes",
    subjectCode: "3EE3-04",
    slug: "power-generation-processes",
    semesters: [3],
  },
  BIO: {
    subjectName: "Biology",
    subjectCode: "4EE2-01",
    slug: "biology",
    semesters: [4],
  },
  EM2: {
    subjectName: "Electrical Machines II",
    subjectCode: "4EE4-05",
    slug: "electrical-machine-2",
    semesters: [4],
  },
  PE: {
    subjectName: "Power Electronics",
    subjectCode: "4EE4-06",
    slug: "power-electronics",
    semesters: [4],
  },
  EMAT: {
    subjectName: "Electrical Materials",
    subjectCode: "5EE3-01",
    slug: "electrical-materials",
    semesters: [5],
  },
  PS1: {
    subjectName: "Power System I",
    subjectCode: "5EE4-02",
    slug: "power-system-1",
    semesters: [5],
  },
  EMD: {
    subjectName: "Electrical Machine Design",
    subjectCode: "5EE4-05",
    slug: "electrical-machine-design",
    semesters: [5],
  },
  RPS: {
    subjectName: "Restructured Power System",
    subjectCode: "5EE5-11",
    slug: "restructured-power-system",
    semesters: [5],
  },
  PS2: {
    subjectName: "Power System II",
    subjectCode: "6EE4-02",
    slug: "power-system-2",
    semesters: [6],
  },
  PSP: {
    subjectName: "Power System Protection",
    subjectCode: "6EE4-03",
    slug: "power-system-protection",
    semesters: [6],
  },
  EECA: {
    subjectName: "Electrical Energy Conservation and Auditing",
    subjectCode: "6EE4-04",
    slug: "electrical-energy-conservation",
    semesters: [6],
  },
  PSPL: {
    subjectName: "Power System Planning",
    subjectCode: "6EE5-11",
    slug: "power-system-planning",
    semesters: [6],
  },
  WSES: {
    subjectName: "Wind and Solar Energy Systems",
    subjectCode: "7EE5-11",
    slug: "wind-solar-energy",
    semesters: [7],
  },
  PQF: {
    subjectName: "Power Quality and FACTS",
    subjectCode: "7EE4-12",
    slug: "power-quality-facts",
    semesters: [7],
  },
  EHV: {
    subjectName: "HVDC Transmission System",
    subjectCode: "8EE4-11",
    slug: "hvdc-transmission",
    semesters: [8],
  },
  EDC: {
    subjectName: "Advanced Electric Drives",
    subjectCode: "8EE4-13",
    slug: "advanced-electric-drives",
    semesters: [8],
  },

  // ME-only (non-clashing folder codes)
  ETD: {
    subjectName: "Engineering Thermodynamics",
    subjectCode: "3ME4-05",
    slug: "engineering-thermodynamics",
    semesters: [3],
  },
  MOS: {
    subjectName: "Mechanics of Solids",
    subjectCode: "3ME4-07",
    slug: "mechanics-of-solids",
    semesters: [3],
  },
  MSE: {
    subjectName: "Material Science and Engineering",
    subjectCode: "3ME4-06",
    slug: "material-science",
    semesters: [3],
  },
  DA: {
    subjectName: "Data Analytics",
    subjectCode: "4ME2-01",
    slug: "data-analytics",
    semesters: [4],
  },
  FMFM: {
    subjectName: "Fluid Mechanics and Fluid Machines",
    subjectCode: "4ME4-05",
    slug: "fluid-mechanics-machines",
    semesters: [4],
  },
  TOM: {
    subjectName: "Theory of Machines",
    subjectCode: "4ME4-06",
    slug: "theory-of-machines",
    semesters: [4],
  },
  MS: {
    subjectName: "Mechatronic Systems",
    subjectCode: "5ME3-01",
    slug: "mechatronic-systems",
    semesters: [5],
  },
  HT: {
    subjectName: "Heat Transfer",
    subjectCode: "5ME4-02",
    slug: "heat-transfer",
    semesters: [5],
  },
  MT: {
    subjectName: "Manufacturing Technology",
    subjectCode: "5ME4-03",
    slug: "manufacturing-technology",
    semesters: [5],
  },
  DME1: {
    subjectName: "Design of Machine Elements I",
    subjectCode: "5ME4-04",
    slug: "design-machine-elements-1",
    semesters: [5],
  },
  POM: {
    subjectName: "Principles of Management",
    subjectCode: "5ME4-05",
    slug: "principles-of-management",
    semesters: [5],
  },
  NDET: {
    subjectName: "Non Destructive Evaluation and Testing",
    subjectCode: "5ME5-12",
    slug: "ndet",
    semesters: [5],
  },
  MM: {
    subjectName: "Measurement and Metrology",
    subjectCode: "6ME3-01",
    slug: "measurement-metrology",
    semesters: [6],
  },
  CIMS: {
    subjectName: "Computer Integrated Manufacturing Systems",
    subjectCode: "6ME4-02",
    slug: "cims",
    semesters: [6],
  },
  MV: {
    subjectName: "Mechanical Vibrations",
    subjectCode: "6ME4-03",
    slug: "mechanical-vibrations",
    semesters: [6],
  },
  DME2: {
    subjectName: "Design of Machine Elements II",
    subjectCode: "6ME4-04",
    slug: "design-machine-elements-2",
    semesters: [6],
  },
  QM: {
    subjectName: "Quality Management",
    subjectCode: "6ME4-05",
    slug: "quality-management",
    semesters: [6],
  },
  RAC: {
    subjectName: "Refrigeration and Air Conditioning",
    subjectCode: "6ME5-11",
    slug: "rac",
    semesters: [6],
  },
  NMM: {
    subjectName: "Newer Machining Methods",
    subjectCode: "6ME5-12",
    slug: "newer-machining-methods",
    semesters: [6],
  },
  ICE: {
    subjectName: "IC Engines",
    subjectCode: "7ME5-11",
    slug: "ic-engines",
    semesters: [7],
  },
  OR: {
    subjectName: "Operations Research",
    subjectCode: "7ME5-12",
    slug: "operations-research",
    semesters: [7],
  },
  TM: {
    subjectName: "Turbomachines",
    subjectCode: "7ME5-13",
    slug: "turbomachines",
    semesters: [7],
  },
  OM: {
    subjectName: "Operations Management",
    subjectCode: "8ME5-11",
    slug: "operations-management",
    semesters: [8],
  },
};

/**
 * Short codes that collide across branches (CS, EM, MP, …).
 * Checked before SUBJECT_BY_CODE in resolveSubjectCode / mapSemesterSubjects.
 */
const BRANCH_CODE_OVERRIDES = {
  ECE: {
    CS: {
      subjectName: "Control System",
      subjectCode: "5EC4-03",
      slug: "control-system",
      semesters: [5],
    },
    BME: {
      subjectName: "Bio-Medical Electronics",
      subjectCode: "5EC5-11",
      slug: "bio-medical-electronics",
      semesters: [5],
    },
    ED: {
      subjectName: "Electronic Devices",
      subjectCode: "3EC4-07",
      slug: "electronic-devices",
      semesters: [3],
    },
    AEM: {
      subjectName: "Advanced Engineering Mathematics",
      subjectCode: "3EC2-01",
      slug: "aem",
      semesters: [3],
    },
    TC: {
      subjectName: "Technical Communication",
      subjectCode: "3EC1-02",
      subjectCodesBySemester: { 3: "3EC1-02", 4: "4EC1-02" },
      slug: "tech-comm",
      semesters: [3, 4],
    },
    MEFA: {
      subjectName: "Managerial Economics and Financial Accounting",
      subjectCode: "3EC1-03",
      subjectCodesBySemester: { 3: "3EC1-03", 4: "4EC1-03" },
      slug: "mefa",
      semesters: [3, 4],
    },
  },
  EE: {
    AE: {
      subjectName: "Analog Electronics",
      subjectCode: "3EE4-06",
      slug: "analog-electronics",
      semesters: [3],
    },
    CS: {
      subjectName: "Control System",
      subjectCode: "5EE4-03",
      slug: "control-system",
      semesters: [5],
    },
    MP: {
      subjectName: "Microprocessor",
      subjectCode: "5EE4-04",
      slug: "microprocessor",
      semesters: [5],
    },
    ED: {
      subjectName: "Electrical Drives",
      subjectCode: "6EE4-05",
      slug: "electrical-drives",
      semesters: [6],
    },
    DE: {
      subjectName: "Digital Electronics",
      subjectCode: "4EE4-08",
      slug: "digital-electronics",
      semesters: [4],
    },
    EMI: {
      subjectName: "Electronic Measurement and Instrumentation",
      subjectCode: "4EE3-04",
      slug: "emi",
      semesters: [4],
    },
    AEM: {
      subjectName: "Advanced Engineering Mathematics",
      subjectCode: "3EE2-01",
      slug: "aem",
      semesters: [3],
    },
    TC: {
      subjectName: "Technical Communication",
      subjectCode: "3EE1-02",
      subjectCodesBySemester: { 3: "3EE1-02", 4: "4EE1-02" },
      slug: "tech-comm",
      semesters: [3, 4],
    },
    MEFA: {
      subjectName: "Managerial Economics and Financial Accounting",
      subjectCode: "3EE1-03",
      subjectCodesBySemester: { 3: "3EE1-03", 4: "4EE1-03" },
      slug: "mefa",
      semesters: [3, 4],
    },
  },
  ME: {
    EM: {
      subjectName: "Engineering Mechanics",
      subjectCode: "3ME3-04",
      slug: "engineering-mechanics",
      semesters: [3],
    },
    MP: {
      subjectName: "Manufacturing Process",
      subjectCode: "4ME4-04",
      slug: "manufacturing-process",
      semesters: [4],
    },
    SE: {
      subjectName: "Steam Engineering",
      subjectCode: "5ME5-11",
      slug: "steam-engineering",
      semesters: [5],
    },
    AE: {
      subjectName: "Automobile Engineering",
      subjectCode: "5ME5-12",
      slug: "automobile-engineering",
      semesters: [5],
    },
    DE: {
      subjectName: "Digital Electronics",
      subjectCode: "4ME3-04",
      slug: "digital-electronics",
      semesters: [4],
    },
    AEM: {
      subjectName: "Advanced Engineering Mathematics",
      subjectCode: "3ME2-01",
      slug: "aem",
      semesters: [3],
    },
    TC: {
      subjectName: "Technical Communication",
      subjectCode: "3ME1-02",
      subjectCodesBySemester: { 3: "3ME1-02", 4: "4ME1-02" },
      slug: "tech-comm",
      semesters: [3, 4],
    },
    MEFA: {
      subjectName: "Managerial Economics and Financial Accounting",
      subjectCode: "3ME1-03",
      subjectCodesBySemester: { 3: "3ME1-03", 4: "4ME1-03" },
      slug: "mefa",
      semesters: [3, 4],
    },
  },
};

function mapSemesterSubjects(codes, semester, branch = "CSE") {
  const overrides = BRANCH_CODE_OVERRIDES[branch] || {};
  return codes.map((code) => {
    const key = String(code || "")
      .trim()
      .toUpperCase();
    const meta = overrides[key] || SUBJECT_BY_CODE[key];
    if (!meta) {
      throw new Error(`Unknown subject code ${branch}/${key}`);
    }
    const subjectCode =
      (meta.subjectCodesBySemester && meta.subjectCodesBySemester[semester]) ||
      meta.subjectCode;
    return {
      code: key,
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

/** IT scheme from `medha pyq/IT/{N}sem/` folders. */
const IT_SUBJECTS_BY_SEMESTER = {
  1: CSE_SUBJECTS_BY_SEMESTER[1],
  2: CSE_SUBJECTS_BY_SEMESTER[2],
  3: mapSemesterSubjects(
    ["AEM", "TC", "MEFA", "DE", "DSA", "OOPS", "SE"],
    3
  ),
  4: mapSemesterSubjects(
    ["DMS", "TC", "MEFA", "POC", "DBMS", "TOC", "DCCN"],
    4
  ),
  5: mapSemesterSubjects(
    ["CD", "OS", "CG", "AOA", "MP", "STPM", "WC"],
    5
  ),
  6: mapSemesterSubjects(
    ["DIP", "ML", "ISS", "CAO", "AI", "CC", "DS", "EERP", "ITC"],
    6
  ),
  7: mapSemesterSubjects(["BDA"], 7),
  8: mapSemesterSubjects(["IOT"], 8),
};

/** ECE scheme from syllabus PDFs under `medha pyq/ECE/`. */
const ECE_SUBJECTS_BY_SEMESTER = {
  1: CSE_SUBJECTS_BY_SEMESTER[1],
  2: CSE_SUBJECTS_BY_SEMESTER[2],
  3: mapSemesterSubjects(
    ["AEM", "TC", "MEFA", "DSD", "SAS", "NT", "ED"],
    3,
    "ECE"
  ),
  4: mapSemesterSubjects(
    ["AEM2", "TC", "MEFA", "AC", "MCU", "EMI", "ADC"],
    4,
    "ECE"
  ),
  5: mapSemesterSubjects(
    ["CA", "EW", "CS", "DSP", "MTT", "BME", "ES", "SC"],
    5,
    "ECE"
  ),
  6: mapSemesterSubjects(["CN", "FOC", "AP", "MEMS"], 6, "ECE"),
  7: mapSemesterSubjects(["VLSI", "CMOS"], 7, "ECE"),
  8: mapSemesterSubjects(["IPPR"], 8, "ECE"),
};

/** EE scheme from syllabus PDFs under `medha pyq/EE/`. */
const EE_SUBJECTS_BY_SEMESTER = {
  1: CSE_SUBJECTS_BY_SEMESTER[1],
  2: CSE_SUBJECTS_BY_SEMESTER[2],
  3: mapSemesterSubjects(
    ["AEM", "TC", "MEFA", "PGP", "AE", "EM1", "EMF"],
    3,
    "EE"
  ),
  4: mapSemesterSubjects(
    ["BIO", "TC", "MEFA", "EMI", "EM2", "PE", "SAS", "DE"],
    4,
    "EE"
  ),
  5: mapSemesterSubjects(
    ["EMAT", "PS1", "CS", "MP", "EMD", "RPS"],
    5,
    "EE"
  ),
  6: mapSemesterSubjects(
    ["CA", "PS2", "PSP", "EECA", "ED", "PSPL"],
    6,
    "EE"
  ),
  7: mapSemesterSubjects(["WSES", "PQF"], 7, "EE"),
  8: mapSemesterSubjects(["EHV", "EDC"], 8, "EE"),
};

/** ME scheme from `medha pyq/ME/{N}sem/` folders. */
const ME_SUBJECTS_BY_SEMESTER = {
  1: CSE_SUBJECTS_BY_SEMESTER[1],
  2: CSE_SUBJECTS_BY_SEMESTER[2],
  3: mapSemesterSubjects(
    ["AEM", "TC", "MEFA", "EM", "ETD", "MSE", "MOS"],
    3,
    "ME"
  ),
  4: mapSemesterSubjects(
    ["DA", "TC", "MEFA", "DE", "FMFM", "MP", "TOM"],
    4,
    "ME"
  ),
  5: mapSemesterSubjects(
    ["MS", "HT", "MT", "DME1", "POM", "SE", "AE", "NDET"],
    5,
    "ME"
  ),
  6: mapSemesterSubjects(
    ["MM", "CIMS", "MV", "DME2", "QM", "RAC", "NMM"],
    6,
    "ME"
  ),
  7: mapSemesterSubjects(["ICE", "OR", "TM"], 7, "ME"),
  8: mapSemesterSubjects(["OM"], 8, "ME"),
};

const BRANCH_SUBJECT_MAPS = {
  CSE: CSE_SUBJECTS_BY_SEMESTER,
  AIDS: AIDS_SUBJECTS_BY_SEMESTER,
  IT: IT_SUBJECTS_BY_SEMESTER,
  ECE: ECE_SUBJECTS_BY_SEMESTER,
  EE: EE_SUBJECTS_BY_SEMESTER,
  ME: ME_SUBJECTS_BY_SEMESTER,
};

/** Local folder name under `medha pyq/` for each branch. */
const BRANCH_PYQ_DIRS = {
  CSE: "CS",
  AIDS: "CS",
  IT: "IT",
  ECE: "ECE",
  EE: "EE",
  ME: "ME",
};

const SUPPORTED_BRANCHES = [
  { id: "CSE", label: "CSE" },
  { id: "AIDS", label: "AI / AIDS" },
  { id: "IT", label: "IT" },
  { id: "ECE", label: "ECE" },
  { id: "EE", label: "EE" },
  { id: "ME", label: "ME" },
];

function normalizeCatalogBranch(branch = "CSE") {
  const raw = String(branch || "CSE")
    .trim()
    .toUpperCase();
  if (raw === "AI" || raw === "AIDS" || raw.includes("ARTIFICIAL")) return "AIDS";
  if (raw === "CSE" || raw === "CS" || raw.includes("COMPUTER")) return "CSE";
  if (raw === "IT" || raw.includes("INFORMATION")) return "IT";
  if (raw === "ECE" || raw.includes("ELECTRONIC")) return "ECE";
  if (raw === "EE" || raw === "EX" || raw.includes("ELECTRICAL")) return "EE";
  if (raw === "ME" || raw.includes("MECHANICAL")) return "ME";
  return raw;
}

function subjectsForSemester(semester, branch = "CSE") {
  const sem = Number(semester);
  const key = normalizeCatalogBranch(branch);
  const map = BRANCH_SUBJECT_MAPS[key] || CSE_SUBJECTS_BY_SEMESTER;
  return map[sem] || [];
}

function resolveSubjectCode(code, semester, branch = "CSE") {
  const key = String(code || "")
    .trim()
    .toUpperCase();
  const b = normalizeCatalogBranch(branch);
  const meta =
    (BRANCH_CODE_OVERRIDES[b] && BRANCH_CODE_OVERRIDES[b][key]) ||
    SUBJECT_BY_CODE[key];
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
  BRANCH_CODE_OVERRIDES,
  CSE_SUBJECTS_BY_SEMESTER,
  AIDS_SUBJECTS_BY_SEMESTER,
  IT_SUBJECTS_BY_SEMESTER,
  ECE_SUBJECTS_BY_SEMESTER,
  EE_SUBJECTS_BY_SEMESTER,
  ME_SUBJECTS_BY_SEMESTER,
  BRANCH_SUBJECT_MAPS,
  BRANCH_PYQ_DIRS,
  SUPPORTED_BRANCHES,
  normalizeCatalogBranch,
  subjectsForSemester,
  resolveSubjectCode,
};
