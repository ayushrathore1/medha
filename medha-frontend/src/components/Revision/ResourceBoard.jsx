import React from "react";
import { TABS, useResourceSearch } from "./useResourceSearch";
import NoteCard from "./NoteCard";
import VideoCard from "./VideoCard";
import GfgCard from "./GfgCard";

export default function ResourceBoard({ query, subject, extraTitles = [], emptyLabel = "Try another topic, or open Subjects." }) {
  const { tab, setTab, loading, notes, youtube, gfg, counts } = useResourceSearch({ query, subject, extraTitles });

  const showNotes = tab === "all" || tab === "notes";
  const showVideos = tab === "all" || tab === "youtube";
  const showGfg = tab === "all" || tab === "gfg";
  const visibleCount =
    (showNotes ? notes.length : 0) + (showVideos ? youtube.length : 0) + (showGfg ? gfg.length : 0);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => {
          const count = counts[item.id] || 0;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] ${
                active ? "bg-[#111] font-semibold text-white" : "border border-[#E8E8E8] text-[#5A5A5A]"
              }`}
            >
              {item.label}
              {query ? ` ${count}` : ""}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse bg-[#F4F4F4]" />
            ))}
          </div>
        )}

        {!loading && query && visibleCount === 0 && (
          <div className="py-10">
            <p className="text-[15px] font-medium">Nothing for this topic yet.</p>
            <p className="mt-1 text-[14px] text-[#5C5C5C]">{emptyLabel}</p>
          </div>
        )}

        {!loading && showNotes && notes.map((note) => <NoteCard key={note.id} note={note} />)}
        {!loading && showVideos && youtube.map((video) => <VideoCard key={video.id} video={video} />)}
        {!loading && showGfg && gfg.map((article) => <GfgCard key={article.url} article={article} />)}
      </div>
    </div>
  );
}
