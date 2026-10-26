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

/** Smooth value noise in -1…1, so the wind never repeats the way a sine does. */
function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const smooth = (t: number) => t * t * (3 - 2 * t);

function noise1(x: number) {
  const i = Math.floor(x);
  const f = smooth(x - i);
  return (hash(i) + (hash(i + 1) - hash(i)) * f) * 2 - 1;
}

function noise2(x: number, y: number) {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = smooth(x - i);
  const fy = smooth(y - j);
  const a = hash(i + j * 57);
  const b = hash(i + 1 + j * 57);
  const c = hash(i + (j + 1) * 57);
  const d = hash(i + 1 + (j + 1) * 57);
  return (a + (b - a) * fx + (c - a + (a - b + d - c) * fx) * fy) * 2 - 1;
}

/** The wind at one moment: shared by every point of the outline and every letter. */
type Wind = { amplitude: number; phase: number; sway: number; time: number; twist: number };

/**
 * Gusts come and go, scaling the ripple and how fast it travels. The phase is
 * accumulated rather than derived from time so a change of speed never jumps.
 */
function blow(settings: AiRibbonSettings, previous: Wind | null, time: number): Wind {
  const { amplitude, gustiness, gustPeriod, period, sway, twist } = settings;
  const gust = 1 + gustiness * noise1(time / gustPeriod + 3.7);
  const step = previous ? Math.min(Math.max(time - previous.time, 0), 0.1) : 0;
  const speed = ((2 * Math.PI) / period) * (0.7 + 0.3 * gust);

  return {
    amplitude: amplitude * gust,
    phase: (previous?.phase ?? 0) + speed * step,
    sway: sway * gust * noise1(time * 0.35 + 11),
    time,
    twist: twist * noise1(time * 0.45 + 23),
  };
}

// The top edge hangs from the card and stays put; the ripple grows toward the
// free bottom edge, like fabric caught by the wind.
function shape(settings: AiRibbonSettings) {
  const { detail, falloff, height, turbulence, wavelength, width } = settings;
  const wavenumber = (2 * Math.PI) / (width * wavelength);
  // Keeps `amplitude` meaning roughly the same whatever the mix.
  const norm = 1 + detail * 0.6 + turbulence * 0.6;
  const centre = width / 2;

  function displace(x: number, y: number, wind: Wind): Point {
    const strength = Math.max(0, y / height) ** falloff;
    const ripple =
      (Math.sin(wavenumber * x - wind.phase) +
        detail * Math.sin(wavenumber * 1.73 * x - wind.phase * 1.41 + 1.3) +
        turbulence * noise2((x / width) * 3, wind.time * 0.9)) /
      norm;
    // The free end turns slightly toward or away from the viewer: it narrows and tilts.
    const angle = wind.twist * strength;

    return [
      centre + (x - centre) * Math.cos(angle) + wind.sway * strength,
      y + wind.amplitude * strength * ripple + (x - centre) * Math.sin(angle) * 0.25,
    ];
  }

  return {
    displace,
    /** How steeply the bottom edge slopes at `x`, scaled to about -1…1. */
    slope(x: number, wind: Wind) {
      const rise = displace(x + 1, height, wind)[1] - displace(x - 1, height, wind)[1];
      return Math.max(-1, Math.min(1, rise / 2 / Math.max(0.01, settings.amplitude * wavenumber)));
    },
  };
}

/** "Made with AI" label on a case card: a waving bookmark or a sash across the corner. */
export function AiRibbon({ label }: { label: string }) {
  const settings = useSyncExternalStore(subscribe, getSettings, getServerSettings);

  return settings.variant === "corner" ? (
    <CornerRibbon label={label} settings={settings} />
  ) : (
    <BookmarkRibbon label={label} settings={settings} />
  );
}

/** Text styles both variants share. */
function labelVars(settings: AiRibbonSettings) {
  const {
    fontSize,
    fontWeight,
    letterSpacing,
    press,
    sheen,
    textBlend,
    textColor,
    textOffset,
    textOpacity,
    uppercase,
  } = settings;

  return {
    "--ribbon-font-size": `${fontSize}px`,
    "--ribbon-font-weight": fontWeight,
    "--ribbon-letter-spacing": `${letterSpacing}em`,
    "--ribbon-press": press,
    "--ribbon-sheen": sheen,
    "--ribbon-text-blend": textBlend,
    "--ribbon-text-color": textColor,
    "--ribbon-text-offset": `${textOffset}px`,
    "--ribbon-text-opacity": textOpacity,
    "--ribbon-text-transform": uppercase ? "uppercase" : "none",
  };
}

