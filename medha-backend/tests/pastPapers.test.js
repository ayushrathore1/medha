const request = require("supertest");
const mongoose = require("mongoose");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-for-testing-only";
process.env.NODE_ENV = "test";
process.env.PLATFORM_OPEN = "true";

const PastPaper = require("../models/PastPaper");

let app;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  app = require("../app");
});

afterEach(async () => {
  await PastPaper.deleteMany({});
});

describe("GET /api/past-papers", () => {
  test("meta returns CSE catalog shell with target years", async () => {
    const res = await request(app).get("/api/past-papers/meta?branch=CSE").expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.branch).toBe("CSE");
    expect(res.body.targetYears).toHaveLength(5);
    expect(res.body.semesters.length).toBe(8);
    const sem3 = res.body.semesters.find((s) => s.semester === 3);
    expect(sem3.subjects.length).toBeGreaterThan(0);
    expect(sem3.paperCount).toBe(0);
  });

  test("lists hosted papers and download redirect", async () => {
    const paper = await PastPaper.create({
      university: "RTU",
      branch: "CSE",
      semester: 3,
      subjectName: "Data Structures and Algorithms",
      subjectCode: "3CS4-04",
      year: 2024,
      examType: "main",
      fileUrl:
        "https://res.cloudinary.com/demo/raw/upload/v1/pyq/rtu/cse/sem-03/dsa/2024.pdf",
      cloudinaryPublicId: "pyq/rtu/cse/sem-03/dsa/2024.pdf",
    });

    const list = await request(app)
      .get("/api/past-papers?branch=CSE&semester=3")
      .expect(200);
    expect(list.body.count).toBe(1);
    expect(list.body.papers[0].subjectName).toMatch(/Data Structures/);

    const dl = await request(app)
      .get(`/api/past-papers/${paper._id}/download?redirect=0`)
      .expect(200);
    expect(dl.body.fileUrl).toMatch(/api\.cloudinary\.com\/.+\/raw\/download/);
    expect(dl.body.fileUrl).toMatch(/signature=/);

    const refreshed = await PastPaper.findById(paper._id);
    expect(refreshed.downloadCount).toBe(1);
  });

  test("mirrors AIDS branch filter independently", async () => {
    await PastPaper.create({
      university: "RTU",
      branch: "AIDS",
      semester: 3,
      subjectName: "Data Structures and Algorithms",
      year: 2023,
      fileUrl: "https://example.com/dsa-2023.pdf",
    });

    const cse = await request(app).get("/api/past-papers?branch=CSE&semester=3").expect(200);
    expect(cse.body.count).toBe(0);

    const aids = await request(app).get("/api/past-papers?branch=AIDS&semester=3").expect(200);
    expect(aids.body.count).toBe(1);
  });
});
