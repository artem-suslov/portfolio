import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { HeroHeadline } from "@/data/hero-headline";

export const runtime = "nodejs";

// Dev-only: "Save to code" in the Headline DialKit panel writes the current values
// into src/data/hero-headline.ts, between the HERO_HEADLINE markers.

const sourcePath = path.join(process.cwd(), "src/data/hero-headline.ts");
const startMarker = "// HERO_HEADLINE_START";
const endMarker = "// HERO_HEADLINE_END";
const numberKeys = [
  "descriptionGap",
  "fontSize",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "mobileFontSize",
  "mobileLineHeight",
] as const;

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  try {
    const headline = (await request.json()) as unknown;

    if (!isValidHeadline(headline)) {
      return Response.json({ error: "Invalid headline settings" }, { status: 400 });
    }

    const source = await readFile(sourcePath, "utf8");
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker);

    if (start === -1 || end === -1 || end < start) {
      return Response.json({ error: "Headline markers are missing" }, { status: 500 });
    }

    const lines = [
      `  desktopBreak: ${headline.desktopBreak},`,
      ...numberKeys.map((key) => `  ${key}: ${headline[key]},`),
    ].join("\n");
    const next = `${source.slice(0, start + startMarker.length)}
export const heroHeadline: HeroHeadline = {
${lines}
};
${source.slice(end)}`;
    await writeFile(sourcePath, next, "utf8");

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to save headline settings" }, { status: 500 });
  }
}

function isValidHeadline(value: unknown): value is HeroHeadline {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.desktopBreak === "boolean" &&
    numberKeys.every((key) => {
      const number = record[key];
      return typeof number === "number" && Number.isFinite(number) && number >= -1000 && number <= 1000;
    })
  );
}
