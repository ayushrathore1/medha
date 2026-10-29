// ============================================
// Process entry point — listen + MongoDB only.
// The Express app itself lives in app.js.
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

const mongoOptions = {
  maxPoolSize: 50,
  minPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

let server;

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

  mongoose
    .connect(MONGO_URI, mongoOptions)
    .then(() => {
      console.log("✅ Connected to MongoDB");
      console.log(
        `📊 Connection pool: ${mongoOptions.maxPoolSize} max connections`
      );
      console.log("🔒 Security middleware: Enabled");
      console.log("⚡ Rate limiting: Enabled");
      console.log("🗜️  Compression: Enabled");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      console.error("⚠️ Server running WITHOUT database connection");
    });

  return server;
}

if (require.main === module) {
  startServer();
}

// Same app instance tests import from app.js. Requiring this file does not listen.
module.exports = app;
