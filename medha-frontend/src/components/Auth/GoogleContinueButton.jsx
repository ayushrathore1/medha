import React from "react";
import { apiUrl } from "../../config/api";

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.1 4 9.2 8.5 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.1 39.5 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 36.3 44 31 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}

/**
 * Starts the backend OAuth redirect (GET /api/auth/google).
 */
export default function GoogleContinueButton({ label = "Continue with Google" }) {
  const href = apiUrl("/api/auth/google");

  return (
    <a
      href={href}
      className="btn-shine"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        width: "100%",
        padding: 14,
        background: "#FFFFFF",
        color: "#111111",
        borderRadius: 999,
        border: "1.5px solid #E5E5E5",
        fontSize: 15,
        fontWeight: 700,
        textDecoration: "none",
        boxSizing: "border-box",
      }}
    >
      <GoogleGlyph />
      {label}
    </a>
  );
}

export function AuthDivider({ text = "or" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "20px 0",
        color: "#9A9A9A",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ flex: 1, height: 1, background: "#E8E8E8" }} />
      {text}
      <span style={{ flex: 1, height: 1, background: "#E8E8E8" }} />
    </div>
  );
}
