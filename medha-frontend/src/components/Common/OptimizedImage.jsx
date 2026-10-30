import React from "react";
import { buildResponsiveSrcSet, optimizeDeliveryUrl } from "../../utils/imageUtils";

/**
 * Content image with CDN srcSet, explicit sizing, and opt-in lazy loading.
 * Pass lazy={false} for the primary LCP/hero image.
 */
const OptimizedImage = ({
  src,
  alt,
  lazy = true,
  widths,
  sizes = "100vw",
  className,
  width,
  height,
  decoding = "async",
  ...rest
}) => {
  const srcSet = buildResponsiveSrcSet(src, widths);
  const optimizedSrc = optimizeDeliveryUrl(
    src,
    widths?.length ? { width: widths[widths.length - 1] } : {}
  );

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={lazy ? "lazy" : "eager"}
      fetchPriority={lazy ? "auto" : "high"}
      decoding={decoding}
      className={className}
      width={width}
      height={height}
      {...rest}
    />
  );
};

export default OptimizedImage;
