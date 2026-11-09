import api from "../api/api";
import { apiUrl } from "../config/api";

/**
 * Shared PDF open helpers — always prefer authenticated same-origin streams
 * (or blob URLs) over raw Cloudinary res.cloudinary.com links (401 ACL).
 */

export async function openNotePdfBlob(noteId, { attachment = false } = {}) {
  const { requestNoteDownload } = await import("../components/Revision/noteDownload");
  return requestNoteDownload(noteId, { attachment });
}

/**
 * Past papers: GET /api/past-papers/:id/file as blob (auth optional / public).
 */
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

/** Absolute stream URL (for download links that can send cookies/token separately). */
export function pastPaperFilePath(paperId, { attachment = false } = {}) {
  const q = attachment ? "?attachment=1" : "";
  return apiUrl(`/api/past-papers/${paperId}/file${q}`);
}

export function noteFilePath(noteId, { attachment = false } = {}) {
  const q = attachment ? "?attachment=1" : "";
  return apiUrl(`/api/notes/${noteId}/file${q}`);
}
