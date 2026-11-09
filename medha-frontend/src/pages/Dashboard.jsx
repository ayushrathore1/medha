import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileUp,
  Flame,
  Search,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import { AuthContext } from "../AuthContext";
import LandingNavbar from "../components/LandingNavbar";
import api from "../api/api";
import { getAuraTier } from "../utils/auraUtils";
import { formatDate, formatFileMeta } from "../components/Revision/revisionUtils";
import { useMergedSubjects } from "../hooks/useMergedSubjects";
import {
  getAcademicContext,
  getRecentSearches,
  getRecentSubjectSlugs,
  getSubjectBySlug,
  searchPath,
  semesterLabel,
} from "../data/subjectCatalog";
import { getContinueStudying, trackSearchOpened } from "../lib/studyActivity";
import { pingDailyActivity } from "../lib/dailyStreak";
import "../styles/LandingPage.css";
import "./DashboardHome.css";

const ACCENTS = ["#1BA34A", "#FF8A1A", "#2563EB", "#E30613", "#7C3AED", "#0D9488", "#F59E0B", "#DB2777"];

function firstName(user) {
  const name = String(user?.name || "").trim();
  if (!name) return "there";
  return name.split(/\s+/)[0];
}

function noteStatus(note) {
  if (note.verificationStatus === "rejected") return { label: "Needs fix", tone: "warn" };
  if (note.verificationStatus === "pending" || note.verificationStatus === "awaiting_team") {
    return { label: "In review", tone: "busy" };
  }
  if (!note.isPublic) return { label: "Private", tone: "quiet" };
  return { label: "Live", tone: "ok" };
}

function asText(value) {
  if (value == null || value === "") return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    return String(value.name || value.title || value.code || value.label || "").trim();
  }
  return "";
}

