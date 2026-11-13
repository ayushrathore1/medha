import api from "../../api/api";
import { resolveFileUrl } from "./revisionUtils";
import { noteFileStreamUrl } from "../../lib/pdfDelivery";

/**
 * Open a note for viewing — prefer stream URL (near-instant) over full blob.
 * Aura / download counts stay on explicit download (attachment) or POST /download.
 */
export async function requestNoteDownload(noteId, { attachment = false } = {}) {
  if (!attachment) {
    return {
      fileUrl: noteFileStreamUrl(noteId),
      blobUrl: null,
      revoke: () => {},
    };
  }

  let meta = {};
  try {
    const res = await api.post(`/notes/${noteId}/download`, null, {
      params: { attachment: 1 },
    });
    meta = res.data || {};
  } catch {
    /* stream endpoint may still work */
  }

  try {
    const fileRes = await api.get(`/notes/${noteId}/file`, {
      responseType: "blob",
      params: { attachment: 1 },
    });
    const blob = fileRes.data;
    const type = blob?.type && blob.type !== "application/json" ? blob.type : "application/pdf";
    const objectUrl = URL.createObjectURL(
      blob instanceof Blob ? blob : new Blob([blob], { type })
    );
    return {
      ...meta,
      fileUrl: objectUrl,
      blobUrl: objectUrl,
      revoke: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (err) {
    const fallback = resolveFileUrl(meta.fileUrl);
    if (fallback) {
      return { ...meta, fileUrl: fallback, blobUrl: null, revoke: () => {} };
    }
    throw err;
  }
}
