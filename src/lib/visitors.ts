import { YANDEX_METRIKA_ID } from "./site";

export type VisitorStats = {
  /** Unique visitors since the counter was installed. */
  total: number;
  /** Unique visitors per day, oldest first. */
  daily: number[];
};

const METRIKA_API = "https://api-metrika.yandex.net/stat/v1/data";
// Counter install date; Metrika counts nothing before it.
const METRIKA_START = "2025-01-01";
const DAILY_BARS = 7;
const REVALIDATE_SECONDS = 3600;

// Without a token there is nothing to show in production; dev gets sample numbers
// so the layout can still be checked.
const SAMPLE_STATS: VisitorStats = { total: 50936, daily: [48, 62, 55, 71, 66, 90, 58] };

async function metrikaGet(path: string, params: Record<string, string>, token: string) {
  const query = new URLSearchParams({ ids: String(YANDEX_METRIKA_ID), ...params });
  const response = await fetch(`${METRIKA_API}${path}?${query}`, {
    headers: { Authorization: `OAuth ${token}` },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`Metrika ${path || "/"} responded ${response.status}`);
  return response.json();
}

/** Reads visitor counts from Yandex Metrika; null when they can't be loaded. */
export async function getVisitorStats(): Promise<VisitorStats | null> {
  const token = process.env.YANDEX_METRIKA_TOKEN;
  if (!token) return process.env.NODE_ENV === "development" ? SAMPLE_STATS : null;

  try {
    const [totals, byDay] = await Promise.all([
      metrikaGet("", { metrics: "ym:s:users", date1: METRIKA_START, date2: "today" }, token),
      metrikaGet(
        "/bytime",
        {
          metrics: "ym:s:users",
          date1: `${DAILY_BARS - 1}daysAgo`,
          date2: "today",
          group: "day",
        },
        token,
      ),
    ]);
    const total = Number(totals?.totals?.[0]);
    const daily: unknown = byDay?.totals?.[0];
    if (!Number.isFinite(total) || !Array.isArray(daily)) return null;
    return { total, daily: daily.map(Number) };
  } catch (error) {
    console.error("Visitor stats unavailable", error);
    return null;
  }
}
