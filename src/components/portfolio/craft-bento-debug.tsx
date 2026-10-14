"use client";

import { DialRoot, useDialKitController } from "dialkit";
import { useEffect, useRef, useState } from "react";
import "dialkit/styles.css";
import { concepts } from "@/data/concepts";
import {
  type CraftBentoSettings,
  type CraftCaptions,
  type CraftTileFit,
  type CraftTilePosition,
  craftBento,
} from "@/data/craft-bento";
import { CraftBento } from "./craft-bento";

// Dev-only: live DialKit controls for the craft grid. Values are not persisted, so
// a reload always shows src/data/craft-bento.ts. "Save to code" writes the current
// settings into that file; "Copy layout" puts them on the clipboard as JSON.

type Slider = [number, number, number, number];

const emptyTile = "blank";
const contentOptions = [
  { label: "Telegram stickers", value: "telegram-quick-stickers" },
  { label: "Bank card", value: "mesh-card-demo" },
  { label: "AI agents workspace", value: "steamify-case-2" },
  { label: "Phantom glow", value: "glow-hover-effect" },
  ...concepts.map(({ id }) => ({ label: id.replace("concept-", "Concept: "), value: id })),
  { label: "Blank", value: emptyTile },
];
const positionOptions: CraftTilePosition[] = ["center", "top", "bottom", "left top", "right top"];
// "1 · left" → "left": the row already names its folder.
const sideOf = (label: string) => label.split(" · ")[1] ?? label;

const config = {
  maxWidth: [craftBento.maxWidth, 700, 1600, 1] as Slider,
  rowHeight: [craftBento.rowHeight, 120, 800, 1] as Slider,
  gap: [craftBento.gap, 0, 48, 1] as Slider,
  rowGap: [craftBento.rowGap, 0, 48, 1] as Slider,
  radius: [craftBento.radius, 0, 32, 1] as Slider,
  spacing: [craftBento.spacing, 0, 240, 1] as Slider,
  captions: {
    default: craftBento.captions,
    options: ["none", "title", "full"],
    type: "select" as const,
  },
  header: {
    _collapsed: true,
    heading: { default: craftBento.heading, type: "text" as const },
    description: { default: craftBento.description, placeholder: "No description", type: "text" as const },
    width: [craftBento.headerWidth, 320, 1280, 1] as Slider,
    gap: [craftBento.headerGap, 0, 96, 1] as Slider,
  },
  ...Object.fromEntries(
    craftBento.rows.map((row, rowIndex) => [
      `row ${rowIndex + 1}`,
      {
        _collapsed: rowIndex > 0,
        ...Object.fromEntries(
          row.map((tile) => [
            sideOf(tile.label),
            {
              content: { default: tile.id ?? emptyTile, options: contentOptions, type: "select" as const },
              width: [tile.width, 100, 1280, 1] as Slider,
              fit: { default: tile.fit, options: ["cover", "contain"], type: "select" as const },
              position: { default: tile.position, options: positionOptions, type: "select" as const },
            },
          ]),
        ),
      },
    ]),
  ),
  save: { label: "Save to code", type: "action" as const },
  copy: { label: "Copy layout", type: "action" as const },
  reset: { label: "Reset", type: "action" as const },
};

type TileValues = { content: string; fit: string; position: string; width: number };

function CraftBentoWithDials() {
  // Actions read the latest render through refs, whatever closure the panel kept.
  const settingsRef = useRef<CraftBentoSettings>(craftBento);
  const resetRef = useRef<() => void>(() => undefined);
  const [status, setStatus] = useState<string | null>(null);
  const dial = useDialKitController("Craft grid", config, {
    onAction: (action) => {
      if (action === "reset") {
        resetRef.current();
      }

      if (action === "save") {
        void saveToCode(settingsRef.current).then(setStatus);
      }

      if (action === "copy") {
        const text = JSON.stringify(settingsRef.current, null, 2);
        void navigator.clipboard.writeText(text).catch(() => undefined);
        console.info("[craft grid] layout\n", text);
      }
    },
  });
  const { values } = dial;
  const rowValues = values as unknown as Record<string, Record<string, TileValues>>;

  const settings: CraftBentoSettings = {
    captions: values.captions as CraftCaptions,
    description: values.header.description,
    gap: values.gap,
    heading: values.header.heading,
    headerGap: values.header.gap,
    headerWidth: values.header.width,
    maxWidth: values.maxWidth,
    radius: values.radius,
    rowHeight: values.rowHeight,
    rowGap: values.rowGap,
    rows: craftBento.rows.map((row, rowIndex) =>
      row.map((tile) => {
        const tileValues = rowValues[`row ${rowIndex + 1}`][sideOf(tile.label)];

        return {
          fit: tileValues.fit as CraftTileFit,
          id: tileValues.content === emptyTile ? null : tileValues.content,
          label: tile.label,
          position: tileValues.position as CraftTilePosition,
          width: tileValues.width,
        };
      }),
    ),
    spacing: values.spacing,
  };

  useEffect(() => {
    settingsRef.current = settings;
    resetRef.current = dial.resetValues;
  });

  useEffect(() => {
    if (!status) {
      return;
    }

    const timeout = window.setTimeout(() => setStatus(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [status]);

  return (
    <>
      <CraftBento settings={settings} />
      {status ? (
        <div role="status" style={statusStyle}>
          {status}
        </div>
      ) : null}
    </>
  );
}

async function saveToCode(settings: CraftBentoSettings) {
  try {
    const response = await fetch("/api/debug/craft-bento", {
      body: JSON.stringify(settings),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    return response.ok ? "Saved to src/data/craft-bento.ts" : "Couldn’t save the layout";
  } catch {
    return "Couldn’t save the layout";
  }
}

const statusStyle = {
  position: "fixed",
  bottom: 24,
  left: "50%",
  zIndex: 2147483000,
  padding: "6px 12px",
  borderRadius: 999,
  background: "#111",
  color: "#fff",
  fontSize: 13,
  lineHeight: "20px",
  transform: "translateX(-50%)",
} as const;

export function CraftBentoDebug() {
  return (
    <>
      <CraftBentoWithDials />
      <DialRoot defaultOpen={false} position="top-right" />
    </>
  );
}
