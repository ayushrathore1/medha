import api from "../../api/api";
import { resolveFileUrl } from "./revisionUtils";

export async function requestNoteDownload(noteId) {
  const res = await api.post(`/notes/${noteId}/download`);
  return {
    ...res.data,
    fileUrl: resolveFileUrl(res.data?.fileUrl),
  };
}
