import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, BookOpen, Upload, UserRound } from "lucide-react";
import { AuthContext } from "../../AuthContext";

export const REVISION_TABS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search, match: (path) => path === "/search" },
  { to: "/subjects", label: "Subjects", icon: BookOpen, match: (path) => path.startsWith("/subjects") },
  { to: "/upload", label: "Upload", icon: Upload, match: (path) => path === "/upload" || path === "/uploads" },
  { to: "/profile", label: "You", icon: UserRound, authTo: "/login", match: (path) => path.startsWith("/profile") },
];

export function isRevisionTabActive(tab, pathname) {
  return tab.match
    ? tab.match(pathname)
    : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
}

export function revisionTabHref(tab, user) {
  return tab.authTo && !user ? `${tab.authTo}?next=${encodeURIComponent(tab.to)}` : tab.to;
}

export default function BottomNav() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white pb-[max(22px,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto flex h-[62px] max-w-[1240px] items-center justify-around px-2">
        {REVISION_TABS.map((tab) => {
          const Icon = tab.icon;
          const href = revisionTabHref(tab, user);
          const active = isRevisionTabActive(tab, location.pathname);
          return (
            <NavLink
              key={tab.to}
              to={href}
              className="flex h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-inherit no-underline"
            >
              <span className={`grid h-[30px] w-[52px] place-items-center rounded-full ${active ? "bg-[#111]" : ""}`}>
                <Icon size={22} strokeWidth={active ? 2.2 : 1.75} color={active ? "#fff" : "#5A5A5A"} />
              </span>
              <span className={`text-[12px] ${active ? "font-bold text-[#111]" : "font-medium text-[#5A5A5A]"}`}>
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
