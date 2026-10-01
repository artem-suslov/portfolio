"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Keep in sync with the `max-width: 760px` breakpoint used across the CSS modules. */
export const MOBILE_QUERY = "(max-width: 760px)";
export const FINE_HOVER_QUERY = "(hover: hover) and (pointer: fine)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function matchesMedia(query: string) {
  return window.matchMedia(query).matches;
}

/** True when the pointer event comes from a real mouse on a hover-capable device. */
export function isMouseHover(event: { pointerType: string }) {
  return event.pointerType === "mouse" && matchesMedia(FINE_HOVER_QUERY);
}

export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => matchesMedia(query),
    () => serverValue,
  );
}
