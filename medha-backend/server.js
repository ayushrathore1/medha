// ============================================
// Process entry point — listen + MongoDB only.
// The Express app itself lives in app.js.
// Hostinger may `require()` this file and call listen on the
// exported app itself — so Mongo must connect outside startServer().
// ============================================
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

console.log("🔍 [STARTUP] server.js loaded, Node.js version:", process.version);

require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

console.log("🔍 [STARTUP] Environment:", process.env.NODE_ENV || "not set");
console.log("🔍 [STARTUP] PORT:", process.env.PORT || "not set (will use 3000)");
console.log("🔍 [STARTUP] MONGO_URI:", process.env.MONGO_URI ? "✅ set" : "❌ NOT SET");
console.log("🔍 [STARTUP] JWT_SECRET:", process.env.JWT_SECRET ? "✅ set" : "❌ NOT SET");
console.log("🔍 [STARTUP] All modules loaded successfully");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/medha";
const isTest =
  process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);

const mongoOptions = {
  maxPoolSize: 50,
  minPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
};

let server;
let mongoConnectPromise = null;

const gracefulShutdown = async (signal) => {
  console.log(`\n[${signal}] Graceful shutdown initiated...`);

  if (server) {
    server.close(() => {
      console.log("✅ HTTP server closed");
    });
  }

  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
  }
};

function connectMongo() {
  if (isTest) return Promise.resolve();

  // already connected / connecting
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }
  if (mongoConnectPromise) return mongoConnectPromise;

  console.log("🔌 Connecting to MongoDB…");
  mongoConnectPromise = mongoose
    .connect(MONGO_URI, mongoOptions)
    .then(() => {
      console.log("✅ Connected to MongoDB");
      console.log(
        `📊 Connection pool: ${mongoOptions.maxPoolSize} max connections`
      );
      return mongoose.connection;
    })
    .catch((err) => {
      mongoConnectPromise = null;
      console.error("❌ MongoDB connection error:", err.message);
      console.error("⚠️ Server running WITHOUT database connection");
      throw err;
    });

  return mongoConnectPromise;
}

function startServer() {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  // Bind to 0.0.0.0 — required for Hostinger Passenger
  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 MEDHA backend running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });

  server.timeout = 30000;
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  return server;
}

// Always open Mongo in non-test runs (Hostinger require() path included).
connectMongo().catch(() => {
  // Error already logged; keep HTTP up so health checks still respond.
});

if (require.main === module) {
  startServer();
  try {
    const { startNoteScanWorker } = require("./utils/noteScanWorker");
    startNoteScanWorker();
  } catch (err) {
    console.warn("Note scan worker not started:", err.message);
  }
}

// Same app instance tests import from app.js. Requiring this file does not listen.
module.exports = app;
