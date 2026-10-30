/**
 * Image delivery helpers for Cloudinary, ImageKit, and local URLs.
 */

const DEFAULT_WIDTHS = [480, 768, 1200];

const hasQuery = (url) => url.includes("?");

const withQuery = (url, key, value) => {
  const joiner = hasQuery(url) ? "&" : "?";
  return `${url}${joiner}${key}=${value}`;
};

/**
 * Optimize a Cloudinary URL with automatic format and quality.
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes("cloudinary.com") || url.includes("/upload/f_")) {
    return url;
  }

  const {
    width = null,
    quality = "auto:good",
    format = "auto",
  } = options;

  let transforms = `f_${format},q_${quality}`;
  if (width) {
    transforms += `,w_${width}`;
  }

  return url.replace("/upload/", `/upload/${transforms}/`);
};

/**
 * Optimize an ImageKit URL with format/quality/width transforms.
 */
export const optimizeImageKitUrl = (url, options = {}) => {
  if (!url || !url.includes("imagekit.io") || /[?&]tr=/.test(url)) {
    return url;
  }

  const { width = null, format = "auto" } = options;
  const quality = typeof options.quality === "number" ? options.quality : 75;
  const parts = [`q-${quality}`, `f-${format}`];
  if (width) {
    parts.unshift(`w-${width}`);
  }
  return withQuery(url, "tr", parts.join(","));
};

/**
 * Route a remote URL through the matching CDN optimizer.
 */
export const optimizeDeliveryUrl = (url, options = {}) => {
  if (!url) return url;
  if (url.includes("cloudinary.com")) return optimizeCloudinaryUrl(url, options);
  if (url.includes("imagekit.io")) return optimizeImageKitUrl(url, options);
  return url;
};

export const getOptimizedWallpaperUrl = (url) =>
  optimizeDeliveryUrl(url, {
    width: 1920,
    quality: "auto:eco",
    format: "auto",
  });

export const getOptimizedThumbnailUrl = (url, size = 200) =>
  optimizeDeliveryUrl(url, {
    width: size,
    quality: "auto:good",
    format: "auto",
  });

/**
 * Build a srcSet for CDN-hosted images. Local Vite imports should pass
 * pre-generated width variants instead.
 */
export const buildResponsiveSrcSet = (url, widths = DEFAULT_WIDTHS) => {
  if (!url || (!url.includes("cloudinary.com") && !url.includes("imagekit.io"))) {
    return undefined;
  }
  return widths
    .map((width) => `${optimizeDeliveryUrl(url, { width })} ${width}w`)
    .join(", ");
};

export default {
  optimizeCloudinaryUrl,
  optimizeImageKitUrl,
  optimizeDeliveryUrl,
  getOptimizedWallpaperUrl,
  getOptimizedThumbnailUrl,
  buildResponsiveSrcSet,
};
