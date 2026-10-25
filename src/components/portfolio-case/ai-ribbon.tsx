"use client";

import { type CSSProperties, useEffect, useId, useRef, useSyncExternalStore } from "react";
import { type AiRibbon as AiRibbonSettings, aiRibbon } from "@/data/ai-ribbon";
import styles from "./ai-ribbon.module.css";

const shadeStops = 12;

// Settings live in a tiny store so the dev-only DialKit panel can tune them on the fly.
let currentSettings = aiRibbon;
const listeners = new Set<() => void>();

/** Dev-only: the DialKit panel pushes its values here. */
export function setAiRibbonSettings(settings: AiRibbonSettings) {
  currentSettings = settings;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSettings = () => currentSettings;
const getServerSettings = () => aiRibbon;

type Point = [number, number];

function line([x1, y1]: Point, [x2, y2]: Point, steps: number): Point[] {
  return Array.from({ length: steps }, (_, i) => [
    x1 + ((x2 - x1) * i) / steps,
    y1 + ((y2 - y1) * i) / steps,
  ]);
}

function arc(cx: number, cy: number, r: number, from: number, to: number, steps: number): Point[] {
  return Array.from({ length: steps }, (_, i) => {
    const angle = from + ((to - from) * i) / steps;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
}

/** The resting outline, sampled densely enough to bend smoothly. */
function buildOutline({ height, notch, radius, width }: AiRibbonSettings): Point[] {
  const r = Math.min(radius, width / 2, height - notch);

  return [
    ...line([0, 0], [width, 0], 8),
    ...line([width, 0], [width, height - r], 10),
    ...arc(width - r, height - r, r, 0, Math.PI / 2, 5),
    ...line([width - r, height], [width / 2, height - notch], 14),
    ...line([width / 2, height - notch], [r, height], 14),
    ...arc(r, height - r, r, Math.PI / 2, Math.PI, 5),
    ...line([0, height - r], [0, 0], 10),
  ];
}

// The top edge hangs from the card and stays put; the ripple grows toward the
// free bottom edge, like fabric caught by a light breeze.
function wave(settings: AiRibbonSettings) {
  const { amplitude, falloff, height, period, sway, wavelength, width } = settings;
  const wavenumber = (2 * Math.PI) / (width * wavelength);
  const speed = (2 * Math.PI) / period;
  const phase = (x: number, time: number) => wavenumber * x - speed * time;

  return {
    displace(x: number, y: number, time: number): Point {
      const strength = Math.max(0, y / height) ** falloff;
      return [
        x + sway * strength * Math.sin(speed * 0.45 * time + 1),
        y + amplitude * strength * Math.sin(phase(x, time)),
      ];
    },
    phase,
  };
}

/** "Made with AI" bookmark that hangs from the top of a case card and ripples. */
export function AiRibbon({ label }: { label: string }) {
  const settings = useSyncExternalStore(subscribe, getSettings, getServerSettings);
  const settingsRef = useRef(settings);
  const rootRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<SVGPathElement>(null);
  const shadeRef = useRef<SVGPathElement>(null);
  const stopRefs = useRef<(SVGStopElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ids = useId();
  const fillId = `${ids}-fill`;
  const shadeId = `${ids}-shade`;
  const fadeId = `${ids}-fade`;
  const letters = Array.from(label);
  const {
    colorDeep,
    colorLight,
    colorMid,
    fontSize,
    fontWeight,
    height,
    inset,
    letterSpacing,
    notch,
    textColor,
    textOffset,
    uppercase,
    width,
  } = settings;

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    // Letter centres and the outline are rebuilt only when the size changes, not per frame.
    let letterCenters: number[] = [];
    let geometry = { outline: [] as Point[], settings: null as AiRibbonSettings | null };

    function measure() {
      letterCenters = letterRefs.current.map((letter) =>
        letter ? letter.offsetLeft + letter.offsetWidth / 2 : 0,
      );
    }

    function draw(time: number) {
      const current = settingsRef.current;
      const previous = geometry.settings;

      if (
        !previous ||
        previous.width !== current.width ||
        previous.height !== current.height ||
        previous.notch !== current.notch ||
        previous.radius !== current.radius ||
        previous.fontSize !== current.fontSize ||
        previous.fontWeight !== current.fontWeight ||
        previous.letterSpacing !== current.letterSpacing ||
        previous.textOffset !== current.textOffset ||
        previous.uppercase !== current.uppercase
      ) {
        geometry = { outline: buildOutline(current), settings: current };
        measure();
      }

      const { displace, phase } = wave(current);
      const d =
        geometry.outline
          .map(([x, y], i) => {
            const [px, py] = displace(x, y, time);
            return `${i ? "L" : "M"}${px.toFixed(2)} ${py.toFixed(2)}`;
          })
          .join("") + "Z";

      shapeRef.current?.setAttribute("d", d);
      shadeRef.current?.setAttribute("d", d);

      // Slopes facing up catch light, slopes facing down fall into shade.
      stopRefs.current.forEach((stop, i) => {
        const slope = Math.cos(phase((current.width * i) / (shadeStops - 1), time));
        const strength = slope > 0 ? current.highlight : current.shadow;
        stop?.setAttribute("stop-color", slope > 0 ? "#fff" : "#1b2f8f");
        stop?.setAttribute("stop-opacity", (Math.abs(slope) * strength).toFixed(3));
      });

      const letterY = (current.height - current.notch) / 2 + current.textOffset;
      letterRefs.current.forEach((letter, i) => {
        const x = letterCenters[i] ?? 0;
        const [px, py] = displace(x, letterY, time);
        letter?.style.setProperty(
          "transform",
          `translate(${(px - x).toFixed(2)}px, ${(py - letterY).toFixed(2)}px)`,
        );
      });
    }

    draw(0);
    void document.fonts?.ready.then(() => {
      measure();
      draw(0);
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      draw(reducedMotion ? 0 : (now - start) / 1000);
      // Under reduced motion the ribbon still follows the panel, but holds still.
      frame = reducedMotion ? 0 : requestAnimationFrame(tick);
    };
    const unsubscribe = reducedMotion ? subscribe(() => requestAnimationFrame(tick)) : undefined;

    // Only animate while the card is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);

      if (entry?.isIntersecting && !reducedMotion) {
        frame = requestAnimationFrame(tick);
      }
    });
    observer.observe(root);

    return () => {
      observer.disconnect();
      unsubscribe?.();
      cancelAnimationFrame(frame);
    };
  }, [label]);

  return (
    <div
      aria-hidden="true"
      className={styles.ribbon}
      ref={rootRef}
      style={
        {
          "--ribbon-font-size": `${fontSize}px`,
          "--ribbon-font-weight": fontWeight,
          "--ribbon-height": `${height}px`,
          "--ribbon-inset": `${inset}px`,
          "--ribbon-letter-spacing": `${letterSpacing}em`,
          "--ribbon-notch": `${notch}px`,
          "--ribbon-text-color": textColor,
          "--ribbon-text-offset": `${textOffset}px`,
          "--ribbon-text-transform": uppercase ? "uppercase" : "none",
          "--ribbon-width": `${width}px`,
        } as CSSProperties
      }
    >
      <svg className={styles.shape} height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
        <defs>
          <linearGradient id={fillId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={colorLight} />
            <stop offset="0.55" stopColor={colorMid} />
            <stop offset="1" stopColor={colorDeep} />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id={shadeId} x1="0" x2={width} y1="0" y2="0">
            {Array.from({ length: shadeStops }, (_, i) => (
              <stop
                key={i}
                offset={i / (shadeStops - 1)}
                ref={(stop) => {
                  stopRefs.current[i] = stop;
                }}
              />
            ))}
          </linearGradient>
          <linearGradient id={fadeId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <mask id={`${shadeId}-mask`}>
            <rect fill={`url(#${fadeId})`} height={height * 1.5} width={width * 1.2} x={-width * 0.1} />
          </mask>
        </defs>
        <path fill={`url(#${fillId})`} ref={shapeRef} />
        <path fill={`url(#${shadeId})`} mask={`url(#${shadeId}-mask)`} ref={shadeRef} />
      </svg>
      <span className={styles.label}>
        {letters.map((letter, i) => (
          <span
            className={styles.letter}
            key={i}
            ref={(span) => {
              letterRefs.current[i] = span;
            }}
          >
            {letter === " " ? " " : letter}
          </span>
        ))}
      </span>
    </div>
  );
}
