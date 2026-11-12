/**
 * Seed RTU past papers from the local `medha pyq` tree (already cleaned).
 *
 * Layout (preferred):
 *   ../medha pyq/CS/3sem/DSA/….pdf
 *   ../medha pyq/IT/5sem/STPM/….pdf
 * Legacy (CSE first-year still at root):
 *   ../medha pyq/1sem/EM/….pdf
 *
 * Usage:
 *   node scripts/seedPastPapers.js --branch=IT
 *   node scripts/seedPastPapers.js --branch=IT --upload
 *   node scripts/seedPastPapers.js --branch=CSE --upload --mirror-aids
 *   node scripts/seedPastPapers.js --manifest --branch=IT
 *
 * Optional:
 *   --root "/path/to/medha pyq"
 *   --semesters=3,4,5
 *   --clean
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { cleanPyqPdf } = require("../utils/cleanPyqPdf");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const PastPaper = require("../models/PastPaper");
const {
  BRANCH_PYQ_DIRS,
  BRANCH_SUBJECT_MAPS,
  subjectsForSemester,
  resolveSubjectCode,
  normalizeCatalogBranch,
  targetYears,
} = require("../data/pastPaperCatalog");

const DEFAULT_ROOT = path.resolve(__dirname, "../../../medha pyq");
const CLEAN_ROOT = path.resolve(__dirname, "../../content/pyq/_cleaned/rtu");

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function argValue(flag) {
  const eq = process.argv.find((a) => a.startsWith(`${flag}=`));
  if (eq) return eq.slice(flag.length + 1) || null;
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

function parseSemester(folderSem, file) {
  const m = String(file).toLowerCase().match(/(?:^|[^0-9])([1-8])[-_]?sem/);
  if (m) return Number(m[1]);
  return folderSem;
}

function collectSubjectDir(semPath, codeDir, folderSem, branch, found) {
  const subjectPath = path.join(semPath, codeDir);
  if (!fs.statSync(subjectPath).isDirectory()) return;
  if (codeDir.startsWith(".")) return;
  if (/^syllabus$/i.test(codeDir)) return;

  if (!resolveSubjectCode(codeDir, folderSem, branch)) {
    console.warn(`Unknown subject folder ${branch}/${folderSem}sem/${codeDir} — skipping`);
    return;
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
    const meta = resolveSubjectCode(codeDir, semester, branch);
    found.push({
      university: "RTU",
      branch,
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

function discoverBranchTree(root, branch, semesterFilter) {
  const found = [];
  const dirName = BRANCH_PYQ_DIRS[branch] || branch;
  const branchRoot = path.join(root, dirName);
  if (!fs.existsSync(branchRoot)) {
    console.error(`Branch PYQ folder not found: ${branchRoot}`);
    return found;
  }

  for (const entry of fs.readdirSync(branchRoot)) {
    const semMatch = /^([1-8])sem$/i.exec(entry);
    if (!semMatch) continue;
    const folderSem = Number(semMatch[1]);
    if (semesterFilter && !semesterFilter.includes(folderSem)) continue;

    const semPath = path.join(branchRoot, entry);
    if (!fs.statSync(semPath).isDirectory()) continue;

    for (const codeDir of fs.readdirSync(semPath)) {
      collectSubjectDir(semPath, codeDir, folderSem, branch, found);
    }
  }

  // First-year common papers still live at repo root for CSE/AIDS
  if (branch === "CSE" || branch === "AIDS") {
    for (const entry of ["1sem", "2sem"]) {
      const folderSem = Number(entry[0]);
      if (semesterFilter && !semesterFilter.includes(folderSem)) continue;
      const semPath = path.join(root, entry);
      if (!fs.existsSync(semPath) || !fs.statSync(semPath).isDirectory()) continue;
      for (const codeDir of fs.readdirSync(semPath)) {
        collectSubjectDir(semPath, codeDir, folderSem, branch, found);
      }
    }
  }

  return dedupePapers(found);
}

function dedupePapers(found) {
  const best = new Map();
  for (const p of found) {
    const key = `${p.branch}|${p.semester}|${p.subjectName}|${p.year}|${p.examType}`;
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

function printManifest(branch) {
  const years = targetYears(5);
  const dirName = BRANCH_PYQ_DIRS[branch] || branch;
  console.log(`Catalog subjects for ${branch} (folder: medha pyq/${dirName}/):\n`);
  const map = BRANCH_SUBJECT_MAPS[branch] || {};
  for (const semester of Object.keys(map)
    .map(Number)
    .sort((a, b) => a - b)) {
    console.log(`## Semester ${semester}`);
    for (const subject of subjectsForSemester(semester, branch)) {
      console.log(
        `  [${subject.code}] ${subject.subjectName} (${subject.subjectCode || "—"})`
      );
      for (const year of years) {
        console.log(
          `    medha pyq/${dirName}/${semester}sem/${subject.code}/…${year}….pdf`
        );
      }
    }
    console.log("");
  }
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
  const branch = normalizeCatalogBranch(argValue("--branch") || "CSE");
  if (hasFlag("--manifest")) {
    printManifest(branch);
    return;
  }

  const root = path.resolve(argValue("--root") || process.env.MEDHA_PYQ_ROOT || DEFAULT_ROOT);
  const doUpload = hasFlag("--upload");
  const mirrorAids = hasFlag("--mirror-aids");
  const doClean = hasFlag("--clean");
  const semesterFilter = parseSemestersFlag();
  const papers = discoverBranchTree(root, branch, semesterFilter);

  console.log(`Root: ${root}`);
  console.log(`Branch: ${branch}`);
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
      `\nDry-run only. Re-run with --branch=${branch} --upload to push to Cloudinary + Mongo.`
    );
    return;
  }

  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/medha";
  await mongoose.connect(uri);
  console.log("Connected to Mongo.");

  let ok = 0;
  let fail = 0;
  const branchSlug = String(branch).toLowerCase();

  for (const p of papers) {
    try {
      let uploadPath = p.inputPath;
      if (doClean) {
        const cleanedPath = path.join(
          CLEAN_ROOT,
          branchSlug,
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

      const folder = `pyq/rtu/${branchSlug}/sem-${String(p.semester).padStart(2, "0")}/${p.slug}`;
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
