import { YANDEX_METRIKA_ID } from "./site";

const METRIKA_API = "https://api-metrika.yandex.net/stat/v1/data";
// Counter install date; Metrika counts nothing before it.
const METRIKA_START = "2025-01-01";
const REVALIDATE_SECONDS = 3600;

// Without a token there is nothing to show in production; dev gets a sample number
// so the layout can still be checked.
const SAMPLE_COUNT = 50936;

/** Unique visitors since the Yandex Metrika counter was installed; null when unavailable. */
export async function getVisitorCount(): Promise<number | null> {
  const token = process.env.YANDEX_METRIKA_TOKEN;
  if (!token) return process.env.NODE_ENV === "development" ? SAMPLE_COUNT : null;

  try {
    const query = new URLSearchParams({
      ids: String(YANDEX_METRIKA_ID),
      metrics: "ym:s:users",
      date1: METRIKA_START,
      date2: "today",
    });
    const response = await fetch(`${METRIKA_API}?${query}`, {
      headers: { Authorization: `OAuth ${token}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) throw new Error(`Metrika responded ${response.status}`);
    const total = Number((await response.json())?.totals?.[0]);
    return Number.isFinite(total) ? total : null;
  } catch (error) {
    // The counter is decoration: log it without raising the dev error overlay.
    console.warn("Visitor count unavailable", error);
    return null;
  }
}
