const configuredBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:5000";
const trimmedBaseUrl = configuredBaseUrl.replace(/\/+$/, "");
const API = trimmedBaseUrl.endsWith("/api")
  ? trimmedBaseUrl
  : `${trimmedBaseUrl}/api`;

export async function apiRequest(
  path: string,
  options: RequestInit = {},
  token?: string,
) {
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API}${path.startsWith("/") ? path : `/${path}`}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    const message = body?.error?.message ?? `Server returned ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) return null;
  const result = await res.json();
  return result.data ?? result;
}

export function apiGet(path: string) {
  return apiRequest(path);
}