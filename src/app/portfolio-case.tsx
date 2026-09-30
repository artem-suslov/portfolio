"use client";

import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import dynamic from "next/dynamic";
import { Pause, Play } from "lucide";
import { MorphIcon } from "morphicons/react";
import { createPortal } from "react-dom";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { InteractiveCardCover } from "@/components/interactive-card-cover";
import { DashboardCasePreview } from "./dashboard-case-preview";
import { useInteractionSound } from "./sound-provider";
import styles from "./page.module.css";

type CaseImageVariant = "steamify" | "steamify-experiment" | "loop" | "ccp" | "safe";

type CaseCover =
  | {
      foreground?: {
        alt: string;
        height: number;
        src: string;
        width: number;
      };
      src: string;
      type: "background";
    }
  | {
      // A bare screen capture placed on the native gray cover surface.
      alt: string;
      height: number;
      src: string | StaticImageData;
      type: "screen";
      width: number;
    }
  | {
      type: "interactive-card";
    }
  | {
      type: "phantom-glow";
    }
  | {
      type: "placeholder";
    }
  | {
      type: "image";
      src: string | StaticImageData;
      alt: string;
      eager?: boolean;
      width: number;
      height: number;
      mobileSrc?: string;
      variant: CaseImageVariant;
      sizes?: string;
      unoptimized?: boolean;
    }
  | {
      mobilePoster?: string;
      mobileSrc?: string;
      poster?: string;
      type: "video";
      src: string;
      variant:
        | "loop"
        | "ccp"
        | "animator"
        | "steamify"
        | "quick-stickers"
        | "freelance-tracker";
    };

interface PortfolioCaseProps {
  accent?: string;
  caseId: string;
  centeredTitle?: boolean;
  cover: CaseCover;
  coverExperiment?: {
    id: string;
    newCover: Extract<CaseCover, { type: "image" }>;
  };
  description?: string;
  details?: {
    company: string;
    companyHref?: string;
    description: string;
    descriptionLink?: {
      href: string;
      label: string;
    };
    period: string;
    role: string;
    showMetadata?: boolean;
    title: string;
  };
  href?: string;
  metadata?: string[];
  metadataLinks?: Array<{
    href: string;
    item: string;
  }>;
  title?: string | false;
  titleLink?: string;
}

const caseImageClassNames: Record<CaseImageVariant, string> = {
  steamify: styles.steamifyCaseImage,
  "steamify-experiment": styles.steamifyExperimentCaseImage,
  loop: styles.loopCaseImage,
  ccp: styles.ccpCaseImage,
  safe: styles.safeCaseImage,
};

declare global {
  interface Window {
    ym?: (counterId: number, method: "reachGoal", goalName: string) => void;
  }
}

const yandexMetricaCounterId = 110413593;
const caseViewSizes = "(max-width: 760px) 92vw, 900px";
const caseViewTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as const,
};

function trackMetricaGoal(goalName: string) {
  window.ym?.(yandexMetricaCounterId, "reachGoal", goalName);
}

function subscribeToCoverExperiment() {
  return () => {};
}

function getCoverExperimentVariant(experimentId?: string): "current" | "new" {
  if (!experimentId || typeof window === "undefined") {
    return "current";
  }

  const assignmentKey = `portfolio-cover-experiment:${experimentId}:assignment`;
  const storedVariant = window.localStorage.getItem(assignmentKey);
  if (storedVariant === "current" || storedVariant === "new") {
    return storedVariant;
  }

  const nextVariant = Math.random() < 0.5 ? "current" : "new";
  window.localStorage.setItem(assignmentKey, nextVariant);
  return nextVariant;
}

