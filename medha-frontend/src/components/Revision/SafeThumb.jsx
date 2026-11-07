import React, { useState } from "react";

/**
 * Image that swaps to a quiet placeholder on error — avoids broken-image icons.
 * (ytimg 404 console noise is prevented by the backend thumb proxy.)
 */
export default function SafeThumb({
  src,
  alt = "",
  className = "",
  width,
  height,
  placeholderClassName = "flex h-full w-full items-center justify-center bg-[#111827] text-[11px] font-semibold text-white/70",
  placeholderLabel = "Play",
}) {
  const [failed, setFailed] = useState(false);
  const [current, setCurrent] = useState(src || "");

  if (!current || failed) {
    return (
      <div className={placeholderClassName} aria-hidden>
        {placeholderLabel}
      </div>
    );
  }

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => {
        // One failure → placeholder. Do not cascade alternate ytimg URLs
        // (that would multiply 404 console noise).
        setFailed(true);
        setCurrent("");
      }}
    />
  );
}
