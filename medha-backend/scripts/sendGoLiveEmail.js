/**
 * Manually run (or force) the Medha Revision go-live email campaign.
 *
 *   node scripts/sendGoLiveEmail.js
 *   node scripts/sendGoLiveEmail.js --force
 */

require("dotenv").config();
const mongoose = require("mongoose");
const { runGoLiveEmailCampaign } = require("../utils/goLiveEmailCampaign");

async function main() {
  const force = process.argv.includes("--force");
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");

  await mongoose.connect(uri);
  const result = await runGoLiveEmailCampaign({ force });
  console.log(JSON.stringify(result, null, 2));
  await mongoose.connection.close();
}

main().catch(async (err) => {
  console.error("Fatal:", err.message || err);
  try {
    await mongoose.connection.close();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
