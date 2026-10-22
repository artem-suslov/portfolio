"use client";

import { useDialKitController } from "dialkit";
import { useEffect, useRef } from "react";
import "dialkit/styles.css";
import { type HeroHeadline, heroHeadline, heroHeadlineVars } from "@/data/hero-headline";
import { useDialSave } from "./dial-save";

// Dev-only: live DialKit controls for the home page headline. The values go straight onto
// the page's <main> as --hero-name-* properties. The shared "Save to code" (dial-save.tsx)
// writes them into src/data/hero-headline.ts. The panel shows up in the DialRoot that
// CraftBentoDebug mounts.

type Slider = [number, number, number, number];

const config = {
  desktop: {
    fontSize: [heroHeadline.fontSize, 12, 64, 1] as Slider,
    lineHeight: [heroHeadline.lineHeight, 12, 80, 1] as Slider,
    lineBreak: heroHeadline.desktopBreak,
  },
  mobile: {
    fontSize: [heroHeadline.mobileFontSize, 12, 48, 1] as Slider,
    lineHeight: [heroHeadline.mobileLineHeight, 12, 64, 1] as Slider,
  },
  fontWeight: [heroHeadline.fontWeight, 300, 800, 10] as Slider,
  letterSpacing: [heroHeadline.letterSpacing, -0.1, 0.1, 0.005] as Slider,
  descriptionGap: [heroHeadline.descriptionGap, 0, 64, 1] as Slider,
  reset: { label: "Reset", type: "action" as const },
};

export function HeroHeadlineDebug() {
  const markerRef = useRef<HTMLSpanElement>(null);
  // Actions read the latest render through refs, whatever closure the panel kept.
  const headlineRef = useRef<HeroHeadline>(heroHeadline);
  const resetRef = useRef<() => void>(() => undefined);
  useDialSave("Headline", { endpoint: "/api/debug/hero-headline", valueRef: headlineRef });
  const dial = useDialKitController("Headline", config, {
    onAction: (action) => {
      if (action === "reset") {
        resetRef.current();
      }
    },
  });
  const { values } = dial;
  const headline: HeroHeadline = {
    descriptionGap: values.descriptionGap,
    desktopBreak: values.desktop.lineBreak,
    fontSize: values.desktop.fontSize,
    fontWeight: values.fontWeight,
    letterSpacing: Math.round(values.letterSpacing * 1000) / 1000,
    lineHeight: values.desktop.lineHeight,
    mobileFontSize: values.mobile.fontSize,
    mobileLineHeight: values.mobile.lineHeight,
  };

  useEffect(() => {
    headlineRef.current = headline;
    resetRef.current = dial.resetValues;

    const page = markerRef.current?.closest("main");

    for (const [name, value] of Object.entries(heroHeadlineVars(headline))) {
      page?.style.setProperty(name, value);
    }
  });

  return <span hidden ref={markerRef} />;
}
