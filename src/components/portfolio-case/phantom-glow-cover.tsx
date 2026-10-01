"use client";

import dynamic from "next/dynamic";
import {
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  defaultPhantomGlowSettings,
  getGlowMiddleStop,
  PHANTOM_VIEW_BOX,
  type PhantomGlowSettings,
  phantomPath,
} from "@/components/phantom/phantom-mark";
import styles from "./portfolio-case.module.css";

const PhantomCaseDebugControls =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("./phantom-case-debug-controls").then(
            (module) => module.PhantomCaseDebugControls,
          ),
        { ssr: false },
      )
    : null;

const { height: viewBoxHeight, width: viewBoxWidth } = PHANTOM_VIEW_BOX;
const glowCenter = { x: 912, y: 759 };
const glowOrbit = { x: 560, y: 430 };
const autoGlowDuration = 5200;

function getAutoPhaseFromPosition(x: number, y: number) {
  const angle = Math.atan2(
    (y - glowCenter.y) / glowOrbit.y,
    (x - glowCenter.x) / glowOrbit.x,
  );
  const phase = (angle + Math.PI / 2) / (Math.PI * 2);

  return ((phase % 1) + 1) % 1;
}

function getAutoGlowPosition(progress: number) {
  const angle = progress * Math.PI * 2 - Math.PI / 2;

  return {
    x: Math.round(
      glowCenter.x + Math.cos(angle) * glowOrbit.x + Math.sin(angle * 2) * 80,
    ),
    y: Math.round(
      glowCenter.y + Math.sin(angle) * glowOrbit.y - Math.cos(angle * 2) * 90,
    ),
  };
}

/** Phantom logo whose outline glow orbits on its own and follows the pointer on hover. */
export function PhantomGlowCover() {
  const gradientId = `${useId().replaceAll(":", "")}-phantom-card-gradient`;
  const animationFrameRef = useRef<number | null>(null);
  const autoPhaseRef = useRef(0);
  const [settings, setSettings] = useState<PhantomGlowSettings>(
    defaultPhantomGlowSettings,
  );
  const [glowPosition, setGlowPosition] = useState(glowCenter);
  const [viewBoxScale, setViewBoxScale] = useState(3.5);

  const stopAutoGlow = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const startAutoGlow = useCallback(() => {
    if (animationFrameRef.current !== null) {
      return;
    }

    let startedAt: number | null = null;
    const startPhase = autoPhaseRef.current;

    const animateGlow = (timestamp: number) => {
      startedAt ??= timestamp;

      const progress =
        (startPhase +
          ((timestamp - startedAt) % autoGlowDuration) / autoGlowDuration) %
        1;

      autoPhaseRef.current = progress;
      setGlowPosition(getAutoGlowPosition(progress));
      animationFrameRef.current = requestAnimationFrame(animateGlow);
    };

    animationFrameRef.current = requestAnimationFrame(animateGlow);
  }, []);

  useEffect(() => {
    startAutoGlow();
    return stopAutoGlow;
  }, [startAutoGlow, stopAutoGlow]);

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextPosition = {
      x: Math.round(((event.clientX - rect.left) / rect.width) * viewBoxWidth),
      y: Math.round(((event.clientY - rect.top) / rect.height) * viewBoxHeight),
    };

    setViewBoxScale(viewBoxWidth / rect.width);
    autoPhaseRef.current = getAutoPhaseFromPosition(
      nextPosition.x,
      nextPosition.y,
    );
    setGlowPosition(nextPosition);
  }

  const fill = `url(#${gradientId})`;
  const isOutline = settings.isOutlineGlow;

  return (
    <>
      <div
        className={styles.phantomCaseTarget}
        onPointerEnter={(event) => {
          stopAutoGlow();
          followPointer(event);
        }}
        onPointerLeave={startAutoGlow}
        onPointerMove={followPointer}
        style={{
          width: `min(${72 * settings.scale}%, ${560 * settings.scale}px)`,
        }}
      >
        <svg
          aria-hidden="true"
          className={styles.phantomCaseLogo}
          data-debug-media
          fill="none"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              cx={glowPosition.x}
              cy={glowPosition.y}
              gradientUnits="userSpaceOnUse"
              id={gradientId}
              r={settings.radius * viewBoxScale}
            >
              <stop
                stopColor={settings.glowColor}
                stopOpacity={settings.opacity}
              />
              <stop
                offset={getGlowMiddleStop(settings.blur)}
                stopColor={settings.glowColor}
                stopOpacity={settings.opacity * 0.72}
              />
              <stop offset="1" stopColor={settings.glowColor} stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d={phantomPath} fill={settings.logoColor} />
          <path
            className={styles.phantomCaseGlow}
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

      <span className={styles.phantomCaseHint}>Hover on logo</span>

      {PhantomCaseDebugControls ? (
        <PhantomCaseDebugControls
          onUpdateSetting={(key, value) =>
            setSettings((currentSettings) => ({ ...currentSettings, [key]: value }))
          }
          settings={settings}
        />
      ) : null}
    </>
  );
}
