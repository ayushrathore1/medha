const PastPaper = require("../models/PastPaper");
const axios = require("axios");
const {
  CSE_SUBJECTS_BY_SEMESTER,
  AIDS_SUBJECTS_BY_SEMESTER,
  SUPPORTED_BRANCHES,
  targetYears,
  subjectsForSemester,
} = require("../data/pastPaperCatalog");
const { signedPastPaperUrl } = require("../utils/pastPaperDelivery");

function normalizeBranch(value) {
  const raw = String(value || "")
    .trim()
    .toUpperCase();
  if (!raw) return "";
  if (raw === "AI" || raw === "AIDS" || raw.includes("ARTIFICIAL")) return "AIDS";
  if (raw === "CSE" || raw.includes("COMPUTER")) return "CSE";
  return raw;
}

function publicPaper(doc) {
  const plain = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    id: String(plain._id),
    university: plain.university,
    branch: plain.branch,
    semester: plain.semester,
    subjectName: plain.subjectName,
    subjectCode: plain.subjectCode || "",
    year: plain.year,
    examType: plain.examType || "main",
    fileUrl: plain.fileUrl,
    sourceAttribution: plain.sourceAttribution,
    downloadCount: plain.downloadCount || 0,
  };
}

/**
 * GET /api/past-papers/meta
 * Catalog + availability counts for the browse UI.
 */
async function getMeta(req, res) {
  try {
    const branch = normalizeBranch(req.query.branch) || "CSE";
    const filter = { university: "RTU", branch };

    const [bySemester, distinctYears] = await Promise.all([
      PastPaper.aggregate([
        { $match: filter },
        {
          $group: {
            _id: { semester: "$semester", subjectName: "$subjectName" },
            years: { $addToSet: "$year" },
            count: { $sum: 1 },
          },
        },
      ]),
      PastPaper.distinct("year", filter),
    ]);

    const availability = {};
    for (const row of bySemester) {
      const sem = row._id.semester;
      if (!availability[sem]) availability[sem] = {};
      availability[sem][row._id.subjectName] = {
        years: row.years.sort((a, b) => b - a),
        count: row.count,
      };
    }

    const semesterMap =
      branch === "AIDS" ? AIDS_SUBJECTS_BY_SEMESTER : CSE_SUBJECTS_BY_SEMESTER;
    const semesters = Object.keys(semesterMap)
      .map(Number)
      .sort((a, b) => a - b)
      .map((semester) => {
        const subjects = subjectsForSemester(semester, branch).map((s) => {
          const avail = availability[semester]?.[s.subjectName];
          return {
            ...s,
            availableYears: avail?.years || [],
            paperCount: avail?.count || 0,
          };
        });
        return {
          semester,
          paperCount: subjects.reduce((n, s) => n + s.paperCount, 0),
          subjects,
        };
      });

    res.json({
      success: true,
      university: "RTU",
      branches: SUPPORTED_BRANCHES,
      branch,
      targetYears: targetYears(5),
      yearsInArchive: distinctYears.sort((a, b) => b - a),
      semesters,
    });
  } catch (err) {
    console.error("[past-papers/meta]", err);
    res.status(500).json({ success: false, message: "Failed to load past paper meta" });
  }
}

/**
 * GET /api/past-papers
 * Optional filters: branch, semester, subject, year, examType
 */
async function listPapers(req, res) {
  try {
    const filter = { university: "RTU" };
    const branch = normalizeBranch(req.query.branch);
    if (branch) filter.branch = branch;

    if (req.query.semester) {
      const semester = Number(req.query.semester);
      if (semester >= 1 && semester <= 8) filter.semester = semester;
    }
    if (req.query.subject) {
      filter.subjectName = String(req.query.subject).trim();
    }
    if (req.query.year) {
      filter.year = Number(req.query.year);
    }
    if (req.query.examType) {
      filter.examType = String(req.query.examType).toLowerCase();
    }

    const papers = await PastPaper.find(filter)
      .sort({ semester: 1, subjectName: 1, year: -1 })
      .lean();

    res.json({
      success: true,
      count: papers.length,
      papers: papers.map(publicPaper),
    });
  } catch (err) {
    console.error("[past-papers/list]", err);
    res.status(500).json({ success: false, message: "Failed to list past papers" });
  }
}

/**
 * GET /api/past-papers/:id/download
 * Increments counter and redirects to a short-lived Cloudinary private download URL.
 * (Public res.cloudinary.com PDF links return 401 ACL on this account.)
 */
async function downloadPaper(req, res) {
  try {
    const paper = await PastPaper.findById(req.params.id);
    if (!paper || !(paper.fileUrl || paper.cloudinaryPublicId)) {
      return res.status(404).json({ success: false, message: "Paper not found" });
    }

    const attachment = req.query.attachment === "1" || req.query.attachment === "true";
    const fileUrl = signedPastPaperUrl(paper, { attachment });
    if (!fileUrl) {
      return res.status(404).json({ success: false, message: "Paper file missing" });
    }

    paper.downloadCount = (paper.downloadCount || 0) + 1;
    await paper.save();

    if (req.query.redirect === "0") {
      return res.json({
        success: true,
        fileUrl,
        streamPath: `/api/past-papers/${paper._id}/file`,
        paper: publicPaper(paper),
      });
    }

    return res.redirect(302, fileUrl);
  } catch (err) {
    console.error("[past-papers/download]", err);
    res.status(500).json({ success: false, message: "Failed to download past paper" });
  }
}

/**
 * GET /api/past-papers/:id/file
 * Proxy stream so in-app PDF viewers avoid Cloudinary ACL 401 / CORS.
 */
async function streamPaperFile(req, res) {
  try {
    const paper = await PastPaper.findById(req.params.id);
    if (!paper || !(paper.fileUrl || paper.cloudinaryPublicId)) {
      return res.status(404).json({ success: false, message: "Paper not found" });
    }

    const attachment = req.query.attachment === "1" || req.query.attachment === "true";
    const fileUrl = signedPastPaperUrl(paper, { attachment });
    if (!fileUrl) {
      return res.status(404).json({ success: false, message: "Paper file missing" });
    }

    // Count only explicit downloads, not every in-app view
    if (attachment) {
      paper.downloadCount = (paper.downloadCount || 0) + 1;
      await paper.save();
    }

    const safeName = `${paper.subjectName || "paper"}-${paper.year || ""}`
      .replace(/[^\w.\- ]+/g, "")
      .trim() || "paper";
    const disposition = attachment ? "attachment" : "inline";

    const upstream = await axios.get(fileUrl, {
      responseType: "stream",
      timeout: 60000,
      maxRedirects: 5,
      validateStatus: (s) => s >= 200 && s < 400,
    });

    res.setHeader("Content-Type", upstream.headers["content-type"] || "application/pdf");
    res.setHeader("Content-Disposition", `${disposition}; filename="${safeName}.pdf"`);
    res.setHeader("Cache-Control", "private, max-age=60");
    upstream.data.on("error", (err) => {
      console.error("[past-papers/file] upstream:", err.message);
      if (!res.headersSent) res.status(502).end();
      else res.destroy(err);
    });
    res.on("close", () => {
      try {
        upstream.data.destroy();
      } catch {
        /* ignore */
      }
    });
    return upstream.data.pipe(res);
  } catch (err) {
    console.error("[past-papers/file]", err.message || err);
    if (!res.headersSent) {
      res.status(502).json({ success: false, message: "Failed to stream past paper" });
    }
  }
}

module.exports = {
  getMeta,
  listPapers,
  downloadPaper,
  streamPaperFile,
  normalizeBranch,
  publicPaper,
};
