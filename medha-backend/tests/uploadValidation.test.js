/**
 * Note upload validation
 * Covers size limits, spoofed extensions, MIME mismatches, and temp-file cleanup.
 */

jest.mock("../utils/noteModerator", () => ({
  extractPdfText: jest.fn().mockResolvedValue(""),
  moderateNote: jest.fn(),
}));

jest.mock("../utils/cloudinaryUpload", () => ({
  uploadToCloudinary: jest.fn(),
  CLOUDINARY_MAX_BYTES: 10 * 1024 * 1024,
}));

const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");

const {
  detectTypeFromHeader,
  matchDeclaredType,
  validateFileIdentity,
} = require("../utils/fileSignature");
const upload = require("../middleware/upload");
const { extractPdfText, moderateNote } = require("../utils/noteModerator");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const noteController = require("../controllers/noteController");
const User = require("../models/User");

const MINIMAL_PDF = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n");
const MINIMAL_JPEG = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01,
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xd9,
]);
const MINIMAL_PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49,
  0x48, 0x44, 0x52,
]);

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "medha-upload-"));
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => !name.startsWith("."));
}

async function waitUntilGone(filePath, attempts = 25) {
  for (let i = 0; i < attempts; i += 1) {
    if (!fs.existsSync(filePath)) return;
    await new Promise((resolve) => setTimeout(resolve, 15));
  }
}

function buildUploadApp({ destDir, fileSize = 1024 }) {
  const app = express();
  const uploader = upload.create({ destDir, fileSize });
  let reachedHandler = false;

  app.post(
    "/upload",
    uploader.single("file"),
    upload.validateFile,
    (req, res) => {
      reachedHandler = true;
      res.status(200).json({
        ok: true,
        filename: req.file?.filename,
        detectedType: req.file?.detectedType,
      });
    }
  );
  app.use(upload.handleUploadError);

  return {
    app,
    wasHandlerReached: () => reachedHandler,
  };
}

describe("file signatures", () => {
  test("detects PDF, JPEG, PNG, and GIF magic bytes", () => {
    expect(detectTypeFromHeader(MINIMAL_PDF)).toBe("pdf");
    expect(detectTypeFromHeader(MINIMAL_JPEG)).toBe("jpeg");
    expect(detectTypeFromHeader(MINIMAL_PNG)).toBe("png");
    expect(detectTypeFromHeader(Buffer.from("GIF89a"))).toBe("gif");
    expect(detectTypeFromHeader(Buffer.from("not-a-file"))).toBeNull();
  });

  test("requires matching extension and MIME before looking at content", () => {
    expect(
      matchDeclaredType({ originalname: "notes.pdf", mimetype: "application/pdf" }).ok
    ).toBe(true);
    expect(
      matchDeclaredType({ originalname: "notes.pdf", mimetype: "image/jpeg" }).ok
    ).toBe(false);
    expect(
      matchDeclaredType({ originalname: "notes.exe", mimetype: "application/pdf" }).ok
    ).toBe(false);
  });

  test("rejects spoofed extensions and MIME/content mismatches", () => {
    const jpegAsPdf = validateFileIdentity({
      originalname: "notes.pdf",
      mimetype: "application/pdf",
      header: MINIMAL_JPEG,
    });
    expect(jpegAsPdf.ok).toBe(false);

    const pdfAsJpeg = validateFileIdentity({
      originalname: "photo.jpg",
      mimetype: "image/jpeg",
      header: MINIMAL_PDF,
    });
    expect(pdfAsJpeg.ok).toBe(false);

    const validPdf = validateFileIdentity({
      originalname: "notes.pdf",
      mimetype: "application/pdf",
      header: MINIMAL_PDF,
    });
    expect(validPdf).toMatchObject({ ok: true, type: "pdf" });
  });
});

