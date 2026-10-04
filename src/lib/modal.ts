"use client";

import {
  type TransitionEvent,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

/** Calls `onEscape` when Escape is pressed while `isActive` is true. */
export function useEscapeKey(isActive: boolean, onEscape: () => void) {
  const handleEscape = useEffectEvent(onEscape);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);
}

/** Locks page scrolling while `isActive` is true. */
export function useScrollLock(isActive: boolean) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    // Scroll is owned by <html> (see globals.css), so lock it there.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isActive]);
}

export type ModalPhase = "closed" | "opening" | "open" | "closing";

function getCloseDuration() {
  return (
    Number.parseFloat(
      window.getComputedStyle(document.documentElement).getPropertyValue("--modal-close-dur"),
    ) || 150
  );
}

/**
 * Drives the enter/exit phases of an animated overlay from a plain `isOpen` flag.
 * The overlay stays mounted while `phase !== "closed"`; pass `handleTransitionEnd` to the
 * animated element so the exit finishes on its opacity transition (a timer is the fallback).
 *
 * The phase is derived from `isOpen` and the last settled state, so a late frame or timer can
 * only ever move it forward: reopening mid-exit runs straight back to "open".
 */
export function useModalPhase(isOpen: boolean, { onClosed }: { onClosed?: () => void } = {}) {
  const [isSettledOpen, setIsSettledOpen] = useState(false);
  const phase: ModalPhase = isOpen
    ? isSettledOpen
      ? "open"
      : "opening"
    : isSettledOpen
      ? "closing"
      : "closed";
  const handleClosed = useEffectEvent(() => onClosed?.());

  // One frame in the "opening" pose lets the open transition run from it.
  useEffect(() => {
    if (phase !== "opening") {
      return;
    }

    const frame = window.requestAnimationFrame(() => setIsSettledOpen(true));
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "closing") {
      return;
    }

    const timer = window.setTimeout(() => setIsSettledOpen(false), getCloseDuration() + 50);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const previousPhaseRef = useRef(phase);
  useEffect(() => {
    if (phase === "closed" && previousPhaseRef.current !== "closed") {
      handleClosed();
    }
    previousPhaseRef.current = phase;
  }, [phase]);

  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLElement>) => {
      if (
        phase === "closing" &&
        event.currentTarget === event.target &&
        event.propertyName === "opacity"
      ) {
        setIsSettledOpen(false);
      }
    },
    [phase],
  );

  return { handleTransitionEnd, isMounted: phase !== "closed", phase };
}
