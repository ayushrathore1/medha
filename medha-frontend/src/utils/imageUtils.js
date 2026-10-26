/**
 * Image Optimization Utilities
 * Optimizes Cloudinary URLs for better performance
 */

/**
 * Optimize a Cloudinary URL with automatic format and quality
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Optimization options
 * @returns {string} Optimized URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width = null,
    quality = 'auto:good',
    format = 'auto',
  } = options;

  // Build transformation string
  let transforms = `f_${format},q_${quality}`;
  
  if (width) {
    transforms += `,w_${width}`;
  }

  // Insert transformations after /upload/
  return url.replace('/upload/', `/upload/${transforms}/`);
};

/**
 * Get optimized wallpaper URL
 * @param {string} url - Original wallpaper URL
 * @returns {string} Optimized URL for wallpaper display
 */
export const getOptimizedWallpaperUrl = (url) => {
  return optimizeCloudinaryUrl(url, {
    width: 1920,
    quality: 'auto:eco', // Lower quality for background images
    format: 'auto', // WebP/AVIF where supported
  });
};

/**
 * Get optimized thumbnail URL
 * @param {string} url - Original image URL
 * @param {number} size - Thumbnail size
 * @returns {string} Optimized thumbnail URL
 */
export const getOptimizedThumbnailUrl = (url, size = 200) => {
  return optimizeCloudinaryUrl(url, {
    width: size,
    quality: 'auto:good',
    format: 'auto',
  });
};

export default {
  optimizeCloudinaryUrl,
  getOptimizedWallpaperUrl,
  getOptimizedThumbnailUrl,
};
