#!/usr/bin/env node
/**
 * Fail CI if git-tracked raster/SVG assets exceed the repo budget.
 * Baseline was measured from git ls-files before the #9 optimization.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const budget = JSON.parse(
  fs.readFileSync(path.join(__dirname, "image-budget.json"), "utf8")
);

const tracked = execSync("git ls-files", { cwd: ROOT, encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

const extOf = (file) => path.extname(file).toLowerCase();
const isRaster = (file) => budget.rasterExtensions.includes(extOf(file));
const isSvg = (file) => budget.svgExtensions.includes(extOf(file));

const rasters = [];
const svgs = [];
const violations = [];

for (const file of tracked) {
  if (!isRaster(file) && !isSvg(file)) continue;
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) continue;
  const bytes = fs.statSync(abs).size;
  const row = { file, bytes };
  if (isRaster(file)) {
    rasters.push(row);
    if (bytes > budget.maxFileBytes) {
      violations.push(
        `${file} is ${bytes} bytes (limit ${budget.maxFileBytes})`
      );
    }
  } else {
    svgs.push(row);
    if (bytes > budget.maxSvgBytes) {
      violations.push(
        `${file} SVG is ${bytes} bytes (limit ${budget.maxSvgBytes})`
      );
    }
  }
}

const totalRaster = rasters.reduce((sum, row) => sum + row.bytes, 0);
if (totalRaster > budget.maxTotalRasterBytes) {
  violations.push(
    `raster total ${totalRaster} bytes exceeds ${budget.maxTotalRasterBytes}`
  );
}

const wallpaperWebps = tracked.filter(
  (file) => file.startsWith("medha-frontend/src/assets/wallpapers/") && file.endsWith(".webp")
);
if (wallpaperWebps.length < 13) {
  violations.push(
    `expected 13 wallpaper webp seed files, found ${wallpaperWebps.length}`
  );
}

const saved = budget.baselineBeforeBytes - totalRaster;
const savedPct = ((saved / budget.baselineBeforeBytes) * 100).toFixed(1);

console.log("Image asset budget");
console.log(`  files: ${rasters.length} raster, ${svgs.length} svg`);
console.log(
  `  before: ${budget.baselineBeforeBytes} bytes | after: ${totalRaster} bytes | saved: ${saved} (${savedPct}%)`
);
console.log(`  per-file limit: ${budget.maxFileBytes} | total limit: ${budget.maxTotalRasterBytes}`);

rasters
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 8)
  .forEach((row) => {
    console.log(`  ${String(row.bytes).padStart(8)}  ${row.file}`);
  });

if (violations.length) {
  console.error("\nBudget violations:");
  violations.forEach((msg) => console.error(`  - ${msg}`));
  process.exit(1);
}

console.log("  budget ok");
