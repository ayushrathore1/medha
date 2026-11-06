require("dotenv").config();
const mongoose = require("mongoose");

const email = String(process.argv[2] || "")
  .trim()
  .toLowerCase();

if (!email) {
  console.error("Usage: node scripts/deleteUserByEmail.js <email>");
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    console.log(JSON.stringify({ email, status: "NOT_FOUND" }));
    await mongoose.disconnect();
    return;
  }

  const uid = user._id;
  const deleted = {};

  deleted.users = (await db.collection("users").deleteOne({ _id: uid }))
    .deletedCount;

  const related = [
    ["otps", { email }],
    ["oauthlogincodes", { email }],
    ["teaminvitations", { email }],
    ["searchhistories", { userId: uid }],
    ["follows", { $or: [{ follower: uid }, { following: uid }] }],
    ["votes", { user: uid }],
    ["carts", { user: uid }],
    ["orders", { user: uid }],
    ["userbadges", { user: uid }],
    ["usersyllabuses", { userId: uid }],
    ["userpracticeprogresses", { user: uid }],
    ["premiuminterests", { userId: uid }],
  ];

  for (const [col, filter] of related) {
    try {
      deleted[col] = (await db.collection(col).deleteMany(filter)).deletedCount;
    } catch {
      deleted[col] = "skip";
    }
  }

  console.log(
    JSON.stringify(
      {
        email,
        userId: String(uid),
        status: "DELETED",
        deleted,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
})().catch(async (err) => {
  console.error("ERR", err.message);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
