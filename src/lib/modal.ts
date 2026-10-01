"use client";

import { useEffect, useEffectEvent } from "react";

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
