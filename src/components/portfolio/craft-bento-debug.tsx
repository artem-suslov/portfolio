"use client";

import { DialRoot, useDialKitController } from "dialkit";
import { useEffect, useRef } from "react";
import "dialkit/styles.css";
import { conceptsById } from "@/data/concepts";
import {
  type CraftBentoSettings,
  type CraftCaptions,
  type CraftTileFit,
  craftBento,
} from "@/data/craft-bento";
import { CraftBento } from "./craft-bento";

// Dev-only: live DialKit controls for the craft grid. "Copy layout" puts the
// current settings on the clipboard in the shape of `craftBento`, ready to paste
// into src/data/craft-bento.ts.

const tileCount = craftBento.tiles.length;

const config = {
  columns: [craftBento.columns, 1, 6, 1] as [number, number, number, number],
  rowHeight: [craftBento.rowHeight, 80, 480, 1] as [number, number, number, number],
  gap: [craftBento.gap, 0, 48, 1] as [number, number, number, number],
  radius: [craftBento.radius, 0, 32, 1] as [number, number, number, number],
  spacing: [craftBento.spacing, 0, 240, 1] as [number, number, number, number],
  maxWidth: [craftBento.maxWidth, 700, 1440, 1] as [number, number, number, number],
  dense: craftBento.dense,
  captions: {
    default: craftBento.captions,
    options: ["full", "title", "none"],
    type: "select" as const,
  },
  heading: { default: craftBento.heading, placeholder: "No heading", type: "text" as const },
  mobile: {
    _collapsed: true,
    columns: [craftBento.mobileColumns, 1, 3, 1] as [number, number, number, number],
    rowHeight: [craftBento.mobileRowHeight, 80, 480, 1] as [number, number, number, number],
  },
  tiles: {
    _collapsed: true,
    ...Object.fromEntries(
      craftBento.tiles.map((tile, index) => [
        tile.label,
        {
          _collapsed: true,
          visible: !tile.hidden,
          order: [index + 1, 1, tileCount, 1] as [number, number, number, number],
          cols: [tile.cols, 1, 6, 1] as [number, number, number, number],
          rows: [tile.rows, 1, 6, 1] as [number, number, number, number],
          // Only concept shots can switch between a crop and the whole image.
          ...(conceptsById.has(tile.id)
            ? { fit: { default: tile.fit, options: ["cover", "contain"], type: "select" as const } }
            : {}),
        },
      ]),
    ),
  },
  copy: { label: "Copy layout", type: "action" as const },
  reset: { label: "Reset", type: "action" as const },
};

type TileValues = {
  cols: number;
  fit?: string;
  order: number;
  rows: number;
  visible: boolean;
};

function CraftBentoWithDials() {
  // Actions read the latest render through refs, whatever closure the panel kept.
  const settingsRef = useRef<CraftBentoSettings>(craftBento);
  const resetRef = useRef<() => void>(() => undefined);
  const dial = useDialKitController("Craft grid", config, {
    onAction: (action) => {
      if (action === "reset") {
        resetRef.current();
      }

      if (action === "copy") {
        const text = JSON.stringify(settingsRef.current, null, 2);
        void navigator.clipboard.writeText(text).catch(() => undefined);
        console.info("[craft grid] layout\n", text);
      }
    },
    persist: { key: "portfolio-craft-grid-v3" },
  });
  const { values } = dial;
  const tileValues = values.tiles as unknown as Record<string, TileValues>;

  const settings: CraftBentoSettings = {
    captions: values.captions as CraftCaptions,
    columns: values.columns,
    dense: values.dense,
    gap: values.gap,
    heading: values.heading,
    maxWidth: values.maxWidth,
    mobileColumns: values.mobile.columns,
    mobileRowHeight: values.mobile.rowHeight,
    radius: values.radius,
    rowHeight: values.rowHeight,
    spacing: values.spacing,
    tiles: craftBento.tiles
      .map((tile, index) => ({ index, tile, values: tileValues[tile.label] }))
      // Equal orders keep the data file's sequence.
      .sort((a, b) => a.values.order - b.values.order || a.index - b.index)
      .map(({ tile, values: tileSettings }) => ({
        cols: tileSettings.cols,
        fit: (tileSettings.fit ?? tile.fit) as CraftTileFit,
        hidden: !tileSettings.visible,
        id: tile.id,
        label: tile.label,
        rows: tileSettings.rows,
      })),
  };

  useEffect(() => {
    settingsRef.current = settings;
    resetRef.current = dial.resetValues;
  });

  return <CraftBento settings={settings} />;
}

export function CraftBentoDebug() {
  return (
    <>
      <CraftBentoWithDials />
      <DialRoot defaultOpen={false} position="top-right" />
    </>
  );
}
