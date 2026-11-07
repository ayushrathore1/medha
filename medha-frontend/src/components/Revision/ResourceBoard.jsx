import React from "react";
import { TABS, useResourceSearch } from "./useResourceSearch";
import NoteCard from "./NoteCard";
import VideoCard from "./VideoCard";
import GfgCard from "./GfgCard";
import "./ResourceBoard.css";

export default function ResourceBoard({
  query = "",
  subject,
  semester = "all",
  extraTitles = [],
  emptyLabel = "Try another topic, or open Subjects.",
}) {
  const search = useResourceSearch({ query, subject, semester, extraTitles });
  const tab = search.tab;
  const setTab = search.setTab;
  const loading = Boolean(search.loading);
  const notes = Array.isArray(search.notes) ? search.notes : [];
  const youtube = Array.isArray(search.youtube) ? search.youtube : [];
  const gfg = Array.isArray(search.gfg) ? search.gfg : [];
  const counts = search.counts || {};

  const showNotes = tab === "all" || tab === "notes";
  const showVideos = tab === "all" || tab === "youtube";
  const showGfg = tab === "all" || tab === "gfg";
  const visibleCount =
    (showNotes ? notes.length : 0) +
    (showVideos ? youtube.length : 0) +
    (showGfg ? gfg.length : 0);

  return (
    <div className="resource-board">
      <div className="resource-board-tabs" role="tablist" aria-label="Resource type">
        {TABS.map((item) => {
          const count = counts[item.id] || 0;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`resource-tab${active ? " is-on" : ""}`}
            >
              {item.label}
              {query ? <span className="resource-tab-count">{count}</span> : null}
            </button>
          );
        })}
      </div>

      <div className={`resource-board-panel${loading ? " is-loading" : ""}`}>
        {loading && visibleCount === 0 ? (
          <div className="resource-skeleton" aria-hidden>
            {[1, 2, 3].map((i) => (
              <div key={i} className="resource-skeleton-row" />
            ))}
          </div>
        ) : null}

        {!loading && query && visibleCount === 0 ? (
          <div className="resource-empty">
            <p className="resource-empty-title">Nothing for this topic yet.</p>
            <p className="resource-empty-sub">{emptyLabel}</p>
          </div>
        ) : null}

        {showNotes
          ? notes.map((note) => <NoteCard key={note.id || note._id} note={note} />)
          : null}
        {showVideos
          ? youtube.map((video) => <VideoCard key={video.id || video._id} video={video} />)
          : null}
        {showGfg
          ? gfg.map((article) => (
              <GfgCard key={article.id || article.title} article={article} />
            ))
          : null}
      </div>
    </div>
  );
}
