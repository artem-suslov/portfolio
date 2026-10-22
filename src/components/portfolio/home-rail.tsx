"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { RailNav, type CaseRailSection } from "@/components/case-study/case-rail";
import styles from "./portfolio-page.module.css";

/**
 * The craft grid is wider than the card and can pass under elements pinned in the
 * gutters; reports whether it currently overlaps the given one.
 */
export function useCraftGridCover(ref: RefObject<HTMLElement | null>) {
  const [isCovered, setIsCovered] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const rail = ref.current?.getBoundingClientRect();
      const grid = document.querySelector("[data-craft-grid]")?.getBoundingClientRect();
      if (!rail || !grid || rail.width === 0) return;
      setIsCovered(
        grid.left < rail.right &&
          grid.right > rail.left &&
          grid.top < rail.bottom &&
          grid.bottom > rail.top,
      );
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);

  return isCovered;
}

/**
 * The case-study table of contents, pinned in the left gutter of the home page.
 * It steps aside while the craft grid passes under it.
 */
export function HomeRail({ sections }: { sections: readonly CaseRailSection[] }) {
  const railRef = useRef<HTMLElement>(null);
  const isCovered = useCraftGridCover(railRef);

  return (
    <aside
      ref={railRef}
      className={styles.rail}
      aria-label="Page navigation"
      data-covered={isCovered || undefined}
    >
      <RailNav sections={sections} />
    </aside>
  );
}
