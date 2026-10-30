import { describe, expect, it } from "vitest";
import {
  buildResponsiveSrcSet,
  optimizeCloudinaryUrl,
  optimizeDeliveryUrl,
  optimizeImageKitUrl,
  getOptimizedThumbnailUrl,
  getOptimizedWallpaperUrl,
} from "./imageUtils";

describe("image delivery helpers", () => {
  const cloudinary = "https://res.cloudinary.com/demo/image/upload/v1/wallpapers/nature.png";
  const imagekit = "https://ik.imagekit.io/ayushrathore1/Medha/Dashboard_ss";

  it("adds auto format and quality to Cloudinary URLs", () => {
    expect(optimizeCloudinaryUrl(cloudinary)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:good/v1/wallpapers/nature.png"
    );
  });

  it("adds ImageKit width/quality transforms", () => {
    expect(optimizeImageKitUrl(imagekit, { width: 800 })).toBe(
      "https://ik.imagekit.io/ayushrathore1/Medha/Dashboard_ss?tr=w-800,q-75,f-auto"
    );
  });

  it("does not double-transform already optimized URLs", () => {
    const ready = optimizeCloudinaryUrl(cloudinary);
    expect(optimizeCloudinaryUrl(ready)).toBe(ready);
    const kit = optimizeImageKitUrl(imagekit, { width: 400 });
    expect(optimizeImageKitUrl(kit, { width: 800 })).toBe(kit);
  });

  it("builds a srcSet for CDN images and skips local files", () => {
    expect(buildResponsiveSrcSet(imagekit, [480, 960])).toBe(
      "https://ik.imagekit.io/ayushrathore1/Medha/Dashboard_ss?tr=w-480,q-75,f-auto 480w, https://ik.imagekit.io/ayushrathore1/Medha/Dashboard_ss?tr=w-960,q-75,f-auto 960w"
    );
    expect(buildResponsiveSrcSet("/assets/hero.webp")).toBeUndefined();
  });

  it("routes wallpaper and thumbnail helpers through the matching CDN", () => {
    expect(getOptimizedWallpaperUrl(cloudinary)).toContain("f_auto,q_auto:eco,w_1920");
    expect(getOptimizedThumbnailUrl(imagekit, 200)).toContain("w-200");
    expect(optimizeDeliveryUrl("/local.png")).toBe("/local.png");
  });
});
