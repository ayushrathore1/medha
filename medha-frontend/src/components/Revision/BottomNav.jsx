import React, { useContext } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, BookOpen, Upload, UserRound } from "lucide-react";
import { AuthContext } from "../../AuthContext";

const TABS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search, match: (path) => path === "/search" },
  { to: "/subjects", label: "Subjects", icon: BookOpen, match: (path) => path.startsWith("/subjects") },
  { to: "/upload", label: "Upload", icon: Upload, match: (path) => path === "/upload" || path === "/uploads" },
  { to: "/profile", label: "You", icon: UserRound, authTo: "/login", match: (path) => path.startsWith("/profile") },
];

export default function BottomNav() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const nav = (
    <nav className="revision-bottom-nav">
      <div className="mx-auto flex h-14 max-w-[640px] items-center justify-around px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const href = tab.authTo && !user ? `${tab.authTo}?next=${encodeURIComponent(tab.to)}` : tab.to;
          const active = tab.match
            ? tab.match(location.pathname)
            : location.pathname === tab.to || location.pathname.startsWith(`${tab.to}/`);
          return (
            <NavLink
              key={tab.to}
              to={href}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-inherit no-underline"
            >
              <Icon size={18} strokeWidth={1.75} color={active ? "#1F1F1F" : "#8A8A8A"} />
              <span className={`max-w-full truncate text-[10px] leading-none ${active ? "font-medium text-[#1F1F1F]" : "text-[#8A8A8A]"}`}>
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );

  if (typeof document === "undefined") return nav;
  return createPortal(nav, document.body);
}
