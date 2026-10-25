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
    fontSize: [aiRibbon.fontSize, 9, 20, 1] as Slider,
  },
  wave: {
    amplitude: [aiRibbon.amplitude, 0, 10, 0.1] as Slider,
    sway: [aiRibbon.sway, 0, 6, 0.1] as Slider,
    wavelength: [aiRibbon.wavelength, 0.3, 3, 0.05] as Slider,
    period: [aiRibbon.period, 0.5, 8, 0.1] as Slider,
    falloff: [aiRibbon.falloff, 0.3, 3, 0.1] as Slider,
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
  const { light, shape, wave } = dial.values;
  const ribbon: AiRibbon = { ...shape, ...wave, ...light };

  useEffect(() => {
    ribbonRef.current = ribbon;
    resetRef.current = dial.resetValues;
    setAiRibbonSettings(ribbon);
  });

  return null;
}
