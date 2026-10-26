import React from "react";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/flashcards", label: "Flashcards" },
  { path: "/quiz", label: "Quiz" },
  { path: "/chatbot", label: "Chatbot" },
  { path: "/feedback", label: "Feedback" },
];

const Sidebar = ({ open, onClose }) => (
  <aside
    className={`fixed z-50 top-0 left-0 h-full w-4/5 max-w-xs bg-[var(--bg-primary)]/96 backdrop-blur-2xl border-r border-[var(--border-default)] shadow-2xl py-9 px-5 transform transition-transform duration-300 ${
      open ? "translate-x-0" : "-translate-x-full"
    } md:hidden`}
  >
    <button
      onClick={onClose}
      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[var(--action-primary)]/10 transition"
    >
      <svg
        className="w-7 h-7 text-[var(--text-secondary)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <div className="flex flex-col gap-3 mt-8">
      {sidebarItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `block font-semibold px-5 py-3 text-base rounded-xl transition relative
            ${
              isActive
                ? "bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white shadow-lg scale-[1.03]"
                : "text-[var(--text-secondary)] hover:bg-[var(--action-primary)]/10 hover:text-[var(--text-primary)] hover:scale-[1.04]"
            }`
          }
          onClick={onClose}
        >
          {item.label}
          {/* Animated underline for active link */}
          <span
            className={`absolute left-5 right-5 bottom-2 h-1 rounded-xl bg-white/30 opacity-90 transition-all transform ${
              window.location.pathname === item.path
                ? "scale-x-100"
                : "scale-x-0"
            }`}
          />
        </NavLink>
      ))}
    </div>
  </aside>
);

export default Sidebar;
