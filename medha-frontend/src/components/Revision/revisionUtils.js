export const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export function resolveFileUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatFileMeta(note) {
  const type = (note?.fileType || note?.noteType || "PDF").toString();
  if (/pdf/i.test(type) || note?.fileUrl?.endsWith(".pdf")) return "PDF";
  if (/image|png|jpg|jpeg/i.test(type)) return "Image";
  return "File";
}

export function loginPath(next) {
  const target = next || `${window.location.pathname}${window.location.search}`;
  return `/login?next=${encodeURIComponent(target)}`;
}
