/**
 * Global setup for Jest tests
 * Starts in-memory MongoDB server
 */

const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  console.log('\n🔧 Starting in-memory MongoDB for tests...');
  
  const mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'medha-test'
    }
  });
  
  const uri = mongod.getUri();
  
  // Store for use in tests and teardown
  global.__MONGOD__ = mongod;
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing-only';
  process.env.NODE_ENV = 'test';
  process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'ci-placeholder';
  process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'ci-placeholder';
  process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'ci-placeholder';
  process.env.OCRSPACE_API_KEY = process.env.OCRSPACE_API_KEY || 'ci-placeholder';
  process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || 'ci-placeholder';
  process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'ci-placeholder';
  process.env.SMTP_USER = process.env.SMTP_USER || 'ci@example.com';
  process.env.SMTP_PASS = process.env.SMTP_PASS || 'ci-placeholder';
  process.env.MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || 'auth@medharevision.shopcampuskart.in';
  process.env.HOSTINGER_MAIL_API_TOKEN = process.env.HOSTINGER_MAIL_API_TOKEN || 'ci-placeholder';
  
  console.log(`✅ Test MongoDB running at: ${uri}\n`);
};
