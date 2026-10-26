const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Typed API client for calling Next.js API routes from client components.
 * Automatically includes auth token and handles JSON serialization.
 */
export async function api<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("medha_token")
      : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${endpoint}`;

  const res = await fetch(url, config);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

/** Shorthand GET */
export const apiGet = <T = unknown>(url: string) => api<T>(url);

/** Shorthand POST */
export const apiPost = <T = unknown>(url: string, body: unknown) =>
  api<T>(url, { method: "POST", body });

/** Shorthand PUT */
export const apiPut = <T = unknown>(url: string, body: unknown) =>
  api<T>(url, { method: "PUT", body });

/** Shorthand DELETE */
export const apiDelete = <T = unknown>(url: string) =>
  api<T>(url, { method: "DELETE" });

/** Shorthand PATCH */
export const apiPatch = <T = unknown>(url: string, body: unknown) =>
  api<T>(url, { method: "PATCH", body });

export default api;
