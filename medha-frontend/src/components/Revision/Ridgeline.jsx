import React from "react";

export default function Ridgeline({ height = 190, className = "" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 460 200"
      preserveAspectRatio="none"
      height={height}
      className={`pointer-events-none absolute inset-x-0 bottom-0 w-full ${className}`}
    >
      <polygon fill="#1A1A1A" points="0,120 70,70 120,100 190,40 260,95 330,60 400,100 460,70 460,200 0,200" />
      <polygon fill="#2A2A2A" points="0,150 60,110 130,140 200,90 270,135 350,105 460,145 460,200 0,200" />
      <polyline
        fill="none"
        stroke="#C6D93B"
        strokeWidth="1.6"
        points="0,150 60,110 130,140 200,90 270,135 350,105 460,145"
      />
      <polygon fill="#111111" points="0,175 90,150 170,172 260,140 350,168 460,150 460,200 0,200" />
    </svg>
  );
}