describe("upload middleware", () => {
  let destDir;

  beforeEach(() => {
    destDir = makeTempDir();
  });

  afterEach(() => {
    fs.rmSync(destDir, { recursive: true, force: true });
  });

  test("accepts a real PDF whose MIME and extension match", async () => {
    const { app, wasHandlerReached } = buildUploadApp({ destDir });

    const res = await request(app)
      .post("/upload")
      .attach("file", MINIMAL_PDF, { filename: "notes.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(200);
    expect(res.body.detectedType).toBe("pdf");
    expect(wasHandlerReached()).toBe(true);
  });

  test("rejects oversized files with 413 and does not keep them on disk", async () => {
    const { app, wasHandlerReached } = buildUploadApp({ destDir, fileSize: 64 });
    const oversized = Buffer.concat([MINIMAL_PDF, Buffer.alloc(200, 65)]);

    const res = await request(app)
      .post("/upload")
      .attach("file", oversized, { filename: "huge.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(413);
    expect(res.body.error).toMatch(/too large/i);
    expect(wasHandlerReached()).toBe(false);
    expect(listFiles(destDir)).toEqual([]);
  });

  test("rejects a JPEG pretending to be a PDF and deletes the temp file", async () => {
    const { app, wasHandlerReached } = buildUploadApp({ destDir });

    const res = await request(app)
      .post("/upload")
      .attach("file", MINIMAL_JPEG, {
        filename: "notes.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/does not match/i);
    expect(wasHandlerReached()).toBe(false);
    expect(listFiles(destDir)).toEqual([]);
  });

  test("rejects MIME type that does not match the extension", async () => {
    const { app, wasHandlerReached } = buildUploadApp({ destDir });

    const res = await request(app)
      .post("/upload")
      .attach("file", MINIMAL_PDF, {
        filename: "notes.pdf",
        contentType: "image/jpeg",
      });

    expect(res.status).toBe(400);
    expect(wasHandlerReached()).toBe(false);
    expect(listFiles(destDir)).toEqual([]);
  });

  test("rejects a PDF pretending to be a JPEG", async () => {
    const { app, wasHandlerReached } = buildUploadApp({ destDir });

    const res = await request(app)
      .post("/upload")
      .attach("file", MINIMAL_PDF, {
        filename: "photo.jpg",
        contentType: "image/jpeg",
      });

    expect(res.status).toBe(400);
    expect(wasHandlerReached()).toBe(false);
    expect(listFiles(destDir)).toEqual([]);
  });
});

describe("uploadNote cleanup", () => {
  let destDir;
  let owner;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });

  beforeEach(async () => {
    destDir = makeTempDir();
    owner = await User.create({
      name: "Upload Tester",
      email: `upload${Date.now()}@example.com`,
      password: "password123",
    });
    moderateNote.mockReset();
    extractPdfText.mockReset();
    uploadToCloudinary.mockReset();
    extractPdfText.mockResolvedValue("lecture notes");
    uploadToCloudinary.mockResolvedValue({ url: "https://cdn.example/notes.pdf" });
  });

  afterEach(() => {
    fs.rmSync(destDir, { recursive: true, force: true });
  });

  function mockReqRes(overrides = {}) {
    const filePath = path.join(destDir, `${Date.now()}-notes.pdf`);
    fs.writeFileSync(filePath, MINIMAL_PDF);

    const req = {
      user: { _id: owner._id },
      body: {
        title: "Unit 1 notes",
        subjectTag: "DBMS",
        content: "",
      },
      file: {
        path: filePath,
        filename: path.basename(filePath),
        originalname: "notes.pdf",
        mimetype: "application/pdf",
        size: MINIMAL_PDF.length,
        detectedType: "pdf",
      },
      ...overrides,
    };

    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };

    return { req, res, filePath };
  }

  test("removes the temp file when moderation rejects the upload", async () => {
    moderateNote.mockResolvedValue({
      allowed: false,
      reason: "This does not look like study material.",
      label: "rejected",
    });
    const { req, res, filePath } = mockReqRes();

    await noteController.uploadNote(req, res);
    await waitUntilGone(filePath);

    expect(res.statusCode).toBe(400);
    expect(fs.existsSync(filePath)).toBe(false);
    expect(uploadToCloudinary).not.toHaveBeenCalled();
  });

  test("removes the temp file when moderation is unavailable", async () => {
    moderateNote.mockRejectedValue(new Error("groq down"));
    const { req, res, filePath } = mockReqRes();

    await noteController.uploadNote(req, res);
    await waitUntilGone(filePath);

    expect(res.statusCode).toBe(503);
    expect(fs.existsSync(filePath)).toBe(false);
    expect(uploadToCloudinary).not.toHaveBeenCalled();
  });

  test("does not run moderation when title is missing and still deletes the file", async () => {
    const { req, res, filePath } = mockReqRes();
    req.body.title = "";

    await noteController.uploadNote(req, res);
    await waitUntilGone(filePath);

    expect(res.statusCode).toBe(400);
    expect(moderateNote).not.toHaveBeenCalled();
    expect(extractPdfText).not.toHaveBeenCalled();
    expect(fs.existsSync(filePath)).toBe(false);
  });
});