/**
 * A sash across the cover's top-left corner, cut off by the card's edges. The
 * band's centre line sits `cornerDistance` from the corner, along the diagonal.
 */
function CornerRibbon({ label, settings }: { label: string; settings: AiRibbonSettings }) {
  const { colorDeep, colorLight, colorMid, cornerDistance, cornerThickness } = settings;
  const centre = cornerDistance / Math.SQRT2;
  // Just large enough to hold the band from one edge to the other.
  const size = Math.ceil(2 * centre + cornerThickness * Math.SQRT2);
  const length = 2 * cornerDistance + 2 * cornerThickness;

  return (
    <div
      aria-hidden="true"
      className={styles.corner}
      style={
        {
          ...labelVars(settings),
          "--ribbon-corner-size": `${size}px`,
        } as CSSProperties
      }
    >
      <span
        className={styles.sash}
        style={{
          background: `linear-gradient(90deg, ${colorLight}, ${colorMid} 55%, ${colorDeep})`,
          height: cornerThickness,
          left: centre - length / 2,
          top: centre - cornerThickness / 2,
          width: length,
        }}
      >
        <span className={styles.sashLabel}>{label}</span>
      </span>
    </div>
  );
}

/** A bookmark that hangs from the top of the cover and ripples in the wind. */
function BookmarkRibbon({ label, settings }: { label: string; settings: AiRibbonSettings }) {
  const settingsRef = useRef(settings);
  const rootRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<SVGPathElement>(null);
  const shadeRef = useRef<SVGPathElement>(null);
  const sheenRef = useRef<SVGPathElement>(null);
  const glossRef = useRef<SVGPathElement>(null);
  const stopRefs = useRef<(SVGStopElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ids = useId();
  const fillId = `${ids}-fill`;
  const shadeId = `${ids}-shade`;
  const fadeId = `${ids}-fade`;
  const sheenId = `${ids}-sheen`;
  const glossId = `${ids}-gloss`;
  const letters = Array.from(label);
  const { colorDeep, colorLight, colorMid, height, inset, notch, sheen, width } = settings;

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
    let wind: Wind | null = null;

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

      const now = blow(current, wind, time);
      wind = now;
      const { displace, slope } = shape(current);
      const d =
        geometry.outline
          .map(([x, y], i) => {
            const [px, py] = displace(x, y, now);
            return `${i ? "L" : "M"}${px.toFixed(2)} ${py.toFixed(2)}`;
          })
          .join("") + "Z";

      for (const path of [shapeRef, shadeRef, sheenRef, glossRef]) {
        path.current?.setAttribute("d", d);
      }

      // Slopes facing up catch light, slopes facing down fall into shade.
      stopRefs.current.forEach((stop, i) => {
        const tilt = slope((current.width * i) / (shadeStops - 1), now);
        const strength = tilt > 0 ? current.highlight : current.shadow;
        stop?.setAttribute("stop-color", tilt > 0 ? "#fff" : "#1b2f8f");
        stop?.setAttribute("stop-opacity", (Math.abs(tilt) * strength).toFixed(3));
      });

      const letterY = (current.height - current.notch) / 2 + current.textOffset;
      letterRefs.current.forEach((letter, i) => {
        const x = letterCenters[i] ?? 0;
        const [px, py] = displace(x, letterY, now);
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
          ...labelVars(settings),
          "--ribbon-height": `${height}px`,
          "--ribbon-inset": `${inset}px`,
          "--ribbon-notch": `${notch}px`,
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
      {/* Light and shade lie over the letters too, so fabric and print share one surface. */}
      <svg className={styles.shape} height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
        <defs>
          <linearGradient id={sheenId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={0.5 * sheen} />
            <stop offset="0.48" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#0a1450" stopOpacity={0.22 * sheen} />
          </linearGradient>
          <linearGradient id={glossId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0.22" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.4" stopColor="#fff" stopOpacity={0.28 * sheen} />
            <stop offset="0.58" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path fill={`url(#${shadeId})`} mask={`url(#${shadeId}-mask)`} ref={shadeRef} />
        <path fill={`url(#${sheenId})`} ref={sheenRef} />
        <path fill={`url(#${glossId})`} ref={glossRef} />
      </svg>
    </div>
  );
}
