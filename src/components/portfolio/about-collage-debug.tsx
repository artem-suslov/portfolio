"use client";

import { useDialKitController } from "dialkit";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import "dialkit/styles.css";
import {
  type AboutCollageSettings,
  type CollageFrame,
  type CollageItem,
  aboutCollage,
} from "@/data/about-collage";
import { AboutCollage } from "./about-collage";

// Dev-only: live DialKit controls for the About Me collage, plus dragging photos right
// on the page. Values are not persisted, so a reload always shows src/data/about-collage.ts.
// "Save to code" writes the current layout into that file; "Copy layout" puts it on the
// clipboard as JSON. The panel shows up in the DialRoot that CraftBentoDebug mounts.

type Slider = [number, number, number, number];

const frameOptions: CollageFrame[] = ["photo", "plain", "oval", "circle", "stamp", "scallop", "ticket"];

const config = {
  stage: {
    width: [aboutCollage.width, 600, 1600, 1] as Slider,
    height: [aboutCollage.height, 300, 2400, 1] as Slider,
    spacing: [aboutCollage.spacing, -600, 200, 1] as Slider,
    mobileSpacing: [aboutCollage.mobileSpacing, -200, 200, 1] as Slider,
  },
  frame: {
    all: { default: aboutCollage.frame, options: ["mixed", ...frameOptions], type: "select" as const },
    color: { default: aboutCollage.frameColor, type: "color" as const },
    thickness: [aboutCollage.framePadding, 0, 40, 1] as Slider,
    cutSize: [aboutCollage.cutSize, 0.3, 3, 0.05] as Slider,
    innerRadius: [aboutCollage.innerRadius, 0, 60, 1] as Slider,
  },
  style: {
    _collapsed: true,
    shadow: [aboutCollage.shadow, 0, 1, 0.05] as Slider,
    captionSize: [aboutCollage.captionSize, 10, 60, 1] as Slider,
    hoverScale: [aboutCollage.hoverScale, 1, 1.2, 0.01] as Slider,
  },
  photos: Object.fromEntries(
    aboutCollage.items.map((item) => [
      item.id,
      {
        _collapsed: true,
        visible: item.visible,
        frame: { default: item.frame, options: frameOptions, type: "select" as const },
        x: [item.x, -200, 1800, 1] as Slider,
        y: [item.y, -200, 2600, 1] as Slider,
        width: [item.width, 40, 900, 1] as Slider,
        rotate: [item.rotate, -45, 45, 0.5] as Slider,
        z: [item.z, 0, 40, 1] as Slider,
        caption: { default: item.caption, placeholder: "No caption", type: "text" as const },
        captionX: [item.captionX, -400, 400, 1] as Slider,
        captionY: [item.captionY, -400, 400, 1] as Slider,
      },
    ]),
  ),
  save: { label: "Save to code", type: "action" as const },
  copy: { label: "Copy layout", type: "action" as const },
  reset: { label: "Reset", type: "action" as const },
};

type ItemValues = Omit<CollageItem, "frame" | "id"> & { frame: string };

export function AboutCollageDebug() {
  // Actions read the latest render through refs, whatever closure the panel kept.
  const settingsRef = useRef<AboutCollageSettings>(aboutCollage);
  const resetRef = useRef<() => void>(() => undefined);
  const [status, setStatus] = useState<string | null>(null);
  const dial = useDialKitController("About collage", config, {
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
        console.info("[about collage] layout\n", text);
      }
    },
  });
  const { setValue, values } = dial;
  const photoValues = values.photos as unknown as Record<string, ItemValues>;

  const settings: AboutCollageSettings = {
    captionSize: values.style.captionSize,
    cutSize: values.frame.cutSize,
    frame: values.frame.all as AboutCollageSettings["frame"],
    frameColor: values.frame.color,
    framePadding: values.frame.thickness,
    height: values.stage.height,
    hoverScale: values.style.hoverScale,
    innerRadius: values.frame.innerRadius,
    items: aboutCollage.items.map(({ id }) => {
      const item = photoValues[id];

      return {
        caption: item.caption,
        captionX: item.captionX,
        captionY: item.captionY,
        frame: item.frame as CollageFrame,
        id,
        rotate: item.rotate,
        visible: item.visible,
        width: item.width,
        x: item.x,
        y: item.y,
        z: item.z,
      };
    }),
    mobileSpacing: values.stage.mobileSpacing,
    shadow: values.style.shadow,
    spacing: values.stage.spacing,
    width: values.stage.width,
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

  // Drag a photo: pointer movement in screen pixels becomes stage pixels and goes
  // straight into the panel's x/y sliders.
  const startDrag = (id: string, event: PointerEvent<HTMLElement>) => {
    const stage = event.currentTarget.parentElement;
    const item = settingsRef.current.items.find((entry) => entry.id === id);

    if (event.button !== 0 || !stage || !item) {
      return;
    }

    event.preventDefault();
    const scale = settingsRef.current.width / stage.getBoundingClientRect().width;
    const startX = event.clientX;
    const startY = event.clientY;

    const move = (moveEvent: globalThis.PointerEvent) => {
      setValue(`photos.${id}.x`, Math.round(item.x + (moveEvent.clientX - startX) * scale));
      setValue(`photos.${id}.y`, Math.round(item.y + (moveEvent.clientY - startY) * scale));
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  return (
    <>
      <AboutCollage editable onItemPointerDown={startDrag} settings={settings} />
      {status ? (
        <div role="status" style={statusStyle}>
          {status}
        </div>
      ) : null}
    </>
  );
}

async function saveToCode(settings: AboutCollageSettings) {
  try {
    const response = await fetch("/api/debug/about-collage", {
      body: JSON.stringify(settings),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    return response.ok ? "Saved to src/data/about-collage.ts" : "Couldn’t save the collage";
  } catch {
    return "Couldn’t save the collage";
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
