import React from "react";
import { Link } from "react-router-dom";
import "./BrandMark.css";

export const MEDHA_HOME = "/";
export const MEDHA_SITE = "https://medharevision.shopcampuskart.in";
export const CAMPUSKART_URL = "https://www.shopcampuskart.in";
export const MEDHA_LOGO_SRC =
  "https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/6.svg?updatedAt=1767677218473";

/**
 * Dual brand lockup: Medha → app home, CampusKart → shopcampuskart.in.
 * Stacked wordmark (name + “By campuskart”) — avoids squashed side-by-side lockups.
 */
export default function BrandMark({
  variant = "wordmark",
  className = "",
  medhaTo = MEDHA_HOME,
  showRule = false,
}) {
  const rootClass = ["brand-mark", `brand-mark--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  if (variant === "logo") {
    return (
      <div className={rootClass} aria-label="Medha Revision by CampusKart">
        <Link to={medhaTo} className="brand-mark-medha" title="Medha Revision" aria-label="Medha Revision">
          <img src={MEDHA_LOGO_SRC} alt="Medha Revision" className="brand-mark-medha-img" />
        </Link>
        {showRule ? <span className="brand-mark-rule" aria-hidden="true" /> : null}
        <a
          href={CAMPUSKART_URL}
          className="brand-mark-ck"
          target="_blank"
          rel="noreferrer"
          title="CampusKart"
          aria-label="CampusKart"
        >
          <span className="brand-mark-campus">campus</span>
          <span className="brand-mark-kart">kart</span>
          <span className="brand-mark-dot" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <Link to={medhaTo} className={rootClass} aria-label="Medha Revision home">
      <span className="brand-mark-medha-text">Medha Revision</span>
      <span className="brand-mark-by">
        By{" "}
        <span
          className="brand-mark-ck"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(CAMPUSKART_URL, "_blank", "noreferrer");
          }}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              window.open(CAMPUSKART_URL, "_blank", "noreferrer");
            }
          }}
        >
          <span className="brand-mark-campus">campus</span>
          <span className="brand-mark-kart">kart</span>
          <span className="brand-mark-dot" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
