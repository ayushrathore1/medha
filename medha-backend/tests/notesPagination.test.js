const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-for-testing-only";
process.env.NODE_ENV = "test";

const User = require("../models/User");
const Note = require("../models/Note");
const { MAX_LIMIT } = require("../utils/notePagination");

let app;
let user;
let token;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  app = require("../app");
});

beforeEach(async () => {
  user = await User.create({
    name: "Notes Owner",
    email: `notes${Date.now()}@example.com`,
    password: "password123",
  });
  token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
});

async function seedNotes(count, overrides = {}) {
  const docs = [];
  for (let i = 0; i < count; i += 1) {
    docs.push({
      title: `Note ${i}`,
      content: `full-content-${i}-${"x".repeat(300)}`,
      extractedText: `secret-extract-${i}`,
      owner: user._id,
      isPublic: true,
      verificationStatus: "approved",
      createdAt: new Date(Date.now() - i * 1000),
      ...overrides,
    });
  }
  return Note.insertMany(docs);
}

describe("GET /api/notes pagination", () => {
  test("rejects invalid limit and page", async () => {
    const badLimit = await request(app)
      .get("/api/notes?limit=-1")
      .set("Authorization", `Bearer ${token}`);
    expect(badLimit.status).toBe(400);

    const badPage = await request(app)
      .get("/api/notes?page=abc")
      .set("Authorization", `Bearer ${token}`);
    expect(badPage.status).toBe(400);
  });

  test("returns an empty page with pagination metadata", async () => {
    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.notes).toEqual([]);
    expect(res.body.pagination).toMatchObject({
      limit: 20,
      page: 1,
      hasMore: false,
      nextCursor: null,
    });
  });

  test("clamps limit to the maximum and omits heavy fields", async () => {
    await seedNotes(3, { isPublic: false });

    const res = await request(app)
      .get("/api/notes?limit=999")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.pagination.limit).toBe(MAX_LIMIT);
    expect(res.body.notes).toHaveLength(3);
    expect(res.body.notes[0]).not.toHaveProperty("extractedText");
    expect(res.body.notes[0].content.length).toBeLessThanOrEqual(240);
  });
});

describe("GET /api/notes/public pagination", () => {
  test("rejects an invalid cursor", async () => {
    const res = await request(app).get("/api/notes/public?cursor=not-a-cursor");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cursor/i);
  });

  test("pages stably with a cursor and does not overlap", async () => {
    await seedNotes(5);

    const first = await request(app)
      .get("/api/notes/public?limit=2")
      .expect(200);

    expect(first.body.notes).toHaveLength(2);
    expect(first.body.pagination.hasMore).toBe(true);
    expect(first.body.pagination.nextCursor).toBeTruthy();
    expect(first.body.notes[0].title).toBe("Note 0");
    expect(first.body.notes[1].title).toBe("Note 1");

    const second = await request(app)
      .get(
        `/api/notes/public?limit=2&cursor=${encodeURIComponent(
          first.body.pagination.nextCursor
        )}`
      )
      .expect(200);

    const firstIds = first.body.notes.map((note) => String(note._id));
    const secondIds = second.body.notes.map((note) => String(note._id));
    expect(secondIds).toHaveLength(2);
    expect(secondIds.some((id) => firstIds.includes(id))).toBe(false);
    expect(second.body.notes[0].title).toBe("Note 2");
  });

  test("page 2 via offset does not repeat page 1", async () => {
    await seedNotes(5);

    const page1 = await request(app).get("/api/notes/public?limit=2&page=1");
    const page2 = await request(app).get("/api/notes/public?limit=2&page=2");

    expect(page1.body.notes.map((n) => n.title)).toEqual(["Note 0", "Note 1"]);
    expect(page2.body.notes.map((n) => n.title)).toEqual(["Note 2", "Note 3"]);
  });
});
