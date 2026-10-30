const learnRoutes = require("../routes/learnRoutes");
const { formatSeconds } = require("../utils/learnFormat");

function listedRoutes(router) {
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => {
      const method = Object.keys(layer.route.methods)[0].toUpperCase();
      return `${method} ${layer.route.path}`;
    });
}

describe("learn routes split", () => {
  test("keeps the original public, admin, and slide paths", () => {
    expect(listedRoutes(learnRoutes)).toEqual([
      "GET /subjects",
      "GET /subjects/:subject/content",
      "POST /:contentId/like",
      "POST /:contentId/view",
      "GET /:contentId",
      "POST /admin/content",
      "GET /admin/imagekit-auth",
      "PATCH /admin/content/:contentId",
      "DELETE /admin/content/:contentId",
      "GET /admin/subjects",
      "PATCH /:id/slide/:step",
      "POST /:id/view",
      "POST /:id/slide/:step/voice",
      "POST /:id/slide/:step/note-image",
      "DELETE /:id/slide/:step/voice",
      "GET /animation/:animationId/audio",
      "PUT /animation/:animationId/part-audio/:partNumber",
      "POST /animation/:animationId/timings",
      "POST /animation/:animationId/transcribe",
      "GET /animation/:animationId/slides",
      "PATCH /animation/:animationId/slide/:step",
      "GET /:id/slides",
      "POST /animation/global-voice",
      "POST /:id/global-voice",
    ]);
  });

  test("registers /animation/global-voice before /:id/global-voice", () => {
    const paths = listedRoutes(learnRoutes);
    expect(paths.indexOf("POST /animation/global-voice")).toBeLessThan(
      paths.indexOf("POST /:id/global-voice")
    );
  });

  test("formatSeconds helper still renders mm:ss", () => {
    expect(formatSeconds(0)).toBe("0:00");
    expect(formatSeconds(65)).toBe("1:05");
  });
});
