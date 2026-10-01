"use client";

import {
  type CSSProperties,
  type MouseEvent,
  type TransitionEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { PAPER_INTRO_FINISHED_EVENT } from "@/lib/events";
import { FINE_HOVER_QUERY, matchesMedia, REDUCED_MOTION_QUERY } from "@/lib/media";
import styles from "./hero-video.module.css";

type ReactionPhase = "idle" | "waiting" | "playing" | "holding" | "fading";

const MAX_SYNC_WAIT_MS = 100;
const REACTION_HOLD_TIME = 3;
// Base-loop time ranges whose frames line up with the first reaction frame.
const MATCHING_BASE_WINDOWS = [
  [0, 0.8],
  [2.47, 3.33],
] as const;

function isMatchingBaseFrame(currentTime: number) {
  return MATCHING_BASE_WINDOWS.some(
    ([start, end]) => currentTime >= start && currentTime <= end,
  );
}

/** A "Say Hi" pill that follows the mouse inside the hovered element. */
function useCursorLabel() {
  const [cursorLabel, setCursorLabel] = useState({
    isVisible: false,
    x: 0,
    y: 0,
  });

  function show(event: MouseEvent<HTMLElement>) {
    if (!matchesMedia(FINE_HOVER_QUERY)) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    setCursorLabel({
      isVisible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  function hide() {
    setCursorLabel((currentLabel) => ({ ...currentLabel, isVisible: false }));
  }

  return { cursorLabel, hide, show };
}

export function HeroVideo({ compact = false }: { compact?: boolean }) {
  const baseVideoRef = useRef<HTMLVideoElement>(null);
  const reactionVideoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hoveredRef = useRef(false);
  const hasHeldRef = useRef(false);
  const isIntroductionRef = useRef(false);
  const phaseRef = useRef<ReactionPhase>("idle");
  const [phase, setPhase] = useState<ReactionPhase>("idle");
  const { cursorLabel, hide: hideCursorLabel, show: showCursorLabel } =
    useCursorLabel();

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  function updatePhase(nextPhase: ReactionPhase) {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }

  function finishReaction() {
    const reactionVideo = reactionVideoRef.current;

    if (reactionVideo) {
      reactionVideo.pause();
      reactionVideo.currentTime = 0;
    }

    hasHeldRef.current = false;
    isIntroductionRef.current = false;
    updatePhase("idle");
  }

  function playReaction() {
    const reactionVideo = reactionVideoRef.current;

    if (!reactionVideo || phaseRef.current !== "waiting") {
      return;
    }

    reactionVideo.pause();
    reactionVideo.currentTime = 0;
    hasHeldRef.current = false;
    updatePhase("playing");

    void reactionVideo.play().catch(finishReaction);
  }

  function waitForMatchingFrame(startedAt: number) {
    const baseVideo = baseVideoRef.current;

    if (!baseVideo || phaseRef.current !== "waiting") {
      return;
    }

    const reachedMatchingFrame =
      baseVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
      isMatchingBaseFrame(baseVideo.currentTime);
    const reachedWaitLimit =
      window.performance.now() - startedAt >= MAX_SYNC_WAIT_MS;

    if (reachedMatchingFrame || reachedWaitLimit) {
      playReaction();
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(() => {
      waitForMatchingFrame(startedAt);
    });
  }

  function handleMouseEnter(event: MouseEvent<HTMLDivElement>) {
    hoveredRef.current = true;
    showCursorLabel(event);

    if (
      phaseRef.current !== "idle" ||
      !matchesMedia(FINE_HOVER_QUERY) ||
      matchesMedia(REDUCED_MOTION_QUERY)
    ) {
      return;
    }

    updatePhase("waiting");
    waitForMatchingFrame(window.performance.now());
  }

  function handleMouseLeave() {
    hoveredRef.current = false;
    hideCursorLabel();

    if (phaseRef.current !== "holding") {
      return;
    }

    const reactionVideo = reactionVideoRef.current;

    if (!reactionVideo) {
      finishReaction();
      return;
    }

    updatePhase("playing");
    void reactionVideo.play().catch(finishReaction);
  }

  function handleReactionTimeUpdate() {
    const reactionVideo = reactionVideoRef.current;

    if (
      !reactionVideo ||
      phaseRef.current !== "playing" ||
      isIntroductionRef.current ||
      !hoveredRef.current ||
      hasHeldRef.current ||
      reactionVideo.currentTime < REACTION_HOLD_TIME
    ) {
      return;
    }

    hasHeldRef.current = true;
    reactionVideo.pause();
    updatePhase("holding");
  }

  function handleReactionEnded() {
    if (phaseRef.current === "playing") {
      updatePhase("fading");
    }
  }

  function handleReactionTransitionEnd(
    event: TransitionEvent<HTMLVideoElement>,
  ) {
    if (event.propertyName === "opacity" && phaseRef.current === "fading") {
      finishReaction();
    }
  }

  useEffect(() => {
    if (matchesMedia(REDUCED_MOTION_QUERY)) {
      return;
    }

    let introductionTimer: number | undefined;
    const startIntroduction = () => {
      introductionTimer = window.setTimeout(() => {
        isIntroductionRef.current = true;
        updatePhase("waiting");
        waitForMatchingFrame(window.performance.now());
      }, 0);
    };

    if (document.documentElement.dataset.paperIntro === "playing") {
      window.addEventListener(PAPER_INTRO_FINISHED_EVENT, startIntroduction, {
        once: true,
      });
    } else {
      startIntroduction();
    }

    return () => {
      window.clearTimeout(introductionTimer);
      window.removeEventListener(PAPER_INTRO_FINISHED_EVENT, startIntroduction);
    };

    // The introduction should run once when this mounted hero is hydrated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      data-reaction-phase={phase}
      className={compact ? `${styles.shell} ${styles.compact}` : styles.shell}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={showCursorLabel}
    >
      <div className={styles.video} data-reaction-phase={phase}>
        <video
          ref={baseVideoRef}
          aria-hidden="true"
          autoPlay
          className={styles.layer}
          loop
          muted
          playsInline
          poster="/videos/base-loop-poster.webp?v=20260706-fast"
          preload="auto"
          src="/videos/base-loop-short.mp4?v=20260903-fs"
        />

        <video
          ref={reactionVideoRef}
          aria-hidden="true"
          className={`${styles.layer} ${styles.reaction}`}
          muted
          onEnded={handleReactionEnded}
          onTimeUpdate={handleReactionTimeUpdate}
          onTransitionEnd={handleReactionTransitionEnd}
          playsInline
          preload="auto"
        >
          <source src="/videos/reaction.mp4?v=20260903-fs" type="video/mp4" />
        </video>
      </div>

      <span
        aria-hidden="true"
        className={styles.cursorLabel}
        data-visible={cursorLabel.isVisible}
        style={
          {
            "--hero-cursor-label-x": `${cursorLabel.x}px`,
            "--hero-cursor-label-y": `${cursorLabel.y}px`,
          } as CSSProperties
        }
      >
        Say Hi
      </span>
    </div>
  );
}
