import React, { useContext } from "react";
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

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E5E5] bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-14 max-w-[640px] items-center justify-around px-2">
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
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 text-inherit no-underline"
            >
              <Icon size={18} strokeWidth={1.75} color={active ? "#1F1F1F" : "#8A8A8A"} />
              <span className={`text-[11px] ${active ? "font-medium text-[#1F1F1F]" : "text-[#8A8A8A]"}`}>
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
