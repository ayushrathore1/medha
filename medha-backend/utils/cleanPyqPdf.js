/**
 * Clean RTU past-paper PDFs before hosting:
 * - strip URI / GoToR / Launch link annotations (outbound download redirects)
 * - optionally prepend a Medha cover page with RTU attribution
 *
 * Does NOT remove copyright or ownership text from the paper body.
 */
const fs = require("fs");
const path = require("path");
const {
  PDFDocument,
  PDFName,
  PDFArray,
  StandardFonts,
  rgb,
} = require("pdf-lib");

/**
 * Remove clickable annotations that navigate off-document.
 * @param {import('pdf-lib').PDFDocument} pdfDoc
 * @returns {number} count removed
 */
function stripOutboundLinks(pdfDoc) {
  let removed = 0;

  for (const page of pdfDoc.getPages()) {
    let annots;
    try {
      annots = page.node.lookup(PDFName.of("Annots"), PDFArray);
    } catch {
      continue;
    }
    if (!annots) continue;

    const kept = [];
    for (let i = 0; i < annots.size(); i += 1) {
      const annot = annots.lookup(i);
      if (!annot) continue;

      let subtype = "";
      try {
        subtype = String(annot.lookup(PDFName.of("Subtype")) || "");
      } catch {
        /* ignore */
      }

      if (!/Link/i.test(subtype)) {
        kept.push(annots.get(i));
        continue;
      }

      let actionType = "";
      try {
        const action = annot.lookup(PDFName.of("A"));
        if (action) {
          actionType = String(action.lookup(PDFName.of("S")) || "");
        }
      } catch {
        /* ignore */
      }

      if (/URI|GoToR|Launch|SubmitForm|JavaScript/i.test(actionType)) {
        removed += 1;
        continue;
      }

      let hasDest = false;
      try {
        hasDest = Boolean(annot.lookup(PDFName.of("Dest")));
      } catch {
        hasDest = false;
      }

      // Drop unknown remote-style link actions; keep in-doc Dest links
      if (actionType && !hasDest) {
        removed += 1;
        continue;
      }

      kept.push(annots.get(i));
    }

    if (kept.length === 0) {
      page.node.delete(PDFName.of("Annots"));
    } else {
      page.node.set(PDFName.of("Annots"), pdfDoc.context.obj(kept));
    }
  }

  return removed;
}

async function buildCoverPage(pdfDoc, meta = {}) {
  const cover = pdfDoc.insertPage(0);
  const { width, height } = cover.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  cover.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.97, 0.97, 0.95),
  });

  const title = meta.subjectName || "Past paper";
  const yearLine = [
    meta.year,
    meta.examType && meta.examType !== "main" ? meta.examType : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const semLine = meta.semester ? `Semester ${meta.semester}` : "";
  const branchLine = [meta.university || "RTU", meta.branch]
    .filter(Boolean)
    .join(" · ");

  cover.drawText("MEDHA Revision", {
    x: 48,
    y: height - 72,
    size: 14,
    font: fontBold,
    color: rgb(0.07, 0.07, 0.07),
  });
  cover.drawText(String(title).slice(0, 80), {
    x: 48,
    y: height - 120,
    size: 22,
    font: fontBold,
    color: rgb(0.07, 0.07, 0.07),
  });
  cover.drawText([semLine, yearLine].filter(Boolean).join("  ·  "), {
    x: 48,
    y: height - 152,
    size: 12,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });
  cover.drawText(branchLine, {
    x: 48,
    y: height - 172,
    size: 12,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });
  cover.drawText("Source: Rajasthan Technical University (RTU)", {
    x: 48,
    y: 72,
    size: 11,
    font,
    color: rgb(0.25, 0.25, 0.25),
  });
  cover.drawText(
    "Hosted for revision on Medha. Original paper authorship remains with RTU.",
    {
      x: 48,
      y: 52,
      size: 9,
      font,
      color: rgb(0.45, 0.45, 0.45),
    }
  );
}

/**
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {object} [meta]
 */
async function cleanPyqPdf(inputPath, outputPath, meta = {}) {
  const bytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

  const removedLinks = stripOutboundLinks(pdfDoc);

  if (meta.cover !== false) {
    await buildCoverPage(pdfDoc, meta);
  }

  const out = await pdfDoc.save();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, out);

  return { outputPath, removedLinks, pages: pdfDoc.getPageCount() };
}

module.exports = {
  cleanPyqPdf,
  stripOutboundLinks,
  buildCoverPage,
};
