const API = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function apiGet(path: string) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  const result = await res.json();
  return result.data ?? result;
}