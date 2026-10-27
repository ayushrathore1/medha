import { useCallback, useEffect, useMemo, useState } from "react";
import { searchDatabase } from "../../api/api";
import { findGfgArticles } from "../../data/gfgArticles";
import { SUBJECTS, findTopicMatch } from "../../data/subjectCatalog";

function catalogVideos(query, subjectName) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return [];
  const videos = [];
  SUBJECTS.filter((subject) => !subjectName || subject.name === subjectName).forEach((subject) => {
    subject.units.forEach((unit) => {
      const hit =
        unit.title.toLowerCase().includes(q) ||
        subject.name.toLowerCase().includes(q) ||
        unit.topics.some((topic) => topic.toLowerCase().includes(q) || q.includes(topic.toLowerCase().slice(0, 12)));
      if (!hit) return;
      (unit.videos || []).forEach((video) => {
        videos.push({
          id: video.videoId || video.title,
          title: video.title,
          channelTitle: video.channelTitle,
          thumbnailUrl: video.thumbnail,
          duration: video.duration,
          videoId: video.videoId,
          youtubeUrl: video.videoId ? `https://www.youtube.com/watch?v=${video.videoId}` : null,
        });
      });
    });
  });
  return videos.filter((item, index, arr) => arr.findIndex((x) => x.id === item.id) === index);
}

export const TABS = [
  { id: "all", label: "All" },
  { id: "notes", label: "Notes" },
  { id: "youtube", label: "YouTube" },
  { id: "gfg", label: "GFG" },
];

export function useResourceSearch({ query, subject, extraTitles = [] }) {
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(null);

  const trimmed = (query || "").trim();

  const load = useCallback(async () => {
    if (!trimmed) {
      setPayload(null);
      return;
    }
    setLoading(true);
    try {
      const data = await searchDatabase({
        q: trimmed,
        category: "all",
        subject: subject || "all",
        limit: 40,
      });
      setPayload(data);
    } catch {
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [trimmed, subject]);

  useEffect(() => {
    const handle = setTimeout(load, 120);
    return () => clearTimeout(handle);
  }, [load]);

  const notes = payload?.results?.notes || [];
  const youtube = useMemo(() => {
    const fromSearch = payload?.results?.youtube || [];
    const fromCatalog = catalogVideos(trimmed, subject);
    const merged = [...fromCatalog, ...fromSearch];
    return merged.filter((item, index, arr) => arr.findIndex((x) => (x.videoId || x.id) === (item.videoId || item.id)) === index);
  }, [payload, trimmed, subject]);
  const gfg = useMemo(
    () => findGfgArticles(trimmed, extraTitles),
    [trimmed, extraTitles]
  );
  const match = useMemo(() => findTopicMatch(trimmed), [trimmed]);

  const counts = {
    notes: notes.length,
    youtube: youtube.length,
    gfg: gfg.length,
    all: notes.length + youtube.length + gfg.length,
  };

  return { tab, setTab, loading, notes, youtube, gfg, counts, match, payload };
}
