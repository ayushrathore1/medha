import api from "../../api/api";
import { resolveFileUrl } from "./revisionUtils";

/**
 * Fetch a note PDF for viewing/download.
 * Prefer same-origin blob via GET /notes/:id/file so viewers never hit
 * Cloudinary public CDN URLs that return 401 ACL.
 */
export async function requestNoteDownload(noteId, { attachment = false } = {}) {
  let meta = {};
  try {
    const res = await api.post(`/notes/${noteId}/download`, null, {
      params: attachment ? { attachment: 1 } : undefined,
    });
    meta = res.data || {};
  } catch {
    /* stream endpoint also awards; continue */
  }

  try {
    const fileRes = await api.get(`/notes/${noteId}/file`, {
      responseType: "blob",
      params: attachment ? { attachment: 1 } : undefined,
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
