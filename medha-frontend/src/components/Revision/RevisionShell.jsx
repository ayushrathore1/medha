import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
// Aura is shown on Home + Profile only — do not mount AuraBadge in this shell.
import { REVISION_TABS, isRevisionTabActive, revisionTabHref } from "./BottomNav";
import BrandMark from "./BrandMark";
import LogoutConfirm from "./LogoutConfirm";
import { loginPath } from "./revisionUtils";
import "../../styles/DeskTheme.css";
import "../../pages/DashboardHome.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function RevisionShell({
  children,
  title,
  showBack = false,
  wide = false,
  actions = null,
  desk = true,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isStaff, setIsStaff] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setIsStaff(false);
      return undefined;
    }
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/messages/check-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setIsStaff(Boolean(res.data?.isAdmin));
      } catch {
        if (!cancelled) setIsStaff(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className={`revision-app min-h-screen text-[#111] ${desk ? "desk-shell" : "bg-white"}`}>
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
          {!actions ? (
            <div className="flex items-center gap-2">
              {isStaff ? (
                <Link
                  to="/admin"
                  className="inline-flex rounded-full bg-[#111] px-3 py-1.5 text-[12px] font-semibold text-white no-underline hover:opacity-90"
                  title="Ops desk — curriculum, notes review, team"
                >
                  Ops
                </Link>
              ) : null}
              {user ? (
                <button
                  type="button"
                  onClick={() => setLogoutOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#111] hover:bg-[var(--ice)]"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              ) : (
                <Link
                  to={loginPath(location.pathname)}
                  className="rounded-full bg-[#111] px-3 py-1.5 text-[12px] font-semibold text-white no-underline"
                >
                  Login
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1240px] px-5 pb-[calc(84px+env(safe-area-inset-bottom))] pt-5 md:px-6 lg:pb-12 md:pt-8">
        <main className="min-w-0">{children}</main>
      </div>

      <LogoutConfirm
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          logout?.();
          navigate("/", { replace: true });
        }}
      />
    </div>
  );
}
