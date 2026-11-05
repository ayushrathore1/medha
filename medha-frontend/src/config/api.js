/**
 * Canonical API origin for production + local.
 * Always strip a trailing slash so `${API_BASE}/api/...` never becomes `//api`.
 */
export const API_BASE = String(
  import.meta.env.VITE_BACKEND_URL || "https://medharevisionapi.shopcampuskart.in"
).replace(/\/$/, "");

export function apiUrl(path = "") {
  const normalized = String(path || "");
  if (!normalized) return API_BASE;
  return `${API_BASE}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}
