/**
 * Canonical Express app factory.
 *
 * Tests import this module. Production boots it from server.js.
 * This file must not listen on a port or connect to MongoDB.
 *
 * Middleware / route order:
 *  1. Helmet
 *  2. Compression
 *  3. CORS
 *  4. Static /uploads/notes
 *  5. Body size validator
 *  6. JSON + urlencoded parsers
 *  7. mongo-sanitize, HPP, security logger, suspicious-activity, timeout
 *  8. General rate limiter
 *  9. Health routes (/, /health, /api/test-fix)
 * 10. API routes (auth limiter / AI limiter applied per mount)
 * 11. 404 handler
 * 12. Upload error handler, then global error handler
 */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const compression = require("compression");

const {
  generalLimiter,
  authLimiter,
  aiLimiter,
} = require("./middleware/rateLimit");
const {
  helmetMiddleware,
  mongoSanitizeMiddleware,
  hppMiddleware,
  requestTimeout,
  securityLogger,
  suspiciousActivityDetector,
  bodySizeValidator,
} = require("./middleware/security");

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const noteRoutes = require("./routes/noteRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const chatHistoryRoutes = require("./routes/chatHistoryRoutes");
const todoRoutes = require("./routes/todoRoutes");
const dashboardRoutes = require("./routes/dashboard");
const quizRoutes = require("./routes/quizRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const userRoutes = require("./routes/userRoutes");
const rtuRoutes = require("./routes/rtuRoutes");
const learnRoutes = require("./routes/learnRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const practiceRoutes = require("./routes/practiceRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const chatStreamRoutes = require("./routes/chatStreamRoutes");
const { router: authExtraRoutes } = require("./routes/authExtraRoutes");
const campusCartRoutes = require("./routes/campusCartRoutes");

const CHARCHA_ENABLED = process.env.ENABLE_CHARCHA === "true";
const charchaRoutes = CHARCHA_ENABLED
  ? require("./routes/charchaRoutes")
  : null;

const allowedOrigins = [
  "https://medha-revision.vercel.app",
  "https://medha-revision.pages.dev",
  "https://medha.codelearnn.com",
  "http://medha.codelearnn.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:5173",
  "http://localhost:5000",
];

function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmetMiddleware);
  app.use(compression());

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.warn(`[CORS] Blocked origin: ${origin}`);
          callback(new Error("CORS policy: This origin is not allowed"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
      maxAge: 86400,
    })
  );

  app.use(
    "/uploads/notes",
    express.static(path.join(__dirname, "uploads", "notes"))
  );

  const { JSON_LIMIT_BYTES, mapPayloadTooLargeError } = require("./config/bodyLimits");
  app.use(bodySizeValidator);
  app.use(express.json({ limit: JSON_LIMIT_BYTES }));
  app.use(express.urlencoded({ extended: true, limit: JSON_LIMIT_BYTES }));

  app.use(mongoSanitizeMiddleware);
  app.use(hppMiddleware);
  app.use(securityLogger);
  app.use(suspiciousActivityDetector);
  app.use(requestTimeout(30000));
  app.use(generalLimiter);

  app.get("/health", async (req, res) => {
    const healthCheck = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
      },
      database: {
        status:
          mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        name: mongoose.connection.name || "N/A",
      },
    };

    const statusCode = mongoose.connection.readyState === 1 ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  });

  app.get("/", (req, res) => {
    res.send("MEDHA Backend is running!");
  });

  app.get("/api/test-fix", (req, res) => {
    res.json({
      message: "Server is updated with security enhancements!",
      version: "2.0.0",
      security: {
        rateLimiting: true,
        helmet: true,
        mongoSanitization: true,
        compression: true,
      },
    });
  });

  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/auth", authLimiter, authExtraRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/notes", noteRoutes);
  app.use("/api/flashcards", flashcardRoutes);
  app.use("/api/todos", todoRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/quizzes", quizRoutes);
  app.use("/api/rtu", rtuRoutes);
  app.use("/api/learn", learnRoutes);
  app.use("/api/practice", practiceRoutes);
  app.use("/api/search", require("./routes/searchRoutes"));
  app.use("/api/chatbot", aiLimiter, chatbotRoutes);
  app.use("/api/chat", aiLimiter, chatStreamRoutes);
  app.use("/api/voice", aiLimiter, voiceRoutes);
  app.use("/api/chat-history", chatHistoryRoutes);
  app.use("/api/ocr", aiLimiter, ocrRoutes);
  app.use("/api/recommendations", aiLimiter, recommendationRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/premium", require("./routes/premiumRoutes"));
  app.use("/api/wallpapers", require("./routes/wallpaperRoutes"));
  app.use("/api/campus-cart", campusCartRoutes);

  if (CHARCHA_ENABLED) {
    app.use("/api/charcha", charchaRoutes);
    console.log("💬 Charcha feature: Enabled");
  }

  app.use("/api/admin", require("./routes/adminRoutes"));
  app.use("/api/suggestions", require("./routes/suggestionRoutes"));
  app.use("/api/team", require("./routes/teamRoutes"));
  app.use("/api/seed", require("./routes/seedRoutes"));

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`,
    });
  });

  const { handleUploadError } = require("./middleware/upload");
  app.use(handleUploadError);
  app.use((err, req, res, next) => {
    const oversized = mapPayloadTooLargeError(err);
    if (oversized) {
      return res.status(oversized.status).json({
        success: false,
        error: oversized.message,
        message: oversized.message,
      });
    }

    console.error(`[ERROR] ${err.message}`, err.stack);

    const isProduction = process.env.NODE_ENV === "production";

    res.status(err.status || err.statusCode || 500).json({
      success: false,
      message: isProduction ? "An error occurred" : err.message,
      ...(isProduction ? {} : { stack: err.stack }),
    });
  });

  return app;
}

const app = createApp();
module.exports = app;
module.exports.createApp = createApp;
