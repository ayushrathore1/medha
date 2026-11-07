/**
 * Seed RTU past papers from the local `medha pyq` tree (already cleaned).
 *
 * Layout:
 *   ../medha pyq/3sem/DSA/btech-...-jan-2025.pdf
 *   ../medha pyq/1sem/EM/...
 *
 * Usage:
 *   node scripts/seedPastPapers.js                         # dry-run
 *   node scripts/seedPastPapers.js --upload --mirror-aids  # Cloudinary + Mongo
 *   node scripts/seedPastPapers.js --upload --semesters=1,3,5
 *   node scripts/seedPastPapers.js --manifest
 *
 * Optional:
 *   --root "/path/to/medha pyq"
 *   --clean   (re-run Node cover/link clean — off by default; PDFs are ready)
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { cleanPyqPdf } = require("../utils/cleanPyqPdf");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const PastPaper = require("../models/PastPaper");
const {
  CSE_SUBJECTS_BY_SEMESTER,
  subjectsForSemester,
  resolveSubjectCode,
  targetYears,
} = require("../data/pastPaperCatalog");

// Sibling of the medha repo: .../projects/medha pyq
const DEFAULT_ROOT = path.resolve(__dirname, "../../../medha pyq");
const CLEAN_ROOT = path.resolve(__dirname, "../../content/pyq/_cleaned/rtu/cse");

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return null;
  return process.argv[i + 1] || null;
}

function parseSemestersFlag() {
  const raw = argValue("--semesters");
  if (!raw) return null;
  return raw
    .split(",")
    .map((s) => Number(String(s).trim()))
    .filter((n) => n >= 1 && n <= 8);
}

/** Extract exam year from RTU / pyqonline-style filenames. */
function parseYearFromFilename(file) {
  const name = String(file).toLowerCase();
  const monthYear = name.match(
    /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[-_]?(\d{4})/
  );
  if (monthYear) return Number(monthYear[1]);
  const trailing = name.match(/(?:^|[^0-9])(20\d{2})(?:\)|\.pdf)?$/i);
  if (trailing) return Number(trailing[1]);
  const any = name.match(/(20\d{2})/);
  return any ? Number(any[1]) : null;
}

/** Prefer folder semester; override from `3-sem` / `3sem` in filename when present. */
function parseSemester(folderSem, file) {
  const m = String(file).toLowerCase().match(/(?:^|[^0-9])([1-8])[-_]?sem/);
  if (m) return Number(m[1]);
  return folderSem;
}

function discoverFromMedhaPyq(root, semesterFilter) {
  const found = [];
  if (!fs.existsSync(root)) {
    console.error("PYQ root not found:", root);
    return found;
  }

  for (const entry of fs.readdirSync(root)) {
    const semMatch = /^([1-8])sem$/i.exec(entry);
    if (!semMatch) continue;
    const folderSem = Number(semMatch[1]);
    if (semesterFilter && !semesterFilter.includes(folderSem)) continue;

    const semPath = path.join(root, entry);
    if (!fs.statSync(semPath).isDirectory()) continue;

    const children = fs.readdirSync(semPath);

    // Loose PDFs directly under Nsem/ (e.g. 7sem IoT)
    const loosePdfs = children.filter((f) => /\.pdf$/i.test(f));
    for (const file of loosePdfs) {
      const year = parseYearFromFilename(file);
      if (!year) {
        console.warn("Skip (no year):", file);
        continue;
      }
      const semester = parseSemester(folderSem, file);
      const meta =
        resolveSubjectCode("IOT") || {
          code: "IOT",
          subjectName: "Internet of Things",
          subjectCode: "",
          slug: "iot",
        };
      found.push({
        university: "RTU",
        branch: "CSE",
        semester,
        subjectName: meta.subjectName,
        subjectCode: meta.subjectCode || "",
        slug: meta.slug,
        folderCode: meta.code || "IOT",
        year,
        examType: /back/i.test(file) ? "back" : "main",
        inputPath: path.join(semPath, file),
        originalName: file,
      });
    }

    for (const codeDir of children) {
      const subjectPath = path.join(semPath, codeDir);
      if (!fs.statSync(subjectPath).isDirectory()) continue;
      if (codeDir.startsWith(".")) continue;

      const meta = resolveSubjectCode(codeDir);
      if (!meta) {
        console.warn(`Unknown subject folder ${entry}/${codeDir} — skipping`);
        continue;
      }

      for (const file of fs.readdirSync(subjectPath)) {
        if (!/\.pdf$/i.test(file)) continue;
        if (/\(\d+\)\.pdf$/i.test(file)) {
          console.warn("Skip duplicate copy:", file);
          continue;
        }
        const year = parseYearFromFilename(file);
        if (!year) {
          console.warn("Skip (no year):", file);
          continue;
        }
        const semester = parseSemester(folderSem, file);
        found.push({
          university: "RTU",
          branch: "CSE",
          semester,
          subjectName: meta.subjectName,
          subjectCode: meta.subjectCode || "",
          slug: meta.slug,
          folderCode: meta.code,
          year,
          examType: /back/i.test(file) ? "back" : "main",
          inputPath: path.join(subjectPath, file),
          originalName: file,
        });
      }
    }
  }

  // Dedupe same subject+year+examType — keep newest mtime
  const best = new Map();
  for (const p of found) {
    const key = `${p.semester}|${p.subjectName}|${p.year}|${p.examType}`;
    const prev = best.get(key);
    if (!prev) {
      best.set(key, p);
      continue;
    }
    const prevTime = fs.statSync(prev.inputPath).mtimeMs;
    const nextTime = fs.statSync(p.inputPath).mtimeMs;
    if (nextTime >= prevTime) best.set(key, p);
  }
  return [...best.values()].sort(
    (a, b) =>
      a.semester - b.semester ||
      a.subjectName.localeCompare(b.subjectName) ||
      b.year - a.year
  );
}

