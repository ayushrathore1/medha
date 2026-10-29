import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AuthContext } from "../../AuthContext";
import BottomNav from "./BottomNav";

export default function RevisionShell({ children, title, showBack = false, actions = null }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="revision-app min-h-dvh bg-white text-[#1F1F1F]">
      <header className="revision-header sticky top-0 z-30 border-b border-[#E5E5E5] bg-white/95 backdrop-blur">
        <div className="revision-header-inner mx-auto flex h-12 max-w-[640px] items-center gap-3">
          {showBack ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 shrink-0 items-center justify-center text-[#1F1F1F]"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <Link to="/dashboard" className="shrink-0 text-[15px] font-semibold tracking-tight text-[#1F1F1F] no-underline">
              Medha
            </Link>
          )}
          <div className="min-w-0 flex-1">
            {title ? (
              <p className="truncate text-[14px] font-medium text-[#1F1F1F]">{title}</p>
            ) : null}
          </div>
          {actions}
          {!actions && user ? (
            <Link
              to="/uploads"
              className="shrink-0 whitespace-nowrap text-[12px] tabular-nums text-[#5C5C5C] no-underline"
              title="Aura from downloads of your notes"
            >
              Aura {user.auraPoints ?? 0}
            </Link>
          ) : null}
        </div>
      </header>

      <div className="revision-body mx-auto w-full max-w-[640px]">
        <BottomNav />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
