/**
 * Canonical app factory
 * Tests import app.js — the same stack production boots from server.js.
 */

const request = require("supertest");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-for-testing-only";
process.env.NODE_ENV = "test";

const app = require("../app");

describe("canonical Express app", () => {
  test("exports an Express app factory used by production", () => {
    expect(typeof app).toBe("function");
    expect(typeof app.createApp).toBe("function");
    const clone = app.createApp();
    expect(typeof clone).toBe("function");
    expect(clone).not.toBe(app);
  });

  test("serves the production health and probe routes", async () => {
    const root = await request(app).get("/");
    expect(root.status).toBe(200);
    expect(root.text).toMatch(/MEDHA Backend is running/i);

    const probe = await request(app).get("/api/test-fix");
    expect(probe.status).toBe(200);
    expect(probe.body.security.rateLimiting).toBe(true);
    expect(probe.body.security.helmet).toBe(true);

    const health = await request(app).get("/health");
    expect([200, 503]).toContain(health.status);
    expect(health.body).toHaveProperty("database");
  });

  test("keeps production-only routes that the old app.js omitted", async () => {
    const todos = await request(app).get("/api/todos");
    const rtu = await request(app).get("/api/rtu/3rd-sem");
    const team = await request(app).get("/api/team");

    expect(todos.status).toBe(401);
    expect(rtu.status).toBe(401);
    expect(team.status).toBe(401);
  });

  test("server.js re-exports the same app and does not listen when required", () => {
    const fromServer = require("../server");
    expect(fromServer).toBe(app);
  });
});
