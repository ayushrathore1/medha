/**
 * CLI: clean one PDF or a folder of PDFs.
 *
 *   node scripts/cleanPyqPdf.js <input.pdf> [output.pdf]
 *   node scripts/cleanPyqPdf.js --dir <folder> [--out <folder>]
 *
 * Optional meta flags: --subject "DSA" --year 2024 --semester 3 --branch CSE
 */
const path = require("path");
const fs = require("fs");
const { cleanPyqPdf } = require("../utils/cleanPyqPdf");

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return null;
  return process.argv[i + 1] || null;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

async function cleanOne(input, output, meta) {
  const result = await cleanPyqPdf(input, output, meta);
  console.log(
    `OK ${path.basename(input)} → ${output} (removed ${result.removedLinks} links, ${result.pages} pages)`
  );
  return result;
}

async function main() {
  const meta = {
    subjectName: argValue("--subject") || undefined,
    year: argValue("--year") || undefined,
    semester: argValue("--semester") || undefined,
    branch: argValue("--branch") || "CSE",
    university: "RTU",
    examType: argValue("--examType") || "main",
    cover: !hasFlag("--no-cover"),
  };

  const dir = argValue("--dir");
  if (dir) {
    const outRoot = argValue("--out") || path.join(dir, "_cleaned");
    const entries = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".pdf"));
    if (!entries.length) {
      console.error("No PDFs found in", dir);
      process.exit(1);
    }
    for (const file of entries) {
      const input = path.join(dir, file);
      const output = path.join(outRoot, file);
      await cleanOne(input, output, {
        ...meta,
        subjectName: meta.subjectName || path.basename(file, ".pdf"),
      });
    }
    return;
  }

  const input = process.argv[2];
  if (!input || input.startsWith("--")) {
    console.error(
      "Usage:\n  node scripts/cleanPyqPdf.js <input.pdf> [output.pdf]\n  node scripts/cleanPyqPdf.js --dir <folder> [--out <folder>]"
    );
    process.exit(1);
  }

  const output =
    process.argv[3] && !process.argv[3].startsWith("--")
      ? process.argv[3]
      : path.join(
          path.dirname(input),
          `${path.basename(input, path.extname(input))}.cleaned.pdf`
        );

  await cleanOne(path.resolve(input), path.resolve(output), meta);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
