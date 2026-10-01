"use client";

import {
  animate,
  m,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { MOBILE_QUERY, useMediaQuery } from "@/lib/media";
import { useEscapeKey, useScrollLock } from "@/lib/modal";
import styles from "./portfolio-case.module.css";

const caseViewTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as const,
};

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

export function CaseCoverModal({
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
  const isMobile = useMediaQuery(MOBILE_QUERY);

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

  const isVisible = phase !== "closed" && coverSize !== null;

  useEscapeKey(isVisible, close);
  useScrollLock(isVisible);

  useEffect(() => {
    if (!isVisible || !coverSize) {
      return;
    }

    const onResize = () => setExpandedWidth(getCaseViewWidth(coverSize));

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [coverSize, isVisible]);

  const expandedScale = coverSize ? expandedWidth / coverSize.width : 1;

  if (isMobile && phase === "closed") {
    return (
      <div className={className} data-debug-frame style={style}>
        {renderMedia(false)}
      </div>
    );
  }

  const trigger = (
    <m.button
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
    </m.button>
  );

  return (
    <>
      {trigger}

      {phase !== "closed" && coverSize
        ? createPortal(
            <>
              <m.div
                aria-hidden="true"
                className={styles.caseImageBackdrop}
                onClick={close}
                style={{ opacity: backdropOpacity }}
              />
              <div className={styles.caseImageModal}>
                <m.div
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
                  <m.div
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
                  </m.div>
                </m.div>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
