/**
 * One-shot: node scripts/seedCurriculumCli.js [--force]
 */
require("dotenv").config();
const mongoose = require("mongoose");
const { seedCurriculum } = require("../utils/seedCurriculum");

async function main() {
  const force = process.argv.includes("--force");
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/medha";
  await mongoose.connect(uri);
  console.log("Connected. Seeding curriculum… force=", force);
  const result = await seedCurriculum({ force });
  console.log(result);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
