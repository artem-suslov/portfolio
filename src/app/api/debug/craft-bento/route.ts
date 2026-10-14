import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { concepts } from "@/data/concepts";
import type { CraftBentoSettings, CraftTile } from "@/data/craft-bento";
import { portfolioCases } from "@/data/portfolio-cases";

export const runtime = "nodejs";

// Dev-only: "Save to code" in the craft grid's DialKit panel writes the current
// layout into src/data/craft-bento.ts, between the CRAFT_BENTO markers.

const sourcePath = path.join(process.cwd(), "src/data/craft-bento.ts");
const startMarker = "// CRAFT_BENTO_START";
const endMarker = "// CRAFT_BENTO_END";
const knownIds = new Set([...portfolioCases.map(({ id }) => id), ...concepts.map(({ id }) => id)]);
const captions = new Set(["full", "none", "title"]);
const fits = new Set(["contain", "cover"]);
const positions = new Set(["bottom", "center", "left top", "right top", "top"]);

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  try {
    const settings = (await request.json()) as unknown;

    if (!isValidSettings(settings)) {
      return Response.json({ error: "Invalid craft grid settings" }, { status: 400 });
    }

    const source = await readFile(sourcePath, "utf8");
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker);

    if (start === -1 || end === -1 || end < start) {
      return Response.json({ error: "Craft grid markers are missing" }, { status: 500 });
    }

    const next = `${source.slice(0, start + startMarker.length)}\n${createSource(settings)}\n${source.slice(end)}`;
    await writeFile(sourcePath, next, "utf8");

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to save craft grid settings" }, { status: 500 });
  }
}

function createSource(settings: CraftBentoSettings) {
  const rows = settings.rows
    .map((row) => `    [${row.map(createTile).join(", ")}],`)
    .join("\n");

  return `export const craftBento: CraftBentoSettings = {
  captions: ${text(settings.captions)},
  description:
    ${text(settings.description)},
  gap: ${settings.gap},
  heading: ${text(settings.heading)},
  headerGap: ${settings.headerGap},
  headerWidth: ${settings.headerWidth},
  maxWidth: ${settings.maxWidth},
  radius: ${settings.radius},
  rowHeight: ${settings.rowHeight},
  rowGap: ${settings.rowGap},
  rows: [
${rows}
  ],
  spacing: ${settings.spacing},
};`;
}

function createTile({ fit, id, label, position, width }: CraftTile) {
  // Defaults stay implicit, matching the hand-written entries.
  const media = [
    fit === "cover" ? null : `fit: ${text(fit)}`,
    position === "center" ? null : `position: ${text(position)}`,
  ].filter(Boolean);
  const args = [text(label), id === null ? "null" : text(id), String(width)];

  if (media.length > 0) {
    args.push(`{ ${media.join(", ")} }`);
  }

  return `tile(${args.join(", ")})`;
}

/** A double-quoted string literal; JSON escaping is valid TypeScript. */
function text(value: string) {
  return JSON.stringify(value);
}

function isValidSettings(value: unknown): value is CraftBentoSettings {
  if (!isRecord(value)) {
    return false;
  }

  return (
    captions.has(value.captions as string) &&
    isText(value.description, 300) &&
    isText(value.heading, 120) &&
    isInRange(value.gap, 0, 96) &&
    isInRange(value.headerGap, 0, 200) &&
    isInRange(value.headerWidth, 200, 1600) &&
    isInRange(value.maxWidth, 400, 2000) &&
    isInRange(value.radius, 0, 64) &&
    isInRange(value.rowHeight, 40, 1200) &&
    isInRange(value.rowGap, 0, 96) &&
    isInRange(value.spacing, 0, 400) &&
    Array.isArray(value.rows) &&
    value.rows.length <= 12 &&
    value.rows.every((row) => Array.isArray(row) && row.length <= 6 && row.every(isValidTile))
  );
}

function isValidTile(value: unknown): value is CraftTile {
  return (
    isRecord(value) &&
    (value.id === null || knownIds.has(value.id as string)) &&
    fits.has(value.fit as string) &&
    positions.has(value.position as string) &&
    isText(value.label, 40) &&
    isInRange(value.width, 1, 2000)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.length <= maxLength;
}

function isInRange(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}