const phantomPath =
  "M215.715 1518C448.348 1518 623.175 1315.69 727.504 1155.83C714.817 1191.2 707.769 1226.56 707.769 1260.52C707.769 1353.89 761.343 1420.39 867.089 1420.39C1012.3 1420.39 1167.4 1293.06 1247.76 1155.83C1242.12 1175.64 1239.3 1194.03 1239.3 1211C1239.3 1276.08 1275.96 1317.11 1350.68 1317.11C1586.13 1317.11 1823 899.767 1823 534.766C1823 250.406 1679.19 0 1318.26 0C683.798 0 0 775.271 0 1276.08C0 1472.73 105.742 1518 215.715 1518ZM1099.72 503.642C1099.72 432.906 1139.2 383.391 1197.01 383.391C1253.4 383.391 1292.88 432.906 1292.88 503.642C1292.88 574.379 1253.4 625.308 1197.01 625.308C1139.2 625.308 1099.72 574.379 1099.72 503.642ZM1401.44 503.642C1401.44 432.906 1440.92 383.391 1498.72 383.391C1555.12 383.391 1594.59 432.906 1594.59 503.642C1594.59 574.379 1555.12 625.308 1498.72 625.308C1440.92 625.308 1401.44 574.379 1401.44 503.642Z";

const defaultPhantomCaseSettings = {
  blur: 53,
  brightness: 1.25,
  glowColor: "#614fee",
  isOutlineGlow: true,
  logoColor: "#0b0b0e",
  opacity: 0.92,
  outlineWidth: 2,
  radius: 150,
  saturation: 0.85,
  scale: 0.65,
};

const isDevelopment = process.env.NODE_ENV === "development";

type PhantomCaseSettings = typeof defaultPhantomCaseSettings;

const PhantomCaseDebugControls = isDevelopment
  ? dynamic(
      () =>
        import("./phantom-case-debug-controls").then(
          (module) => module.PhantomCaseDebugControls,
        ),
      { ssr: false },
    )
  : null;

function PhantomGlowCover() {
  const idPrefix = useId().replaceAll(":", "");
  const gradientId = `${idPrefix}-phantom-card-gradient`;
  const animationFrameRef = useRef<number | null>(null);
  const animationStartedAtRef = useRef<number | null>(null);
  const autoPhaseRef = useRef(0);
  const animationStartPhaseRef = useRef(0);
  const [settings, setSettings] = useState<PhantomCaseSettings>(
    defaultPhantomCaseSettings,
  );
  const [glowPosition, setGlowPosition] = useState({ x: 912, y: 759 });
  const [viewBoxScale, setViewBoxScale] = useState(3.5);

  function updateSetting<Key extends keyof PhantomCaseSettings>(
    key: Key,
    value: PhantomCaseSettings[Key],
  ) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  }

  const stopAutoGlow = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    animationStartedAtRef.current = null;
  }, []);

  const startAutoGlow = useCallback(() => {
    if (animationFrameRef.current !== null) {
      return;
    }

    animationStartedAtRef.current = null;
    animationStartPhaseRef.current = autoPhaseRef.current;

    const animateGlow = (timestamp: number) => {
      if (animationStartedAtRef.current === null) {
        animationStartedAtRef.current = timestamp;
      }

      const duration = 5200;
      const progress =
        (animationStartPhaseRef.current +
          ((timestamp - animationStartedAtRef.current) % duration) / duration) %
        1;
      const angle = progress * Math.PI * 2 - Math.PI / 2;

      autoPhaseRef.current = progress;
      setGlowPosition({
        x: Math.round(912 + Math.cos(angle) * 560 + Math.sin(angle * 2) * 80),
        y: Math.round(759 + Math.sin(angle) * 430 - Math.cos(angle * 2) * 90),
      });

      animationFrameRef.current = requestAnimationFrame(animateGlow);
    };

    animationFrameRef.current = requestAnimationFrame(animateGlow);
  }, []);

  function getAutoPhaseFromPosition(x: number, y: number) {
    const angle = Math.atan2((y - 759) / 430, (x - 912) / 560);
    const phase = (angle + Math.PI / 2) / (Math.PI * 2);

    return ((phase % 1) + 1) % 1;
  }

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextPosition = {
      x: Math.round(((event.clientX - rect.left) / rect.width) * 1823),
      y: Math.round(((event.clientY - rect.top) / rect.height) * 1518),
    };

    setViewBoxScale(1823 / rect.width);
    autoPhaseRef.current = getAutoPhaseFromPosition(
      nextPosition.x,
      nextPosition.y,
    );
    setGlowPosition(nextPosition);
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    stopAutoGlow();
    followPointer(event);
  }

  function handlePointerLeave() {
    startAutoGlow();
  }

  useEffect(() => {
    startAutoGlow();

    return () => {
      stopAutoGlow();
    };
  }, [startAutoGlow, stopAutoGlow]);

  const middleStop = Math.min(
    0.86,
    Math.max(0.16, 1 - settings.blur / 72),
  );
  const gradientRadius = settings.radius * viewBoxScale;
  const logoWidth = `min(${72 * settings.scale}%, ${560 * settings.scale}px)`;
  const fill = `url(#${gradientId})`;

  return (
    <>
      <div
        className={styles.phantomCaseTarget}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={followPointer}
        style={{ width: logoWidth }}
      >
        <svg
          aria-hidden="true"
          className={styles.phantomCaseLogo}
          data-debug-media
          fill="none"
          viewBox="0 0 1823 1518"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              cx={glowPosition.x}
              cy={glowPosition.y}
              gradientUnits="userSpaceOnUse"
              id={gradientId}
              r={gradientRadius}
            >
              <stop
                stopColor={settings.glowColor}
                stopOpacity={settings.opacity}
              />
              <stop
                offset={middleStop}
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
            fill={settings.isOutlineGlow ? "none" : fill}
            opacity={1}
            stroke={settings.isOutlineGlow ? fill : undefined}
            strokeLinecap={settings.isOutlineGlow ? "round" : undefined}
            strokeLinejoin={settings.isOutlineGlow ? "round" : undefined}
            strokeWidth={
              settings.isOutlineGlow ? settings.outlineWidth : undefined
            }
            style={{
              filter: `brightness(${settings.brightness}) saturate(${settings.saturation})`,
              vectorEffect: settings.isOutlineGlow
                ? "non-scaling-stroke"
                : undefined,
            }}
          />
        </svg>
      </div>

      <span className={styles.phantomCaseHint}>Hover on logo</span>

      {PhantomCaseDebugControls ? (
        <PhantomCaseDebugControls
          onUpdateSetting={updateSetting}
          settings={settings}
        />
      ) : null}
    </>
  );
}

