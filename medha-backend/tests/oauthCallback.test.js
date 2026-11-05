/**
 * Google OAuth callback security tests
 * - CSRF state cookie is required
 * - Redirect URLs never include JWTs or Google tokens
 * - One-time login code is exchanged over POST
 */

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-jwt-secret-for-testing-only";
process.env.NODE_ENV = "test";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";
process.env.FRONTEND_URL = "http://localhost:5173";

const User = require("../models/User");
const OAuthLoginCode = require("../models/OAuthLoginCode");
const {
  resolveFrontendUrl,
  validateOAuthState,
  locationContainsCredential,
  STATE_COOKIE,
} = require("../utils/oauthCallback");

let app;
const originalFetch = global.fetch;
let logs = [];

function captureLogs(...args) {
  logs.push(args.map((part) => (typeof part === "string" ? part : JSON.stringify(part))).join(" "));
}

function cookieHeader(res) {
  const raw = res.headers["set-cookie"];
  if (!raw) return "";
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((cookie) => cookie.split(";")[0]).join("; ");
}

function cookieLine(res, name) {
  const raw = res.headers["set-cookie"];
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.find((cookie) => cookie.startsWith(`${name}=`)) || "";
}

function mockGoogleApis(profile = {
  id: "google-user-1",
  email: "google.user@example.com",
  name: "Google User",
  picture: "https://example.com/avatar.png",
}) {
  global.fetch = jest.fn(async (url) => {
    const href = String(url);
    if (href.includes("oauth2.googleapis.com/token")) {
      return {
        ok: true,
        json: async () => ({ access_token: "google-access-token" }),
      };
    }
    if (href.includes("googleapis.com/oauth2/v2/userinfo")) {
      return {
        ok: true,
        json: async () => profile,
      };
    }
    throw new Error(`unexpected fetch ${href}`);
  });
}

async function startGoogleLogin() {
  const res = await request(app).get("/api/auth/google").redirects(0);
  expect(res.status).toBe(302);
  const location = new URL(res.headers.location);
  return {
    res,
    state: location.searchParams.get("state"),
    cookie: cookieHeader(res),
  };
}

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  app = require("../app");
});

beforeEach(() => {
  logs = [];
  jest.spyOn(console, "log").mockImplementation(captureLogs);
  jest.spyOn(console, "error").mockImplementation(captureLogs);
  jest.spyOn(console, "warn").mockImplementation(captureLogs);
});

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("OAuth frontend origin allowlist", () => {
  const previousFrontend = process.env.FRONTEND_URL;
  const previousAllowed = process.env.OAUTH_ALLOWED_ORIGINS;

  afterEach(() => {
    process.env.FRONTEND_URL = previousFrontend;
    if (previousAllowed === undefined) {
      delete process.env.OAUTH_ALLOWED_ORIGINS;
    } else {
      process.env.OAUTH_ALLOWED_ORIGINS = previousAllowed;
    }
  });

  test("rejects an unlisted FRONTEND_URL and falls back to localhost", () => {
    process.env.FRONTEND_URL = "https://evil.example";
    expect(resolveFrontendUrl()).toBe("http://localhost:5173");
  });

  test("allows the configured production origin", () => {
    process.env.FRONTEND_URL = "https://medharevision.shopcampuskart.in";
    expect(resolveFrontendUrl()).toBe("https://medharevision.shopcampuskart.in");
  });

  test("allows extra origins from OAUTH_ALLOWED_ORIGINS", () => {
    process.env.FRONTEND_URL = "https://preview.example";
    process.env.OAUTH_ALLOWED_ORIGINS = "https://preview.example";
    expect(resolveFrontendUrl()).toBe("https://preview.example");
  });
});

describe("OAuth state validation", () => {
  test("rejects missing cookie or query state", () => {
    expect(validateOAuthState({ query: {}, headers: {} })).toBe(false);
    expect(
      validateOAuthState({
        query: { state: "abc" },
        headers: { cookie: "" },
      })
    ).toBe(false);
  });

  test("accepts matching cookie and query state", () => {
    expect(
      validateOAuthState({
        query: { state: "abc123" },
        headers: { cookie: `${STATE_COOKIE}=abc123` },
      })
    ).toBe(true);
  });

  test("rejects mismatched state", () => {
    expect(
      validateOAuthState({
        query: { state: "abc123" },
        headers: { cookie: `${STATE_COOKIE}=other` },
      })
    ).toBe(false);
  });
});

