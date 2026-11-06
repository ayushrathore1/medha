import React from "react";
import { Link } from "react-router-dom";

export default function AuraBadge({ points = 0 }) {
  return (
    <Link
      to="/profile"
      className="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold no-underline"
      style={{ background: "var(--aura-bg)", color: "var(--aura-fg)" }}
      title="Aura from downloads of your notes"
    >
      Aura {points}
    </Link>
  );
}
