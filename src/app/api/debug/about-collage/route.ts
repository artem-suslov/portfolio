import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { type AboutCollageSettings, type CollageItem, collageMedia } from "@/data/about-collage";

export const runtime = "nodejs";

// Dev-only: "Save to code" in the About collage's DialKit panel writes the current
// layout into src/data/about-collage.ts, between the ABOUT_COLLAGE markers.

const sourcePath = path.join(process.cwd(), "src/data/about-collage.ts");
const startMarker = "// ABOUT_COLLAGE_START";
const endMarker = "// ABOUT_COLLAGE_END";
const frames = new Set(["circle", "oval", "photo", "plain", "scallop", "stamp", "ticket"]);

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  try {
    const settings = (await request.json()) as unknown;

    if (!isValidSettings(settings)) {
      return Response.json({ error: "Invalid collage settings" }, { status: 400 });
    }

    const source = await readFile(sourcePath, "utf8");
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker);

    if (start === -1 || end === -1 || end < start) {
      return Response.json({ error: "Collage markers are missing" }, { status: 500 });
    }

    const next = `${source.slice(0, start + startMarker.length)}\n${createSource(settings)}\n${source.slice(end)}`;
    await writeFile(sourcePath, next, "utf8");

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to save collage settings" }, { status: 500 });
  }
}

function createSource(settings: AboutCollageSettings) {
  const items = settings.items.map((item) => `    ${createItem(item)},`).join("\n");

  return `export const aboutCollage: AboutCollageSettings = {
  captionSize: ${settings.captionSize},
  cutSize: ${settings.cutSize},
  frame: ${text(settings.frame)},
  frameColor: ${text(settings.frameColor)},
  framePadding: ${settings.framePadding},
  height: ${settings.height},
  hoverScale: ${settings.hoverScale},
  innerRadius: ${settings.innerRadius},
  items: [
${items}
  ],
  shadow: ${settings.shadow},
  spacing: ${settings.spacing},
  width: ${settings.width},
};`;
}

function createItem(item: CollageItem) {
  return `{ id: ${text(item.id)}, visible: ${item.visible}, frame: ${text(item.frame)}, x: ${item.x}, y: ${item.y}, width: ${item.width}, rotate: ${item.rotate}, z: ${item.z}, caption: ${text(item.caption)}, captionX: ${item.captionX}, captionY: ${item.captionY} }`;
}

/** A double-quoted string literal; JSON escaping is valid TypeScript. */
function text(value: string) {
  return JSON.stringify(value);
}

function isValidSettings(value: unknown): value is AboutCollageSettings {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isInRange(value.captionSize, 1, 200) &&
    isInRange(value.cutSize, 0.1, 5) &&
    (value.frame === "mixed" || frames.has(value.frame as string)) &&
    typeof value.frameColor === "string" &&
    /^#[0-9a-f]{3,8}$/i.test(value.frameColor) &&
    isInRange(value.innerRadius, 0, 200) &&
    isInRange(value.framePadding, 0, 100) &&
    isInRange(value.height, 100, 4000) &&
    isInRange(value.hoverScale, 1, 2) &&
    isInRange(value.shadow, 0, 1) &&
    isInRange(value.spacing, -1000, 400) &&
    isInRange(value.width, 200, 2400) &&
    Array.isArray(value.items) &&
    value.items.length <= 60 &&
    value.items.every(isValidItem)
  );
}

function isValidItem(value: unknown): value is CollageItem {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id in collageMedia &&
    typeof value.visible === "boolean" &&
    frames.has(value.frame as string) &&
    typeof value.caption === "string" &&
    value.caption.length <= 80 &&
    isInRange(value.captionX, -1000, 1000) &&
    isInRange(value.captionY, -1000, 1000) &&
    isInRange(value.rotate, -180, 180) &&
    isInRange(value.width, 1, 2000) &&
    isInRange(value.x, -1000, 4000) &&
    isInRange(value.y, -1000, 6000) &&
    isInRange(value.z, 0, 100)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInRange(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}
