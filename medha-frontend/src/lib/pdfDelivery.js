import api from "../api/api";
import { apiUrl } from "../config/api";

/**
 * Shared PDF open helpers — prefer stream URLs so EmbedPDF can start rendering
 * without waiting for a full blob download. Fall back to authenticated blobs
 * only when a stream URL cannot be used.
 */

function withAuthToken(url) {
  const token = localStorage.getItem("token");
  if (!token) return url;
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}token=${encodeURIComponent(token)}`;
}

/** Absolute stream URL for notes (supports guest view of approved public notes). */
export function noteFilePath(noteId, { attachment = false } = {}) {
  const q = attachment ? "?attachment=1" : "";
  return apiUrl(`/api/notes/${noteId}/file${q}`);
}

/** Stream URL EmbedPDF can open directly (adds token when present). */
export function noteFileStreamUrl(noteId, { attachment = false } = {}) {
  return withAuthToken(noteFilePath(noteId, { attachment }));
}

export async function openNotePdfBlob(noteId, { attachment = false } = {}) {
  const { requestNoteDownload } = await import("../components/Revision/noteDownload");
  return requestNoteDownload(noteId, { attachment });
}

/**
 * Past papers: prefer stream URL for near-instant viewer open.
 * Blob helper kept for download / fallback.
 */
export function pastPaperFilePath(paperId, { attachment = false } = {}) {
  const q = attachment ? "?attachment=1" : "";
  return apiUrl(`/api/past-papers/${paperId}/file${q}`);
}

export function pastPaperFileStreamUrl(paperId, { attachment = false } = {}) {
  return withAuthToken(pastPaperFilePath(paperId, { attachment }));
}

export async function openPastPaperPdfBlob(paperId, { attachment = false } = {}) {
  const fileRes = await api.get(`/past-papers/${paperId}/file`, {
    responseType: "blob",
    params: attachment ? { attachment: 1 } : undefined,
  });
  const blob = fileRes.data;
  const type = blob?.type && blob.type !== "application/json" ? blob.type : "application/pdf";
  const objectUrl = URL.createObjectURL(
    blob instanceof Blob ? blob : new Blob([blob], { type })
  );
  return {
    fileUrl: objectUrl,
    blobUrl: objectUrl,
    revoke: () => URL.revokeObjectURL(objectUrl),
  };
}
