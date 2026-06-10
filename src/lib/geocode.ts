// Lightweight client-side geocoder using OpenStreetMap Nominatim.
// No API key required. Cached in sessionStorage to avoid re-querying.

export type LatLng = { lat: number; lng: number };

export async function geocodeAddress(query: string): Promise<LatLng | null> {
  const q = query.trim();
  if (!q) return null;
  const key = `geocode:${q.toLowerCase()}`;
  try {
    const cached = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(key) : null;
    if (cached) return JSON.parse(cached) as LatLng;
  } catch {}
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const arr = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!arr.length) return null;
    const out: LatLng = { lat: Number(arr[0].lat), lng: Number(arr[0].lon) };
    try { sessionStorage.setItem(key, JSON.stringify(out)); } catch {}
    return out;
  } catch {
    return null;
  }
}