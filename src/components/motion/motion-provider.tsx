"use client";

import { LazyMotion } from "framer-motion";
import { useSyncExternalStore, type ReactNode } from "react";

let featuresLoaded = false;
const listeners = new Set<() => void>();

const loadFeatures = () =>
  import("./motion-features").then((module) => {
    // Announce only after LazyMotion has registered the features (it continues this same
    // promise), or `m.*` mounted on the announcement would start without them.
    setTimeout(() => {
      featuresLoaded = true;
      listeners.forEach((listener) => listener());
    });
    return module.default;
  });

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** False until the lazy features arrive. Before that, `m.*` renders its `initial` values but
    can't animate them, so anything mounted with a hidden `initial` would stay hidden. */
export function useMotionFeaturesLoaded() {
  return useSyncExternalStore(subscribe, () => featuresLoaded, () => false);
}

/** Use `m.*` components below this provider; the animation features load on demand. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
