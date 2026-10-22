"use client";

import { useDialKitController } from "dialkit";
import { useEffect, useRef, useState } from "react";
import "dialkit/styles.css";
import { type PageSpacing, pageSpacing, pageSpacingVars } from "@/data/page-spacing";

// Dev-only: live DialKit controls for the space between the home page's sections. The
// values go straight onto the page's <main> as --page-* properties. "Save to code"
// writes them into src/data/page-spacing.ts. The panel shows up in the DialRoot that
// CraftBentoDebug mounts.

type Slider = [number, number, number, number];

const config = {
  craftToAbout: [pageSpacing.craftToAbout, -200, 400, 1] as Slider,
  aboutHeadingGap: [pageSpacing.aboutHeadingGap, -40, 120, 1] as Slider,
  aboutParagraphGap: [pageSpacing.aboutParagraphGap, 0, 80, 1] as Slider,
  aboutToColophon: [pageSpacing.aboutToColophon, -200, 400, 1] as Slider,
  colophonBottom: [pageSpacing.colophonBottom, 0, 400, 1] as Slider,
  save: { label: "Save to code", type: "action" as const },
  reset: { label: "Reset", type: "action" as const },
};

export function PageSpacingDebug() {
  const markerRef = useRef<HTMLSpanElement>(null);
  // Actions read the latest render through refs, whatever closure the panel kept.
  const spacingRef = useRef<PageSpacing>(pageSpacing);
  const resetRef = useRef<() => void>(() => undefined);
  const [status, setStatus] = useState<string | null>(null);
  const dial = useDialKitController("Page spacing", config, {
    onAction: (action) => {
      if (action === "reset") {
        resetRef.current();
      }

      if (action === "save") {
        void saveToCode(spacingRef.current).then(setStatus);
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

  useEffect(() => {
    if (!status) {
      return;
    }

    const timeout = window.setTimeout(() => setStatus(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [status]);

  return (
    <>
      <span hidden ref={markerRef} />
      {status ? (
        <div role="status" style={statusStyle}>
          {status}
        </div>
      ) : null}
    </>
  );
}

async function saveToCode(spacing: PageSpacing) {
  try {
    const response = await fetch("/api/debug/page-spacing", {
      body: JSON.stringify(spacing),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    return response.ok ? "Saved to src/data/page-spacing.ts" : "Couldn’t save the spacing";
  } catch {
    return "Couldn’t save the spacing";
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