function AutoPlayCaseVideo({
  className,
  mobilePoster,
  mobileSrc,
  poster,
  src,
  videoRef,
}: {
  className: string;
  mobilePoster?: string;
  mobileSrc?: string;
  poster?: string;
  src: string;
  videoRef?: RefObject<HTMLVideoElement | null>;
}) {
  // The first frame is painted as a background image so the mobile source can
  // carry its own poster through a media query; `poster` takes a single value.
  const posterStyle = {
    ...(poster ? { "--case-poster": `url(${poster})` } : {}),
    ...(mobilePoster ? { "--case-poster-mobile": `url(${mobilePoster})` } : {}),
  } as CSSProperties;

  return (
    <video
      aria-hidden="true"
      autoPlay
      className={className}
      data-debug-media
      loop
      muted
      playsInline
      preload="metadata"
      ref={videoRef}
      style={posterStyle}
      {...(mobileSrc ? {} : { src })}
    >
      {mobileSrc ? (
        <>
          <source media="(max-width: 760px)" src={mobileSrc} />
          <source src={src} />
        </>
      ) : null}
    </video>
  );
}

type CaseCoverSize = {
  height: number;
  width: number;
};

type CaseCoverModalPhase = "closed" | "open" | "closing";

const caseViewMaxWidth = 900;
const caseViewRadius = 12;

function getCaseViewWidth(cover: CaseCoverSize) {
  const ratio = cover.width / cover.height;

  return Math.min(
    caseViewMaxWidth,
    document.documentElement.clientWidth * 0.92,
    window.innerHeight * 0.9 * ratio,
  );
}

// Expanded views show original files. Decoding a large original mid-animation
// janks the first open, so fetch and decode it ahead of time and keep the
// decoded element referenced for reuse.
const decodedCaseImages = new Map<string, Promise<void>>();

