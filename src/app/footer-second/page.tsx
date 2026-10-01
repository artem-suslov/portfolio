"use client";

import { type PointerEvent, useId, useState } from "react";
import {
  defaultPhantomGlowSettings,
  getGlowMiddleStop,
  PHANTOM_VIEW_BOX,
  phantomPath,
} from "@/components/phantom/phantom-mark";
import styles from "./page.module.css";

const settings = { ...defaultPhantomGlowSettings, logoColor: "#181721" };
const { height: viewBoxHeight, width: viewBoxWidth } = PHANTOM_VIEW_BOX;
const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

export default function FooterSecondPage() {
  const gradientId = `${useId().replaceAll(":", "")}-phantom-route-gradient`;
  const [isGlowActive, setIsGlowActive] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 912, y: 759 });
  const [viewBoxScale, setViewBoxScale] = useState(3.5);

  function updateGlowPosition(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    setIsGlowActive(true);
    setViewBoxScale(viewBoxWidth / rect.width);
    setGlowPosition({
      x: Math.round(((event.clientX - rect.left) / rect.width) * viewBoxWidth),
      y: Math.round(((event.clientY - rect.top) / rect.height) * viewBoxHeight),
    });
  }

  const fill = `url(#${gradientId})`;
  const isOutline = settings.isOutlineGlow;

  return (
    <main className={styles.page}>
      <div
        className={styles.logo}
        onPointerEnter={updateGlowPosition}
        onPointerLeave={() => setIsGlowActive(false)}
        onPointerMove={updateGlowPosition}
        style={{
          width: `min(${72 * settings.scale}vw, ${560 * settings.scale}px)`,
        }}
      >
        <svg aria-hidden="true" className={styles.mark} fill="none" viewBox={viewBox}>
          <path d={phantomPath} fill={settings.logoColor} />
        </svg>
        <svg
          aria-hidden="true"
          className={`${styles.mark} ${styles.glow}`}
          fill="none"
          style={{ opacity: isGlowActive ? 1 : 0 }}
          viewBox={viewBox}
        >
          <defs>
            <radialGradient
              cx={glowPosition.x}
              cy={glowPosition.y}
              gradientUnits="userSpaceOnUse"
              id={gradientId}
              r={settings.radius * viewBoxScale}
            >
              <stop stopColor={settings.glowColor} stopOpacity={settings.opacity} />
              <stop
                offset={getGlowMiddleStop(settings.blur)}
                stopColor={settings.glowColor}
                stopOpacity={settings.opacity * 0.72}
              />
              <stop offset="1" stopColor={settings.glowColor} stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d={phantomPath}
            fill={isOutline ? "none" : fill}
            stroke={isOutline ? fill : undefined}
            strokeLinecap={isOutline ? "round" : undefined}
            strokeLinejoin={isOutline ? "round" : undefined}
            strokeWidth={isOutline ? settings.outlineWidth : undefined}
            style={{
              filter: `brightness(${settings.brightness}) saturate(${settings.saturation})`,
              vectorEffect: isOutline ? "non-scaling-stroke" : undefined,
            }}
          />
        </svg>
      </div>
    </main>
  );
}