function subjectLabel(note) {
  return asText(note?.subject) || asText(note?.subjectTag) || null;
}

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [uploads, setUploads] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);

  const { subjects: catalogSubjects } = useMergedSubjects();
  const academic = useMemo(() => getAcademicContext(user), [user]);
  const [activityTick, setActivityTick] = useState(0);

  const recentSubjectSlugs = useMemo(
    () => getRecentSubjectSlugs(),
    [activityTick]
  );
  const recentSubjects = useMemo(
    () =>
      recentSubjectSlugs
        .map((slug) => catalogSubjects.find((s) => s.slug === slug) || getSubjectBySlug(slug))
        .filter(Boolean)
        .slice(0, 6),
    [catalogSubjects, recentSubjectSlugs]
  );
  const recentSearches = useMemo(() => getRecentSearches().slice(0, 8), [activityTick]);

  const mySubjects = useMemo(() => {
    const list = catalogSubjects.length ? catalogSubjects : [];
    if (academic.semester) {
      const filtered = list.filter((s) => Number(s.semester) === Number(academic.semester));
      if (filtered.length) return filtered.slice(0, 10);
    }
    if (recentSubjects.length) return recentSubjects;
    return list.slice(0, 8);
  }, [academic.semester, catalogSubjects, recentSubjects]);

  const pendingUploads = uploads.filter(
    (n) => n.verificationStatus === "pending" || n.verificationStatus === "awaiting_team"
  );
  const needsProfile = !(
    (asText(user?.university) || asText(academic.university)) &&
    (asText(user?.branch) || asText(academic.branch))
  );

  const activity = useMemo(
    () => getContinueStudying(10),
    [activityTick]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [notesRes, meRes] = await Promise.all([
          api.get("/notes", { params: { limit: 20 } }),
          api.get("/users/me"),
        ]);

        // Record today first, then read effective streak
        const pingRes = await pingDailyActivity();
        const activityRes = await api.get("/users/activity-history").catch(() => ({ data: {} }));

        if (cancelled) return;

        const notes = notesRes.data?.notes || [];
        setUploads(notes);

        const me = meRes.data?.user || meRes.data;
        if (me && typeof me === "object") {
          const name = String(me.name || "").trim();
          setUser?.((prev) => ({
            ...(prev || {}),
            ...me,
            // Keep session name if /users/me omits it
            name: name || prev?.name || "",
          }));
        }

        const nextStreak =
          (pingRes && !pingRes.skipped ? pingRes.streak : null) ??
          activityRes.data?.streak ??
          me?.streak ??
          0;
        setStreak(Number(nextStreak) || 0);
      } catch {
        if (!cancelled) setUploads([]);
      } finally {
        if (!cancelled) {
          setUploadsLoading(false);
          setProfileLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  useEffect(() => {
    const refresh = () => setActivityTick((n) => n + 1);
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) {
      navigate("/search");
      return;
    }
    trackSearchOpened(term);
    navigate(searchPath(term));
  };

  const contextBits = [
    asText(user?.university) || asText(academic.university) || null,
    asText(user?.branch) || asText(academic.branch) || null,
    academic.semester ? `Sem ${semesterLabel(academic.semester)}` : null,
  ].filter(Boolean);

  const aura = user?.auraPoints ?? 0;
  const auraTier = getAuraTier(aura);

  return (
    <div className="dash">
      <LandingNavbar />

      <main className="dash-main">
        <header className="dash-top">
          <div className="dash-top-copy">
            <p className="dash-eyebrow">Your study desk</p>
            <h1>Hey {firstName(user)}</h1>
            <p className="dash-sub">
              {contextBits.length
                ? contextBits.join(" · ")
                : "Add university & branch on your profile to personalise this desk."}
            </p>
          </div>
          <div className="dash-top-meta">
            <Link to="/profile" className="dash-aura" title="Aura from downloads of your notes">
              <Sparkles size={16} />
              <div>
                <strong>{profileLoading ? "…" : aura}</strong>
                <span>Aura · {auraTier.rank}</span>
              </div>
            </Link>
            {streak > 0 ? (
              <div className="dash-aura">
                <Flame size={16} />
                <div>
                  <strong>{streak}</strong>
                  <span>Streak</span>
                </div>
              </div>
            ) : null}
            <Link to="/profile" className="dash-ghost-btn">
              <UserRound size={16} />
              Profile
            </Link>
          </div>
        </header>

        <form className="dash-search" onSubmit={onSearch}>
          <div className="dash-search-inner">
            <Search size={18} aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a topic, unit, or subject…"
              aria-label="Search the library"
            />
            <button type="submit" className="dash-search-go">
              Search
            </button>
          </div>
        </form>

        {needsProfile ? (
          <Link to="/profile" className="dash-banner">
            <div>
              <strong>Finish your academic profile</strong>
              <span>University and branch unlock a tighter subject list for your semester.</span>
            </div>
            <ArrowRight size={18} />
          </Link>
        ) : null}

        <section className="dash-actions" aria-label="Quick actions">
          <Link to="/subjects" className="dash-action dash-action--green">
            <span className="dash-action-icon">
              <BookOpen size={20} />
            </span>
            <div>
              <strong>Open syllabus</strong>
              <span>All subjects mapped by unit</span>
            </div>
          </Link>
          <Link to="/search" className="dash-action dash-action--orange">
            <span className="dash-action-icon">
              <Search size={20} />
            </span>
            <div>
              <strong>Find notes & PYQs</strong>
              <span>Search across the library</span>
            </div>
          </Link>
          <Link to="/notes?panel=upload" className="dash-action dash-action--blue">
            <span className="dash-action-icon">
              <Upload size={20} />
            </span>
            <div>
              <strong>Upload notes</strong>
              <span>Share PDFs, earn aura</span>
            </div>
          </Link>
          <Link to="/notes?scope=mine" className="dash-action dash-action--violet">
            <span className="dash-action-icon">
              <FileUp size={20} />
            </span>
            <div>
              <strong>My notes</strong>
              <span>
                {uploadsLoading
                  ? "Loading…"
                  : pendingUploads.length
                    ? `${pendingUploads.length} in review`
                    : `${uploads.length} saved`}
              </span>
            </div>
          </Link>
        </section>

        <section className="dash-panel dash-subjects dash-subjects--hero">
          <div className="dash-panel-head">
            <h2>
              <BookOpen size={16} />
              {academic.semester
                ? `Semester ${semesterLabel(academic.semester)} subjects`
                : "Subjects for you"}
            </h2>
            <Link to="/subjects">See all</Link>
          </div>
          {mySubjects.length === 0 ? (
            <p className="dash-muted">Subjects will appear here once the curriculum loads.</p>
          ) : (
            <div className="dash-subject-grid">
              {mySubjects.map((subject, i) => (
                <Link
                  key={subject.slug || subject.id || subject.code}
                  to={`/subjects/${subject.slug}`}
                  className="dash-subject-card"
                  style={{ "--accent": ACCENTS[i % ACCENTS.length] }}
                >
                  <strong className="dash-subject-card-name">{subject.name}</strong>
                  <span className="dash-subject-card-meta">
                    {subject.unitCount || subject.units?.length || 0} units
                    {subject.topicCount ? ` · ${subject.topicCount} topics` : ""}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="dash-grid">
          <section className="dash-panel">
            <div className="dash-panel-head">
              <h2>
                <Clock3 size={16} /> Continue studying
              </h2>
              <Link to="/subjects">Subjects</Link>
            </div>

            {activity.length === 0 ? (
              <div className="dash-empty">
                <p>No study trail yet. Open a subject, unit, note, or past paper and it will show up here.</p>
                <div className="dash-empty-actions">
                  <Link to="/search" className="dash-solid-btn">
                    Search library
                  </Link>
                  <Link to="/subjects" className="dash-ghost-btn">
                    Browse subjects
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="dash-list">
                {activity.map((item) => (
                  <li key={item.id}>
                    <Link to={item.to} className="dash-list-row">
                      <span className={`dash-status dash-status--${item.tone}`}>{item.badge}</span>
                      <div className="dash-list-copy">
                        <strong>{item.title}</strong>
                        <span>
                          {item.meta}
                          {item.at ? ` · ${formatDate(item.at)}` : ""}
                        </span>
                      </div>
                      <ArrowRight size={16} className="dash-list-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {recentSearches.length > 0 ? (
              <div className="dash-chips-block">
                <p className="dash-chips-label">Recent searches</p>
                <div className="dash-chips">
                  {recentSearches.map((term) => (
                    <Link key={term} to={searchPath(term)} className="dash-chip">
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="dash-panel">
            <div className="dash-panel-head">
              <h2>
                <FileUp size={16} /> Your uploads
              </h2>
              <Link to="/notes?scope=mine">Manage</Link>
            </div>

            {uploadsLoading ? (
              <p className="dash-muted">Fetching notes from your account…</p>
            ) : uploads.length === 0 ? (
              <div className="dash-empty">
                <p>Nothing uploaded yet. Private notes stay in your library; public ones can earn aura.</p>
                <Link to="/notes?panel=upload" className="dash-solid-btn">
                  Upload a PDF
                </Link>
              </div>
            ) : (
              <ul className="dash-list">
                {uploads.slice(0, 6).map((note) => {
                  const status = noteStatus(note);
                  const subject = subjectLabel(note);
                  return (
                    <li key={note._id}>
                      <Link to={`/note/${note._id}`} className="dash-list-row">
                        <span className={`dash-status dash-status--${status.tone}`}>{status.label}</span>
                        <div className="dash-list-copy">
                          <strong>{note.title || "Untitled note"}</strong>
                          <span>
                            {[
                              subject,
                              note.isPublic ? "Public" : "Private",
                              formatFileMeta(note),
                              formatDate(note.updatedAt || note.createdAt),
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </div>
                        <ArrowRight size={16} className="dash-list-arrow" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {pendingUploads.length > 0 ? (
              <p className="dash-note">
                {pendingUploads.length} note{pendingUploads.length === 1 ? "" : "s"} still processing or waiting for team
                review.
              </p>
            ) : null}
          </section>
        </div>

      </main>
    </div>
  );
}