describe("GET /api/auth/google", () => {
  test("sets an HttpOnly oauth_state cookie and sends the same state to Google", async () => {
    const { res, state } = await startGoogleLogin();
    const setCookie = cookieLine(res, STATE_COOKIE);

    expect(state).toHaveLength(64);
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).toContain("Path=/api/auth");
    expect(setCookie).toContain(`${STATE_COOKIE}=${state}`);
    expect(res.headers.location).toContain("accounts.google.com");
    expect(locationContainsCredential(res.headers.location)).toBe(false);
  });
});

describe("GET /api/auth/google/callback", () => {
  test("rejects callbacks without a matching state cookie", async () => {
    const res = await request(app)
      .get("/api/auth/google/callback")
      .query({ code: "google-code", state: "forged-state" })
      .redirects(0)
      .expect(302);

    const location = res.headers.location;
    expect(location).toContain("error=google_invalid_state");
    expect(locationContainsCredential(location)).toBe(false);
    expect(await OAuthLoginCode.countDocuments()).toBe(0);
  });

  test("rejects callbacks when query state does not match the cookie", async () => {
    const start = await startGoogleLogin();

    const res = await request(app)
      .get("/api/auth/google/callback")
      .set("Cookie", start.cookie)
      .query({ code: "google-code", state: "not-the-cookie-state" })
      .redirects(0)
      .expect(302);

    expect(res.headers.location).toContain("error=google_invalid_state");
    expect(locationContainsCredential(res.headers.location)).toBe(false);
  });

  test("redirects with a one-time code and never puts the JWT in the URL", async () => {
    mockGoogleApis();
    const start = await startGoogleLogin();

    const res = await request(app)
      .get("/api/auth/google/callback")
      .set("Cookie", start.cookie)
      .query({ code: "google-auth-code", state: start.state })
      .redirects(0)
      .expect(302);

    const location = new URL(res.headers.location);
    expect(location.origin).toBe("http://localhost:5173");
    expect(location.pathname).toBe("/auth/google/success");
    expect(location.searchParams.get("code")).toMatch(/^[a-f0-9]{64}$/);
    expect(location.searchParams.get("token")).toBeNull();
    expect(location.searchParams.get("user")).toBeNull();
    expect(locationContainsCredential(res.headers.location)).toBe(false);

    const stored = await OAuthLoginCode.findOne({
      code: location.searchParams.get("code"),
    });
    expect(stored).toBeTruthy();
    expect(stored.used).toBe(false);
    expect(jwt.verify(stored.token, process.env.JWT_SECRET).email).toBe(
      "google.user@example.com"
    );

    const logBlob = logs.join("\n");
    expect(logBlob).not.toContain(stored.token);
    expect(logBlob).not.toContain("google-access-token");
    expect(logBlob.toLowerCase()).not.toContain("eyj");
  });
});

describe("POST /api/auth/google/exchange", () => {
  test("returns the JWT once and rejects reuse", async () => {
    mockGoogleApis();
    const start = await startGoogleLogin();

    const callback = await request(app)
      .get("/api/auth/google/callback")
      .set("Cookie", start.cookie)
      .query({ code: "google-auth-code", state: start.state })
      .redirects(0)
      .expect(302);

    const code = new URL(callback.headers.location).searchParams.get("code");

    const first = await request(app)
      .post("/api/auth/google/exchange")
      .send({ code })
      .expect(200);

    expect(first.body.token).toBeTruthy();
    expect(first.body.user.email).toBe("google.user@example.com");
    expect(jwt.verify(first.body.token, process.env.JWT_SECRET).email).toBe(
      "google.user@example.com"
    );

    await request(app).post("/api/auth/google/exchange").send({ code }).expect(400);
  });

  test("rejects expired and missing codes", async () => {
    await OAuthLoginCode.create({
      code: "expired-login-code",
      token: "fake-token",
      user: { email: "gone@example.com" },
      expiresAt: new Date(Date.now() - 1000),
    });

    await request(app)
      .post("/api/auth/google/exchange")
      .send({ code: "expired-login-code" })
      .expect(400);

    await request(app).post("/api/auth/google/exchange").send({}).expect(400);
  });
});
