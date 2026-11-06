import api from "../../api/api";
import { API_BASE, loginPath, resolveFileUrl } from "./revisionUtils";

export async function openCuratedResource(resourceId, { navigate } = {}) {
  if (!resourceId) throw new Error("Missing resource");
  try {
    const res = await api.post(`/resources/${resourceId}/open`);
    const url = resolveFileUrl(res.data?.url);
    if (!url) throw new Error("No url");
    window.open(url, "_blank", "noopener,noreferrer");
    return url;
  } catch (err) {
    if (err?.response?.status === 401 && navigate) {
      navigate(loginPath());
      return null;
    }
    throw err;
  }
}

export function resourceThumbUrl(resource) {
  if (!resource?.id) return null;
  if (resource.thumbnailUrl?.startsWith("http")) return resource.thumbnailUrl;
  if (resource.thumbnailUrl?.startsWith("/")) {
    return `${API_BASE}${resource.thumbnailUrl}`;
  }
  return `${API_BASE}/api/resources/${resource.id}/thumb`;
}
