import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const sourcePath = path.join(process.cwd(), "src/components/portfolio-case/portfolio-case.module.css");
const startMarker = "/* CASE_MEDIA_DEBUG_OVERRIDES_START */";
const endMarker = "/* CASE_MEDIA_DEBUG_OVERRIDES_END */";
const validCaseId = /^[a-z0-9-]+$/;
const validFits = new Set(["contain", "cover", "fill"]);

type MediaSettings = {
  fit: "contain" | "cover" | "fill";
  height: number;
  width: number;
  x: number;
  y: number;
};

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  try {
    const { caseId, settings } = (await request.json()) as {
      caseId?: unknown;
      settings?: Partial<MediaSettings>;
    };

    if (
      typeof caseId !== "string" ||
      !validCaseId.test(caseId) ||
      !isValidSettings(settings)
    ) {
      return Response.json({ error: "Invalid media settings" }, { status: 400 });
    }

    const source = await readFile(sourcePath, "utf8");
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker);

    if (start === -1 || end === -1 || end < start) {
      return Response.json({ error: "Debug override markers are missing" }, { status: 500 });
    }

    const before = source.slice(0, start + startMarker.length);
    const overrides = source.slice(start + startMarker.length, end);
    const after = source.slice(end);
    const rule = createRule(caseId, settings);
    const rulePattern = new RegExp(
      `\\n?/\\* ${escapeRegExp(caseId)} \\*/\\n\\.case\\[data-case-id="${escapeRegExp(caseId)}"\\] \\[data-debug-media\\] \\{[\\s\\S]*?\\n\\}\\n?`,
    );
    const nextOverrides = rulePattern.test(overrides)
      ? overrides.replace(rulePattern, `\n${rule}\n`)
      : `${overrides.trimEnd()}\n${rule}\n`;

    await writeFile(sourcePath, `${before}${nextOverrides}${after}`, "utf8");

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to apply media settings" }, { status: 500 });
  }
}

function isValidSettings(settings: Partial<MediaSettings> | undefined): settings is MediaSettings {
  return Boolean(
    settings &&
      validFits.has(settings.fit ?? "") &&
      isInRange(settings.width, 40, 3200) &&
      isInRange(settings.height, 40, 1800) &&
      isInRange(settings.x, -300, 700) &&
      isInRange(settings.y, -300, 500),
  );
}

function isInRange(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function createRule(caseId: string, settings: MediaSettings) {
  return `/* ${caseId} */
.case[data-case-id="${caseId}"] [data-debug-media] {
  position: absolute;
  inset: auto;
  top: ${settings.y}px;
  left: ${settings.x}px;
  width: ${settings.width}px;
  height: ${settings.height}px;
  max-width: none;
  max-height: none;
  margin: 0;
  flex: none;
  object-fit: ${settings.fit};
  transform: none;
}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
