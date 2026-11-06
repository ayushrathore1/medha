import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./LogoutConfirm.css";

export default function LogoutConfirm({ open, onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="logout-confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      onClick={onCancel}
    >
      <div className="logout-confirm-card" onClick={(e) => e.stopPropagation()}>
        <h2 id="logout-title">Log out of Medha?</h2>
        <p>You’ll need to sign in again to upload notes, open your profile, or manage your library.</p>
        <div className="logout-confirm-actions">
          <button type="button" onClick={onCancel} className="logout-confirm-cancel">
            Stay signed in
          </button>
          <button type="button" onClick={onConfirm} className="logout-confirm-ok">
            Log out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
