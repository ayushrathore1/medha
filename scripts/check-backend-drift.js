#!/usr/bin/env node
/**
 * Drift check: medha-backend (canonical) vs medha-next/backend (frozen copy).
 *
 * Canonical Express may change freely. The copy is frozen: CI fails if any
 * file under medha-next/backend changes relative to the committed baseline.
 *
 * Usage:
 *   node scripts/check-backend-drift.js
 *   node scripts/check-backend-drift.js --update-baseline
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CANONICAL = path.join(ROOT, "medha-backend");
const COPY = path.join(ROOT, "medha-next", "backend");
const BASELINE_PATH = path.join(__dirname, "backend-drift-baseline.json");

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "coverage",
  "uploads",
  ".next",
]);
const SKIP_FILES = new Set([".DS_Store", ".env", ".env.local", ".env.example"]);
const COMPARE_EXT = new Set([".js", ".json", ".md", ".ts", ".yml", ".yaml"]);

const updateBaseline = process.argv.includes("--update-baseline");

function shouldSkipFile(name) {
  return SKIP_FILES.has(name) || name.startsWith(".env");
}

function walk(dir, base = dir, out = {}) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), base, out);
      continue;
    }
    if (!entry.isFile() || shouldSkipFile(entry.name)) continue;
    const ext = path.extname(entry.name);
    if (!COMPARE_EXT.has(ext) && entry.name !== "Dockerfile") continue;
    const abs = path.join(dir, entry.name);
    const rel = path.relative(base, abs).split(path.sep).join("/");
    out[rel] = crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex");
  }
  return out;
}

function loadBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
}

function writeBaseline(copyHashes) {
  const payload = {
    generatedBy: "scripts/check-backend-drift.js",
    policy:
      "medha-next/backend is a frozen stale copy of medha-backend. Do not patch it; land Express fixes in medha-backend. Update this snapshot only when intentionally changing the copy.",
    copyRoot: "medha-next/backend",
    canonicalRoot: "medha-backend",
    copyHashes,
  };
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(payload, null, 2)}\n`);
}

function main() {
  if (!fs.existsSync(CANONICAL)) {
    console.error(`Canonical backend missing: ${CANONICAL}`);
    process.exit(1);
  }
  if (!fs.existsSync(COPY)) {
    console.log(
      "medha-next/backend is gone. Treat that as migration cleanup: remove scripts/check-backend-drift.js, the baseline, and .github/workflows/backend-drift.yml."
    );
    process.exit(0);
  }

  const canonical = walk(CANONICAL);
  const copy = walk(COPY);
  const canonicalFiles = Object.keys(canonical);
  const copyFiles = Object.keys(copy);
  const both = copyFiles.filter((rel) => canonical[rel]);
  const onlyCanonical = canonicalFiles.filter((rel) => !copy[rel]).sort();
  const onlyCopy = copyFiles.filter((rel) => !canonical[rel]).sort();

  let identical = 0;
  const diverged = [];
  for (const rel of both.sort()) {
    if (canonical[rel] === copy[rel]) identical += 1;
    else diverged.push(rel);
  }

  console.log("MEDHA Express copy drift report");
  console.log(`  canonical files : ${canonicalFiles.length}`);
  console.log(`  copy files      : ${copyFiles.length}`);
  console.log(`  identical       : ${identical}`);
  console.log(`  diverged        : ${diverged.length}`);
  console.log(`  only canonical  : ${onlyCanonical.length}`);
  console.log(`  only copy       : ${onlyCopy.length}`);
  if (diverged.length) {
    console.log("\nDiverged (copy lags or differs from canonical):");
    for (const rel of diverged) console.log(`  - ${rel}`);
  }
  if (onlyCanonical.length) {
    console.log("\nOnly in medha-backend (copy is behind; expected while frozen):");
    for (const rel of onlyCanonical) console.log(`  - ${rel}`);
  }
  if (onlyCopy.length) {
    console.log("\nOnly in medha-next/backend (copy must not grow unique files):");
    for (const rel of onlyCopy) console.log(`  - ${rel}`);
  }

  if (updateBaseline) {
    writeBaseline(copy);
    console.log(`\nWrote ${path.relative(ROOT, BASELINE_PATH)}`);
    process.exit(0);
  }

  const failures = [];
  if (onlyCopy.length) {
    failures.push(
      "medha-next/backend has files that are not in medha-backend. Do not grow the stale copy."
    );
  }

  const baseline = loadBaseline();
  if (!baseline || !baseline.copyHashes) {
    failures.push(
      `Missing baseline at ${path.relative(ROOT, BASELINE_PATH)}. Run: node scripts/check-backend-drift.js --update-baseline`
    );
  } else {
    const expected = baseline.copyHashes;
    const expectedFiles = Object.keys(expected).sort();
    const actualFiles = copyFiles.slice().sort();

    for (const rel of actualFiles) {
      if (!(rel in expected)) {
        failures.push(`copy added ${rel} (frozen tree; revert or update baseline only if intentional)`);
      } else if (expected[rel] !== copy[rel]) {
        failures.push(
          `copy changed ${rel}. Land Express fixes in medha-backend, not medha-next/backend.`
        );
      }
    }
    for (const rel of expectedFiles) {
      if (!(rel in copy)) {
        failures.push(
          `copy deleted ${rel}. If this is migration cleanup, update the baseline; otherwise restore the file.`
        );
      }
    }
  }

  if (failures.length) {
    console.error("\nDrift check FAILED:");
    for (const line of failures) console.error(`  • ${line}`);
    process.exit(1);
  }

  console.log(
    "\nOK: medha-next/backend is unchanged from the freeze snapshot. Canonical medha-backend may continue to diverge."
  );
}

main();
