"use client";

import { useDialKitController } from "dialkit";
import { useEffect, useRef } from "react";
import "dialkit/styles.css";
import { type PageSpacing, pageSpacing, pageSpacingVars } from "@/data/page-spacing";
import { useDialSave } from "./dial-save";

// Dev-only: live DialKit controls for the space between the home page's sections. The
// values go straight onto the page's <main> as --page-* properties. The shared
// "Save to code" (dial-save.tsx) writes them into src/data/page-spacing.ts. The panel
// shows up in the DialRoot that CraftBentoDebug mounts.

type Slider = [number, number, number, number];

const config = {
  craftToAbout: [pageSpacing.craftToAbout, -200, 400, 1] as Slider,
  aboutHeadingGap: [pageSpacing.aboutHeadingGap, -40, 120, 1] as Slider,
  aboutParagraphGap: [pageSpacing.aboutParagraphGap, 0, 80, 1] as Slider,
  aboutToColophon: [pageSpacing.aboutToColophon, -200, 400, 1] as Slider,
  colophonBottom: [pageSpacing.colophonBottom, 0, 400, 1] as Slider,
  reset: { label: "Reset", type: "action" as const },
};

export function PageSpacingDebug() {
  const markerRef = useRef<HTMLSpanElement>(null);
  // Actions read the latest render through refs, whatever closure the panel kept.
  const spacingRef = useRef<PageSpacing>(pageSpacing);
  const resetRef = useRef<() => void>(() => undefined);
  useDialSave("Page spacing", { endpoint: "/api/debug/page-spacing", valueRef: spacingRef });
  const dial = useDialKitController("Page spacing", config, {
    onAction: (action) => {
      if (action === "reset") {
        resetRef.current();
      }
    },
  });
  const { values } = dial;
  const spacing: PageSpacing = {
    aboutHeadingGap: values.aboutHeadingGap,
    aboutParagraphGap: values.aboutParagraphGap,
    aboutToColophon: values.aboutToColophon,
    colophonBottom: values.colophonBottom,
    craftToAbout: values.craftToAbout,
  };

  useEffect(() => {
    spacingRef.current = spacing;
    resetRef.current = dial.resetValues;

    const page = markerRef.current?.closest("main");

    for (const [name, value] of Object.entries(pageSpacingVars(spacing))) {
      page?.style.setProperty(name, value);
    }
  });

  return <span hidden ref={markerRef} />;
}
