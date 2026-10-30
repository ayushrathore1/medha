/**
 * JSON, urlencoded, and multipart size limits
 */

const request = require("supertest");
const path = require("path");
const fs = require("fs");
const os = require("os");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-for-testing-only";
process.env.NODE_ENV = "test";

const {
  JSON_LIMIT_BYTES,
  PAYLOAD_TOO_LARGE_MESSAGE,
} = require("../config/bodyLimits");
const app = require("../app");
const upload = require("../middleware/upload");

const MINIMAL_PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n"
);

describe("request body limits", () => {
  test("rejects JSON over the global cap with 413", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "size-test@example.com",
        password: "a".repeat(JSON_LIMIT_BYTES + 2048),
      });

    expect(res.status).toBe(413);
    expect(res.body.message).toBe(PAYLOAD_TOO_LARGE_MESSAGE);
    expect(res.body.success).toBe(false);
  });

  test("rejects urlencoded bodies over the global cap with 413", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .type("form")
      .send({
        email: "size-test@example.com",
        password: "b".repeat(JSON_LIMIT_BYTES + 2048),
      });

    expect(res.status).toBe(413);
    expect(res.body.message).toBe(PAYLOAD_TOO_LARGE_MESSAGE);
  });

  test("still accepts a small JSON login payload", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "size-test@example.com", password: "password123" });

    expect([400, 401]).toContain(res.status);
  });
});

describe("multipart uploads stay on their own limit", () => {
  let destDir;

  beforeEach(() => {
    destDir = fs.mkdtempSync(path.join(os.tmpdir(), "medha-body-limit-"));
  });

  afterEach(() => {
    fs.rmSync(destDir, { recursive: true, force: true });
  });

  test("a small PDF under the note cap is not rejected by the JSON body limit", async () => {
    const mini = expressWithUpload(destDir, 1024);

    const res = await request(mini)
      .post("/upload")
      .attach("file", MINIMAL_PDF, {
        filename: "notes.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test("an oversized multipart file is 413 from Multer, not the JSON parser", async () => {
    const mini = expressWithUpload(destDir, 64);
    const oversized = Buffer.concat([MINIMAL_PDF, Buffer.alloc(200, 65)]);

    const res = await request(mini)
      .post("/upload")
      .attach("file", oversized, {
        filename: "huge.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).toBe(413);
    expect(res.body.error).toMatch(/too large/i);
  });
});

function expressWithUpload(destDir, fileSize) {
  const express = require("express");
  const mini = express();
  const uploader = upload.create({ destDir, fileSize });
  mini.post(
    "/upload",
    uploader.single("file"),
    upload.validateFile,
    (req, res) => {
      res.status(200).json({ ok: true });
    }
  );
  mini.use(upload.handleUploadError);
  return mini;
}
