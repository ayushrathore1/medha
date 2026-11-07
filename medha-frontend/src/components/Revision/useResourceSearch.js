import { useCallback, useEffect, useMemo, useState } from "react";
import { searchDatabase } from "../../api/api";
import { findTopicMatch } from "../../data/subjectCatalog";

export const TABS = [
  { id: "all", label: "All" },
  { id: "notes", label: "Notes" },
  { id: "youtube", label: "YouTube" },
  { id: "gfg", label: "GFG" },
];

function isAbortError(err) {
  return (
    err?.code === "ERR_CANCELED" ||
    err?.name === "CanceledError" ||
    err?.name === "AbortError" ||
    err?.message === "canceled"
  );
}

function asList(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Live library search.
 * Hook order is fixed: useState ×3 → useCallback → useEffect → useMemo ×2
 */
export function useResourceSearch(options = {}) {
  const query = options.query;
  const subject = options.subject;
  const semester = options.semester;
  const extraTitles = options.extraTitles;
  const debounceMs = options.debounceMs ?? 90;

  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(null);

  const trimmed = String(query ?? "").trim();
  const subjectKey = subject ? String(subject) : "all";
  const semesterKey = semester && String(semester) !== "all" ? String(semester) : "all";

  const load = useCallback(
    async (signal) => {
      if (!trimmed) {
        setPayload(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await searchDatabase(
          {
            q: trimmed,
            category: "all",
            subject: subjectKey,
            semester: semesterKey,
            limit: 24,
          },
          signal
        );
        if (!signal?.aborted) setPayload(data ?? null);
      } catch (err) {
        if (isAbortError(err)) return;
        if (!signal?.aborted) setPayload(null);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [trimmed, subjectKey, semesterKey]
  );

  useEffect(() => {
    const controller = new AbortController();
    const wait = Number.isFinite(debounceMs) ? Math.max(0, debounceMs) : 90;
    const handle = window.setTimeout(() => {
      load(controller.signal);
    }, wait);

    return () => {
      window.clearTimeout(handle);
      controller.abort();
    };
  }, [load, debounceMs]);

  const notes = asList(payload?.results?.notes);
  const youtube = asList(payload?.results?.youtube);
  const gfg = useMemo(() => asList(payload?.results?.gfg), [payload]);
  const match = useMemo(() => findTopicMatch(trimmed), [trimmed]);

  // Keep as a plain object (not useMemo) so hook count stays stable for HMR.
  const counts = {
    notes: notes.length,
    youtube: youtube.length,
    gfg: gfg.length,
    all: notes.length + youtube.length + gfg.length,
  };

  return {
    tab,
    setTab,
    loading,
    notes,
    youtube,
    gfg,
    counts,
    match,
    payload,
    extraTitles: asList(extraTitles),
  };
}
