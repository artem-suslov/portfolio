"use client";

import { type RefObject, useEffect, useSyncExternalStore } from "react";
import { trackGoal } from "@/lib/analytics";
import type { CaseCover, CoverExperiment } from "./types";

type CoverVariant = "current" | "new";

const storageKey = (experimentId: string, suffix: string) =>
  `portfolio-cover-experiment:${experimentId}:${suffix}`;

function subscribe() {
  return () => {};
}

function getAssignedVariant(experimentId: string): CoverVariant {
  const assignmentKey = storageKey(experimentId, "assignment");
  const storedVariant = window.localStorage.getItem(assignmentKey);

  if (storedVariant === "current" || storedVariant === "new") {
    return storedVariant;
  }

  const nextVariant = Math.random() < 0.5 ? "current" : "new";
  window.localStorage.setItem(assignmentKey, nextVariant);
  return nextVariant;
}

/** Tracks a goal at most once per visitor and variant. */
function trackOnce(experimentId: string, event: string, variant: CoverVariant) {
  const key = storageKey(experimentId, event);

  if (window.localStorage.getItem(key) === variant) {
    return;
  }

  window.localStorage.setItem(key, variant);
  trackGoal(`steamify_cover_${variant}_${event === "impression" ? "viewed" : event}`);
}

/**
 * Splits visitors between the default cover and an experiment cover, and
 * reports impressions (half the cover visible) and opens to Metrika.
 */
export function useCoverExperiment(
  defaultCover: CaseCover,
  experiment: CoverExperiment | undefined,
  cardRef: RefObject<HTMLElement | null>,
) {
  const experimentId = experiment?.id;
  const variant = useSyncExternalStore<CoverVariant>(
    subscribe,
    () => (experimentId ? getAssignedVariant(experimentId) : "current"),
    () => "current",
  );

  useEffect(() => {
    const visual = cardRef.current?.querySelector("[data-debug-frame]");

    if (!experimentId || !visual) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          trackOnce(experimentId, "impression", variant);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(visual);
    return () => observer.disconnect();
  }, [cardRef, experimentId, variant]);

  return {
    cover: experiment && variant === "new" ? experiment.newCover : defaultCover,
    trackOpen() {
      if (experimentId) {
        trackOnce(experimentId, "opened", variant);
      }
    },
  };
}
