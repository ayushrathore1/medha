import React from "react";
import { Link } from "react-router-dom";

export default function BrandMark({ to = "/dashboard", compact = false }) {
  return (
    <Link to={to} className={`revision-wordmark shrink-0 ${compact ? "" : ""}`} aria-label="Medha Revision home">
      <span className="revision-wordmark-name" style={compact ? { fontSize: 16 } : undefined}>
        Medha Revision
      </span>
      <span className="revision-wordmark-by">
        By{" "}
        <span className="revision-wordmark-ck">
          <span className="revision-wordmark-campus">campus</span>
          <span className="revision-wordmark-kart">kart</span>
          <span className="revision-wordmark-dot" aria-hidden />
        </span>
      </span>
    </Link>
  );
}
