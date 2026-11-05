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
 * Use on every public shell so both logos stay linked.
 */
export default function BrandMark({
  variant = "wordmark",
  className = "",
  medhaTo = MEDHA_HOME,
  showRule = true,
}) {
  const rootClass = ["brand-mark", `brand-mark--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  const medhaInner =
    variant === "logo" ? (
      <img src={MEDHA_LOGO_SRC} alt="Medha Revision" className="brand-mark-medha-img" />
    ) : (
      <span className="brand-mark-medha-text">Medha Revision</span>
    );

  const campuskartInner = (
    <>
      <span className="brand-mark-campus">campus</span>
      <span className="brand-mark-kart">kart</span>
      <span className="brand-mark-dot" aria-hidden="true" />
    </>
  );

  return (
    <div className={rootClass} aria-label="Medha Revision by CampusKart">
      <Link
        to={medhaTo}
        className="brand-mark-medha"
        title="Medha Revision"
        aria-label="Medha Revision"
      >
        {medhaInner}
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
        {campuskartInner}
      </a>
    </div>
  );
}
