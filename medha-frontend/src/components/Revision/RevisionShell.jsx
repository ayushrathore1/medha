import React, { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AuthContext } from "../../AuthContext";
import AuraBadge from "./AuraBadge";
import BottomNav, { REVISION_TABS, isRevisionTabActive, revisionTabHref } from "./BottomNav";
import BrandMark from "./BrandMark";

export default function RevisionShell({ children, title, showBack = false, wide = false, actions = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <div className="revision-app min-h-screen bg-white text-[#111]">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/92 backdrop-blur-xl">
        <div className={`mx-auto flex min-h-16 items-center gap-4 px-5 md:min-h-[76px] md:px-6 ${wide ? "max-w-[1240px]" : "max-w-[1240px]"}`}>
          {showBack ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--ice)] text-[#111]"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <BrandMark compact />
          )}

          <nav className="hidden min-w-0 flex-1 flex-wrap items-center gap-1 md:flex" aria-label="Primary">
            {REVISION_TABS.map((tab) => {
              const href = revisionTabHref(tab, user);
              const active = isRevisionTabActive(tab, location.pathname);
              return (
                <NavLink
                  key={tab.to}
                  to={href}
                  className={`rounded-full px-4 py-[9px] text-[14px] no-underline transition-colors ${
                    active
                      ? "bg-[#111] font-semibold text-white"
                      : "font-medium text-[#5A5A5A] hover:text-[#111]"
                  }`}
                >
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>

          {title ? (
            <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-display)] text-[14px] font-semibold text-[#111] md:hidden">
              {title}
            </p>
          ) : (
            <div className="flex-1 md:hidden" />
          )}

          {actions}
          {!actions ? <AuraBadge points={user?.auraPoints ?? 0} /> : null}
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1240px] px-5 pb-[calc(84px+env(safe-area-inset-bottom))] pt-5 md:px-6 md:pb-12 md:pt-8">
        <BottomNav />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
