"use client";

import { useDialKitController } from "dialkit";
import { useEffect, useRef } from "react";
import "dialkit/styles.css";
import { useDialSave } from "@/components/portfolio/dial-save";
import { type AiRibbon, aiRibbon } from "@/data/ai-ribbon";
import { setAiRibbonSettings } from "./ai-ribbon";

// Dev-only: live DialKit controls for the "Made with AI" bookmark on the Animator card.
// The shared "Save to code" (dial-save.tsx) writes them into src/data/ai-ribbon.ts. The
// panel shows up in the DialRoot that CraftBentoDebug mounts.

type Slider = [number, number, number, number];

const config = {
  shape: {
    width: [aiRibbon.width, 60, 200, 1] as Slider,
    height: [aiRibbon.height, 24, 100, 1] as Slider,
    notch: [aiRibbon.notch, 0, 30, 1] as Slider,
    radius: [aiRibbon.radius, 0, 20, 1] as Slider,
    inset: [aiRibbon.inset, 0, 120, 1] as Slider,
  },
  text: {
    uppercase: aiRibbon.uppercase,
    fontSize: [aiRibbon.fontSize, 8, 20, 0.5] as Slider,
    fontWeight: [aiRibbon.fontWeight, 300, 900, 100] as Slider,
    letterSpacing: [aiRibbon.letterSpacing, -0.1, 0.3, 0.005] as Slider,
    textOffset: [aiRibbon.textOffset, -10, 10, 0.5] as Slider,
    textColor: { default: aiRibbon.textColor, type: "color" as const },
  },
  wave: {
    amplitude: [aiRibbon.amplitude, 0, 10, 0.1] as Slider,
    sway: [aiRibbon.sway, 0, 6, 0.1] as Slider,
    wavelength: [aiRibbon.wavelength, 0.3, 3, 0.05] as Slider,
    period: [aiRibbon.period, 0.5, 8, 0.1] as Slider,
    falloff: [aiRibbon.falloff, 0.3, 3, 0.1] as Slider,
    detail: [aiRibbon.detail, 0, 1, 0.05] as Slider,
    turbulence: [aiRibbon.turbulence, 0, 1, 0.05] as Slider,
  },
  wind: {
    gustiness: [aiRibbon.gustiness, 0, 1, 0.05] as Slider,
    gustPeriod: [aiRibbon.gustPeriod, 1, 12, 0.5] as Slider,
    twist: [aiRibbon.twist, 0, 0.8, 0.01] as Slider,
  },
  light: {
    highlight: [aiRibbon.highlight, 0, 1, 0.01] as Slider,
    shadow: [aiRibbon.shadow, 0, 1, 0.01] as Slider,
    colorLight: { default: aiRibbon.colorLight, type: "color" as const },
    colorMid: { default: aiRibbon.colorMid, type: "color" as const },
    colorDeep: { default: aiRibbon.colorDeep, type: "color" as const },
  },
  reset: { label: "Reset", type: "action" as const },
};

export function AiRibbonDebug() {
  // Actions read the latest render through refs, whatever closure the panel kept.
  const ribbonRef = useRef<AiRibbon>(aiRibbon);
  const resetRef = useRef<() => void>(() => undefined);
  useDialSave("Ribbon", { endpoint: "/api/debug/ai-ribbon", valueRef: ribbonRef });
  const dial = useDialKitController("Ribbon", config, {
    onAction: (action) => {
      if (action === "reset") {
        resetRef.current();
      }
    },
  });
  const { light, shape, text, wave, wind } = dial.values;
  const ribbon: AiRibbon = {
    ...shape,
    ...text,
    ...wave,
    ...wind,
    ...light,
    letterSpacing: Math.round(text.letterSpacing * 1000) / 1000,
  };

  useEffect(() => {
    ribbonRef.current = ribbon;
    resetRef.current = dial.resetValues;
    setAiRibbonSettings(ribbon);
  });

  return null;
}
