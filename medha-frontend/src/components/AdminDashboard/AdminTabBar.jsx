import React from "react";
import {
  FaBookOpen,
  FaFileLines,
  FaClock,
  FaUsers,
  FaMicrophone,
  FaEnvelopeOpenText,
} from "react-icons/fa6";

const TABS = [
  { id: "curriculum", label: "Curriculum", icon: FaBookOpen },
  { id: "notes-review", label: "Notes", icon: FaFileLines },
  { id: "email", label: "Email", icon: FaEnvelopeOpenText },
  { id: "history", label: "History", icon: FaClock },
  { id: "team", label: "Team", icon: FaUsers },
  { id: "transcribe", label: "Transcribe", icon: FaMicrophone },
];

export default function AdminTabBar({ admin }) {
  const { activeTab, setActiveTab, isFullAdmin, teamMembers = [], users = [] } = admin;

  return (
    <div className="admin-dash-shell desk-page">
      <header className="admin-dash-hero">
        <p className="desk-eyebrow">Internal</p>
        <h1 className="desk-title">Ops desk</h1>
        <p className="desk-sub">
          {isFullAdmin
            ? "Curriculum, notes review, team roles, and day-to-day ops."
            : "Edit curriculum and help with content."}
        </p>
      </header>

      <div className="admin-dash-stats" aria-label="Quick stats">
        <div className="admin-stat-card admin-stat-card--green">
          <span>Workspace</span>
          <strong>Ops</strong>
        </div>
        <div className="admin-stat-card admin-stat-card--violet">
          <span>Team</span>
          <strong>{teamMembers.length || "—"}</strong>
        </div>
        <div className="admin-stat-card admin-stat-card--amber">
          <span>Users</span>
          <strong>{users.length || "—"}</strong>
        </div>
        <div className="admin-stat-card admin-stat-card--blue">
          <span>Your role</span>
          <strong className="admin-stat-role">{isFullAdmin ? "Admin" : "Team"}</strong>
        </div>
      </div>

      <nav className="desk-tabs admin-dash-tabs" aria-label="Ops sections">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`desk-tab admin-dash-tab${active ? " is-on" : ""}`}
            >
              <Icon size={13} aria-hidden />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