function printManifest() {
  const years = targetYears(5);
  console.log("Catalog subjects (folder codes) and example seed paths:\n");
  for (const semester of [1, 3, 5, 7]) {
    console.log(`## Semester ${semester}`);
    for (const subject of subjectsForSemester(semester)) {
      console.log(
        `  [${subject.code}] ${subject.subjectName} (${subject.subjectCode || "—"})`
      );
      for (const year of years) {
        console.log(
          `    medha pyq/${semester}sem/${subject.code}/…${year}….pdf`
        );
      }
    }
    console.log("");
  }
  console.log("All semester keys:", Object.keys(CSE_SUBJECTS_BY_SEMESTER).join(", "));
}

async function upsertPaper(doc, { mirrorAids }) {
  const query = {
    university: doc.university,
    branch: doc.branch,
    semester: doc.semester,
    subjectName: doc.subjectName,
    year: doc.year,
    examType: doc.examType,
  };

  const payload = {
    ...query,
    subjectCode: doc.subjectCode || "",
    fileUrl: doc.fileUrl,
    cloudinaryPublicId: doc.cloudinaryPublicId || null,
    sourceAttribution: "Rajasthan Technical University (RTU)",
    sourceUrl: doc.sourceUrl || null,
  };

  await PastPaper.findOneAndUpdate(query, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

  if (mirrorAids && doc.branch === "CSE") {
    await PastPaper.findOneAndUpdate(
      { ...query, branch: "AIDS" },
      { ...payload, branch: "AIDS" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

async function main() {
  if (hasFlag("--manifest")) {
    printManifest();
    return;
  }

  const root = path.resolve(argValue("--root") || process.env.MEDHA_PYQ_ROOT || DEFAULT_ROOT);
  const doUpload = hasFlag("--upload");
  const mirrorAids = hasFlag("--mirror-aids");
  const doClean = hasFlag("--clean");
  const semesterFilter = parseSemestersFlag();
  const papers = discoverFromMedhaPyq(root, semesterFilter);

  console.log(`Root: ${root}`);
  console.log(`Found ${papers.length} PDF(s) ready to seed`);
  if (!papers.length) {
    console.log("Nothing to seed.");
    return;
  }

  const bySem = {};
  for (const p of papers) {
    bySem[p.semester] = (bySem[p.semester] || 0) + 1;
    console.log(
      ` - Sem ${p.semester} · ${p.folderCode} · ${p.year} · ${p.originalName}`
    );
  }
  console.log("By semester:", bySem);

  if (!doUpload) {
    console.log(
      "\nDry-run only. Re-run with --upload --mirror-aids to push to Cloudinary + Mongo."
    );
    return;
  }

  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/medha";
  await mongoose.connect(uri);
  console.log("Connected to Mongo.");

  let ok = 0;
  let fail = 0;

  for (const p of papers) {
    try {
      let uploadPath = p.inputPath;
      if (doClean) {
        const cleanedPath = path.join(
          CLEAN_ROOT,
          `sem-${String(p.semester).padStart(2, "0")}`,
          p.slug,
          `${p.year}.pdf`
        );
        await cleanPyqPdf(p.inputPath, cleanedPath, {
          subjectName: p.subjectName,
          year: p.year,
          semester: p.semester,
          branch: p.branch,
          university: "RTU",
          examType: p.examType,
        });
        uploadPath = cleanedPath;
      }

      const folder = `pyq/rtu/cse/sem-${String(p.semester).padStart(2, "0")}/${p.slug}`;
      const uploaded = await uploadToCloudinary(
        uploadPath,
        `${p.slug}-${p.year}.pdf`,
        { folder, publicId: String(p.year) }
      );

      await upsertPaper(
        {
          ...p,
          fileUrl: uploaded.url,
          cloudinaryPublicId: uploaded.publicId,
        },
        { mirrorAids }
      );
      ok += 1;
      console.log(
        `OK [${ok}/${papers.length}] Sem ${p.semester} ${p.subjectName} ${p.year}`
      );
    } catch (err) {
      fail += 1;
      console.error(`FAIL ${p.originalName}:`, err.message || err);
    }
  }

  await mongoose.disconnect();
  console.log(`Done. uploaded=${ok} failed=${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