function preloadCaseImage(src: string) {
  let decoded = decodedCaseImages.get(src);

  if (!decoded) {
    const image = new window.Image();
    image.decoding = "async";
    image.src = src;
    decoded = image.decode().catch(() => undefined).then(() => void image);
    decodedCaseImages.set(src, decoded);
  }

  return decoded;
}

const caseViewMobileQuery = "(max-width: 760px)";

function subscribeToCaseViewMobile(onChange: () => void) {
  const query = window.matchMedia(caseViewMobileQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function StaticCaseCoverModal({
  caseId,
  className,
  expandedSrc,
  label,
  renderMedia,
  style,
}: {
  caseId: string;
  className: string;
  expandedSrc?: string;
  label: string;
  renderMedia: (isExpanded: boolean) => ReactNode;
  style?: CSSProperties;
}) {
  const { playTap } = useInteractionSound();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<CaseCoverModalPhase>("closed");
  const [coverSize, setCoverSize] = useState<CaseCoverSize | null>(null);
  const [expandedWidth, setExpandedWidth] = useState(0);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const rotateZ = useTransform(dragX, [-300, 300], [-2.5, 2.5]);
  const rotateX = useTransform(dragY, [-300, 300], [2.5, -2.5]);
  const contentX = useMotionValue(0);
  const contentY = useMotionValue(0);
  const contentScale = useMotionValue(1);
  const contentRadius = useMotionValue(caseViewRadius);
  const contentOpacity = useMotionValue(1);
  const backdropOpacity = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  // On phones the cover already spans the screen, so it stays a static image.
  const isMobile = useSyncExternalStore(
    subscribeToCaseViewMobile,
    () => window.matchMedia(caseViewMobileQuery).matches,
    () => false,
  );

  // Offset and scale that place the expanded view exactly over the thumbnail,
  // measured without the drag offset so both can settle back together.
  const getThumbnailPose = useCallback(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;

    if (!trigger || !content) {
      return null;
    }

    const from = trigger.getBoundingClientRect();
    const to = content.getBoundingClientRect();
    const scale = trigger.offsetWidth / content.offsetWidth;

    return {
      radius: caseViewRadius / scale,
      scale,
      x: from.left + from.width / 2 - (to.left + to.width / 2 - contentX.get() - dragX.get()),
      y: from.top + from.height / 2 - (to.top + to.height / 2 - contentY.get() - dragY.get()),
    };
  }, [contentX, contentY, dragX, dragY]);

  const isOpeningRef = useRef(false);

  useEffect(() => {
    const trigger = triggerRef.current;

    if (!expandedSrc || !trigger) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        void preloadCaseImage(expandedSrc);
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [expandedSrc]);

  async function open() {
    const trigger = triggerRef.current;

    if (!trigger || phase !== "closed" || isOpeningRef.current) {
      return;
    }

    isOpeningRef.current = true;
    playTap();

    if (expandedSrc) {
      // Start the transition only once the original can paint without a
      // decode hitch, but never keep the click waiting for long.
      await Promise.race([
        preloadCaseImage(expandedSrc),
        new Promise((resolve) => window.setTimeout(resolve, 400)),
      ]);
    }

    isOpeningRef.current = false;
    const size = { height: trigger.offsetHeight, width: trigger.offsetWidth };
    dragX.set(0);
    dragY.set(0);
    setCoverSize(size);
    setExpandedWidth(getCaseViewWidth(size));
    setPhase("open");
  }

  const close = useCallback(() => {
    if (phase !== "open") {
      return;
    }

    playTap();
    setPhase("closing");

    const pose = prefersReducedMotion ? null : getThumbnailPose();
    const finish = () => setPhase("closed");

    animate(backdropOpacity, 0, { duration: 0.24, ease: "easeOut" });

    if (!pose) {
      void animate(contentOpacity, 0, { duration: 0.18, ease: "easeOut" }).then(finish);
      return;
    }

    // Wait for every value: one that is already at its target (e.g. x for a
    // centered card) resolves immediately and would cut the return short.
    void Promise.all([
      animate(dragX, 0, caseViewTransition),
      animate(dragY, 0, caseViewTransition),
      animate(contentScale, pose.scale, caseViewTransition),
      animate(contentRadius, pose.radius, caseViewTransition),
      animate(contentY, pose.y, caseViewTransition),
      animate(contentX, pose.x, caseViewTransition),
    ]).then(finish);
  }, [
    backdropOpacity,
    contentOpacity,
    contentRadius,
    contentScale,
    contentX,
    contentY,
    dragX,
    dragY,
    getThumbnailPose,
    phase,
    playTap,
    prefersReducedMotion,
  ]);

  useLayoutEffect(() => {
    if (phase !== "open" || !coverSize) {
      return;
    }

    const pose = prefersReducedMotion ? null : getThumbnailPose();

    backdropOpacity.set(0);
    animate(backdropOpacity, 1, { duration: 0.2, ease: "easeOut" });

    if (!pose) {
      contentOpacity.set(0);
      animate(contentOpacity, 1, { duration: 0.18, ease: "easeOut" });
      return;
    }

    contentOpacity.set(1);
    contentX.set(pose.x);
    contentY.set(pose.y);
    contentScale.set(pose.scale);
    contentRadius.set(pose.radius);
    animate(contentX, 0, caseViewTransition);
    animate(contentY, 0, caseViewTransition);
    animate(contentScale, 1, caseViewTransition);
    animate(contentRadius, caseViewRadius, caseViewTransition);
    // Only the transition into the open phase should run the entrance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase === "closed" || !coverSize) {
      return;
    }

    // Scroll is owned by <html> (see globals.css), so lock it there.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    const onResize = () => setExpandedWidth(getCaseViewWidth(coverSize));

    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [close, coverSize, phase]);

  const expandedScale = coverSize ? expandedWidth / coverSize.width : 1;

  if (isMobile && phase === "closed") {
    return (
      <div className={className} data-debug-frame style={style}>
        {renderMedia(false)}
      </div>
    );
  }

  const trigger = (
    <motion.button
      aria-label={`Open ${label}`}
      className={className}
      data-debug-frame
      onClick={() => void open()}
      onFocus={expandedSrc ? () => void preloadCaseImage(expandedSrc) : undefined}
      onPointerEnter={expandedSrc ? () => void preloadCaseImage(expandedSrc) : undefined}
      ref={triggerRef}
      style={{ ...style, visibility: phase === "closed" ? undefined : "hidden" }}
      transition={caseViewTransition}
      type="button"
      whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
    >
      {renderMedia(false)}
    </motion.button>
  );

  return (
    <>
      {trigger}

      {phase !== "closed" && coverSize
        ? createPortal(
            <>
              <motion.div
                className={styles.caseImageBackdrop}
                onClick={close}
                style={{ opacity: backdropOpacity }}
              />
              <div className={styles.caseImageModal}>
                <motion.div
                  className={styles.caseImageModalDragTarget}
                  drag={phase === "open" && !prefersReducedMotion}
                  dragConstraints={{ bottom: 90, left: -90, right: 90, top: -90 }}
                  dragElastic={0.22}
                  onDragEnd={(_, info) => {
                    const shouldClose =
                      Math.abs(info.offset.x) > 140 ||
                      Math.abs(info.offset.y) > 140 ||
                      Math.abs(info.velocity.x) > 650 ||
                      Math.abs(info.velocity.y) > 650;

                    if (shouldClose) {
                      close();
                      return;
                    }

                    animate(dragX, 0, caseViewTransition);
                    animate(dragY, 0, caseViewTransition);
                  }}
                  style={{ x: dragX, y: dragY, rotateX, rotateZ }}
                  whileDrag={{ scale: 1.01 }}
                >
                  <motion.div
                    aria-label={label}
                    aria-modal="true"
                    className={styles.caseImageModalContent}
                    ref={contentRef}
                    role="dialog"
                    style={{
                      borderRadius: contentRadius,
                      height: expandedWidth * (coverSize.height / coverSize.width),
                      opacity: contentOpacity,
                      scale: contentScale,
                      width: expandedWidth,
                      x: contentX,
                      y: contentY,
                    }}
                  >
                    {/* Re-create the card context so per-case cover styles still apply. */}
                    <div
                      className={styles.case}
                      data-case-id={caseId}
                      style={{
                        transform: `scale(${expandedScale})`,
                        transformOrigin: "0 0",
                        width: coverSize.width,
                      }}
                    >
                      <div
                        className={className}
                        style={{ ...style, height: coverSize.height, width: coverSize.width }}
                      >
                        {renderMedia(true)}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}

export function PortfolioCase({
  accent,
  caseId,
  centeredTitle = false,
  cover: defaultCover,
  coverExperiment,
  description,
  details,
  href,
  metadata,
  metadataLinks,
  title = false,
  titleLink,
}: PortfolioCaseProps) {
  const { playTap } = useInteractionSound();
  const cardRef = useRef<HTMLElement>(null);
  const caseVideoRef = useRef<HTMLVideoElement>(null);
  const [isCaseVideoPaused, setIsCaseVideoPaused] = useState(false);
  const experimentId = coverExperiment?.id;
  const coverVariant = useSyncExternalStore(
    subscribeToCoverExperiment,
    () => getCoverExperimentVariant(experimentId),
    () => "current",
  );
  const cover = coverExperiment && coverVariant === "new" ? coverExperiment.newCover : defaultCover;

  useEffect(() => {
    if (!experimentId) {
      return;
    }

    const visual = cardRef.current?.querySelector<HTMLElement>("[data-debug-frame]");
    if (!visual) {
      return;
    }

    const impressionKey = `portfolio-cover-experiment:${experimentId}:impression`;
    if (window.localStorage.getItem(impressionKey) === coverVariant) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
          return;
        }

        window.localStorage.setItem(impressionKey, coverVariant);
        trackMetricaGoal(`steamify_cover_${coverVariant}_viewed`);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(visual);
    return () => observer.disconnect();
  }, [coverVariant, experimentId]);

  function trackExperimentOpen() {
    if (!experimentId) {
      return;
    }

    const openKey = `portfolio-cover-experiment:${experimentId}:opened`;
    if (window.localStorage.getItem(openKey) === coverVariant) {
      return;
    }

    window.localStorage.setItem(openKey, coverVariant);
    trackMetricaGoal(`steamify_cover_${coverVariant}_opened`);
  }
  const hasVideoControl =
    [
      "steamify-case",
      "s7-case",
      "telegram-quick-stickers",
      "animator",
      "freelance-tracker",
    ].includes(caseId) &&
    cover.type === "video";

  function toggleCaseVideo() {
    const video = caseVideoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      void video
        .play()
        .then(() => {
          setIsCaseVideoPaused(false);
          playTap();
        })
        .catch(() => {
          setIsCaseVideoPaused(true);
        });
      return;
    }

    video.pause();
    setIsCaseVideoPaused(true);
    playTap();
  }

  return (
    <article className={styles.case} data-case-id={caseId} ref={cardRef}>
      {cover.type === "background" ? (
        (() => {
          const visualClassName = `${styles.caseVisual} ${styles.backgroundCaseVisual}`;
          const visualStyle = { backgroundImage: `url("${cover.src}")` };
          const renderMedia = (isExpanded: boolean) =>
            cover.foreground ? (
              <Image
                alt={cover.foreground.alt}
                className={styles.backgroundCaseImage}
                data-debug-media
                height={cover.foreground.height}
                sizes={isExpanded ? caseViewSizes : undefined}
                src={cover.foreground.src}
                loading={isExpanded ? "eager" : undefined}
                unoptimized={isExpanded}
                width={cover.foreground.width}
              />
            ) : null;

          return href ? (
            <div className={visualClassName} data-debug-frame style={visualStyle}>
              {renderMedia(false)}
            </div>
          ) : (
            <StaticCaseCoverModal
              caseId={caseId}
              className={visualClassName}
              expandedSrc={cover.foreground?.src}
              label={title || "case image"}
              renderMedia={renderMedia}
              style={visualStyle}
            />
          );
        })()
      ) : cover.type === "screen" ? (
        (() => {
          const visualClassName = `${styles.caseVisual} ${styles.screenCaseVisual}`;
          const renderMedia = (isExpanded: boolean) => (
            <Image
              alt={cover.alt}
              className={styles.screenCaseImage}
              data-debug-media
              height={cover.height}
              sizes={isExpanded ? caseViewSizes : "(max-width: 760px) 90vw, 520px"}
              src={cover.src}
              loading={isExpanded ? "eager" : undefined}
              unoptimized={isExpanded}
              width={cover.width}
            />
          );

          return href ? (
            <div className={visualClassName} data-debug-frame>
              {renderMedia(false)}
            </div>
          ) : (
            <StaticCaseCoverModal
              caseId={caseId}
              className={visualClassName}
              expandedSrc={typeof cover.src === "string" ? cover.src : cover.src.src}
              label={title || "case image"}
              renderMedia={renderMedia}
            />
          );
        })()
      ) : cover.type === "interactive-card" ? (
        <div
          className={`${styles.caseVisual} ${styles.interactiveCaseVisual}`}
          data-debug-frame
        >
          <div className={styles.interactiveCaseMedia} data-debug-media>
            <InteractiveCardCover />
          </div>
        </div>
      ) : cover.type === "phantom-glow" ? (
        <div
          className={`${styles.caseVisual} ${styles.phantomCaseVisual}`}
          data-debug-frame
        >
          <PhantomGlowCover />
        </div>
      ) : cover.type === "placeholder" ? (
        <div
          aria-label="Case visual coming soon"
          className={`${styles.caseVisual} ${styles.placeholderCaseVisual}`}
          data-debug-frame
          role="img"
        />
      ) : cover.type === "video" ? (
        (() => {
          const videoClassName = `${styles.caseVideo} ${
            cover.variant === "loop"
              ? styles.loopCaseVideo
              : cover.variant === "animator"
                ? styles.animatorCaseVideo
                : cover.variant === "steamify"
                  ? styles.steamifyCaseVideo
                  : cover.variant === "quick-stickers"
                    ? styles.quickStickersCaseVideo
                    : cover.variant === "freelance-tracker"
                      ? styles.freelanceTrackerCaseVideo
                      : styles.ccpCaseVideo
          }`;
          return (
            <div className={styles.caseVisual} data-debug-frame>
              <AutoPlayCaseVideo
                className={videoClassName}
                mobilePoster={cover.mobilePoster}
                mobileSrc={cover.mobileSrc}
                poster={cover.poster}
                src={cover.src}
                videoRef={hasVideoControl ? caseVideoRef : undefined}
              />
              {hasVideoControl ? (
                <button
                  aria-label={
                    isCaseVideoPaused ? "Play case video" : "Pause case video"
                  }
                  className={styles.caseVideoControl}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleCaseVideo();
                  }}
                  type="button"
                >
                  <MorphIcon
                    aria-hidden="true"
                    icon={isCaseVideoPaused ? Play : Pause}
                    size={16}
                    strokeWidth={1.75}
                    viewBox="0 0 24 24"
                  />
                </button>
              ) : null}
            </div>
          );
        })()
      ) : (
        (() => {
          const visualClassName = `${styles.caseVisual} ${
            cover.variant === "steamify"
              ? styles.steamifyCaseVisual
              : cover.variant === "steamify-experiment"
                ? styles.steamifyExperimentCaseVisual
              : ""
          } ${cover.variant === "loop" ? styles.loopCaseVisual : ""} ${
            cover.variant === "ccp" ? styles.ccpCaseVisual : ""
          } ${
            cover.variant === "ccp" || cover.variant === "safe"
              ? styles.caseVisualFlushBottom
              : ""
          }`;
          const renderMedia = (isExpanded: boolean) => {
            const imageSizes = isExpanded
              ? caseViewSizes
              : (cover.sizes ?? "(max-width: 760px) 100vw, 700px");

            if (cover.variant === "loop") {
              return (
                <DashboardCasePreview
                  alt={cover.alt}
                  sizes={
                    isExpanded
                      ? caseViewSizes
                      : (cover.sizes ??
                        "(max-width: 760px) calc(100vw - 40px), 512px")
                  }
                  src={cover.src}
                />
              );
            }

            const image = (
              <Image
                alt={cover.alt}
                className={`${styles.caseImage} ${caseImageClassNames[cover.variant]}`}
                data-debug-media
                height={cover.height}
                preload={cover.eager && !isExpanded ? true : undefined}
                sizes={imageSizes}
                src={cover.src}
                // The expanded view shows the original file, not a recompressed variant.
                loading={isExpanded ? "eager" : undefined}
                unoptimized={isExpanded || cover.unoptimized}
                width={cover.width}
              />
            );

            return cover.mobileSrc ? (
              <picture className={styles.steamifyExperimentPicture}>
                <source media="(max-width: 760px)" srcSet={cover.mobileSrc} />
                {image}
              </picture>
            ) : (
              image
            );
          };

          return href ? (
            <div className={visualClassName} data-debug-frame>
              {renderMedia(false)}
            </div>
          ) : (
            <StaticCaseCoverModal
              caseId={caseId}
              className={visualClassName}
              expandedSrc={
                cover.variant === "loop" || cover.mobileSrc
                  ? undefined
                  : typeof cover.src === "string"
                    ? cover.src
                    : cover.src.src
              }
              label={title || "case image"}
              renderMedia={renderMedia}
            />
          );
        })()
      )}

      {details ? (
        <section className={styles.caseDetails}>
          <h3>{details.title}</h3>
          <p>
            {details.description}{" "}
            {details.descriptionLink ? (
              <a
                className={styles.v2InlineLink}
                href={details.descriptionLink.href}
                onClick={playTap}
                rel="noreferrer"
                target="_blank"
              >
                {details.descriptionLink.label}
              </a>
            ) : null}
          </p>
          {details.showMetadata !== false ? (
            <dl>
              <div>
                <dt>Company</dt>
                <dd>
                  {details.companyHref ? (
                    <a
                      className={`${styles.v2InlineLink} ${styles.caseDetailsLink}`}
                      href={details.companyHref}
                      onClick={playTap}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {details.company}
                    </a>
                  ) : (
                    details.company
                  )}
                </dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{details.role}</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>{details.period}</dd>
              </div>
            </dl>
          ) : null}
        </section>
      ) : title ? (
        <div className={styles.caseCaption}>
          <span
            className={
              centeredTitle ? styles.secondCaseTitle : styles.caseTitle
            }
          >
            {titleLink ? (
              <a
                className={styles.v2InlineLink}
                href={titleLink}
                onClick={playTap}
                rel="noreferrer"
                target="_blank"
              >
                {title}
              </a>
            ) : (
              title
            )}
            {accent ? (
              <>
                {" "}
                <span className={styles.caseMetric}>
                  {accent}
                  <Image
                    aria-hidden="true"
                    alt=""
                    className={styles.caseMetricUnderline}
                    height={6}
                    src="/svg/underline_small.webp"
                    unoptimized
                    width={87}
                  />
                </span>
              </>
            ) : null}
          </span>

          {metadata?.length ? (
            <span className={styles.caseMetadata}>
              {metadata.map((item, index) => {
                const metadataLink = metadataLinks?.find(
                  (link) => link.item === item,
                );

                return (
                  <Fragment key={item}>
                    {index > 0 ? <span aria-hidden="true">•</span> : null}
                    {metadataLink ? (
                      <a
                        className={`${styles.v2InlineLink} ${styles.caseMetadataLink}`}
                        href={metadataLink.href}
                        onClick={playTap}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {item}
                      </a>
                    ) : (
                      <span>{item}</span>
                    )}
                  </Fragment>
                );
              })}
            </span>
          ) : null}
          {description ? (
            <p className={styles.caseShortDescription}>{description}</p>
          ) : null}
        </div>
      ) : null}

      {href && title ? (
        <Link
          aria-label={title}
          className={styles.caseLinkOverlay}
          href={href}
          onClick={() => {
            trackExperimentOpen();
            playTap();
          }}
        />
      ) : null}
    </article>
  );
}
