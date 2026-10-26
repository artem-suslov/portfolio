import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AiRibbon } from "@/data/ai-ribbon";

export const runtime = "nodejs";

// Dev-only: "Save to code" in the Ribbon DialKit panel writes the current values
// into src/data/ai-ribbon.ts, between the AI_RIBBON markers.

const sourcePath = path.join(process.cwd(), "src/data/ai-ribbon.ts");
const startMarker = "// AI_RIBBON_START";
const endMarker = "// AI_RIBBON_END";
const numberKeys = [
  "amplitude",
  "cornerDistance",
  "cornerThickness",
  "detail",
  "falloff",
  "fontSize",
  "fontWeight",
  "gustiness",
  "gustPeriod",
  "height",
  "highlight",
  "inset",
  "letterSpacing",
  "notch",
  "period",
  "press",
  "radius",
  "shadow",
  "sheen",
  "sway",
  "textOffset",
  "textOpacity",
  "turbulence",
  "twist",
  "wavelength",
  "width",
] as const;
const colorKeys = ["colorDeep", "colorLight", "colorMid", "textColor"] as const;
const variants = ["bookmark", "corner"];
const textBlends = [
  "color-dodge",
  "hard-light",
  "luminosity",
  "multiply",
  "normal",
  "overlay",
  "plus-lighter",
  "screen",
  "soft-light",
];
const keys = [...numberKeys, ...colorKeys, "textBlend", "uppercase", "variant"].sort();

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  try {
    const ribbon = (await request.json()) as unknown;

    if (!isValidRibbon(ribbon)) {
      return Response.json({ error: "Invalid ribbon settings" }, { status: 400 });
    }

    const source = await readFile(sourcePath, "utf8");
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker);

    if (start === -1 || end === -1 || end < start) {
      return Response.json({ error: "Ribbon markers are missing" }, { status: 500 });
    }

    const lines = keys
      .map((key) => `  ${key}: ${JSON.stringify(ribbon[key as keyof AiRibbon])},`)
      .join("\n");
    const next = `${source.slice(0, start + startMarker.length)}
export const aiRibbon: AiRibbon = {
${lines}
};
${source.slice(end)}`;
    await writeFile(sourcePath, next, "utf8");

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to save ribbon settings" }, { status: 500 });
  }
}

function isValidRibbon(value: unknown): value is AiRibbon {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.uppercase === "boolean" &&
    typeof record.variant === "string" &&
    variants.includes(record.variant) &&
    typeof record.textBlend === "string" &&
    textBlends.includes(record.textBlend) &&
    numberKeys.every((key) => {
      const number = record[key];
      return typeof number === "number" && Number.isFinite(number) && number >= -1000 && number <= 1000;
    }) &&
    colorKeys.every((key) => {
      const color = record[key];
      return typeof color === "string" && /^#[0-9a-f]{3,8}$/i.test(color);
    })
  );
}
