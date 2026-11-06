import { useCallback, useEffect, useMemo, useState } from "react";
import { searchDatabase } from "../../api/api";
import { findTopicMatch } from "../../data/subjectCatalog";

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
  const youtube = payload?.results?.youtube || [];
  const gfg = useMemo(() => {
    const fromApi = payload?.results?.gfg || [];
    if (fromApi.length) return fromApi;
    // Fallback labels only — open still requires a curated id from API
    return (extraTitles || []).slice(0, 0);
  }, [payload, extraTitles]);
  const match = useMemo(() => findTopicMatch(trimmed), [trimmed]);

  const counts = {
    notes: notes.length,
    youtube: youtube.length,
    gfg: gfg.length,
    all: notes.length + youtube.length + gfg.length,
  };

  return { tab, setTab, loading, notes, youtube, gfg, counts, match, payload };
}
