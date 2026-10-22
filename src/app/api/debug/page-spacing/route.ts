import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PageSpacing } from "@/data/page-spacing";

export const runtime = "nodejs";

// Dev-only: "Save to code" in the Page spacing DialKit panel writes the current values
// into src/data/page-spacing.ts, between the PAGE_SPACING markers.

const sourcePath = path.join(process.cwd(), "src/data/page-spacing.ts");
const startMarker = "// PAGE_SPACING_START";
const endMarker = "// PAGE_SPACING_END";
const keys = [
  "aboutHeadingGap",
  "aboutParagraphGap",
  "aboutToColophon",
  "colophonBottom",
  "craftToAbout",
] as const;

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  try {
    const spacing = (await request.json()) as unknown;

    if (!isValidSpacing(spacing)) {
      return Response.json({ error: "Invalid page spacing" }, { status: 400 });
    }

    const source = await readFile(sourcePath, "utf8");
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker);

    if (start === -1 || end === -1 || end < start) {
      return Response.json({ error: "Page spacing markers are missing" }, { status: 500 });
    }

    const lines = keys.map((key) => `  ${key}: ${spacing[key]},`).join("\n");
    const next = `${source.slice(0, start + startMarker.length)}
export const pageSpacing: PageSpacing = {
${lines}
};
${source.slice(end)}`;
    await writeFile(sourcePath, next, "utf8");

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to save page spacing" }, { status: 500 });
  }
}

function isValidSpacing(value: unknown): value is PageSpacing {
  return (
    typeof value === "object" &&
    value !== null &&
    keys.every((key) => {
      const number = (value as Record<string, unknown>)[key];
      return typeof number === "number" && Number.isFinite(number) && number >= -1000 && number <= 1000;
    })
  );
}
