"use client";

import NumberFlow from "@number-flow/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { PAPER_INTRO_FINISHED_EVENT } from "@/lib/events";
import { useCraftGridCover } from "./home-rail";
import styles from "./visitor-count.module.css";

// A chart glyph, not data: fixed heights the bars grow to.
const BAR_LEVELS = [0.55, 1, 0.75];

/**
 * Visitor count pinned in the right gutter, mirroring the section rail on the left;
 * on phones, where there is no gutter, the hero places it beside the video. The digits roll up from zero once the page is in view (after the paper intro, if
 * it plays). The bars beside them grow in with the digits, then keep gently breathing.
 */
export function VisitorCount({
  total,
  placement = "gutter",
}: {
  total: number;
  placement?: "gutter" | "hero";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isCovered = useCraftGridCover(ref);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reveal = () => setValue(total);
    if (document.documentElement.dataset.paperIntro !== "playing") {
      reveal();
      return;
    }
    window.addEventListener(PAPER_INTRO_FINISHED_EVENT, reveal, { once: true });
    return () => window.removeEventListener(PAPER_INTRO_FINISHED_EVENT, reveal);
  }, [total]);

  return (
    <div
      ref={ref}
      className={placement === "hero" ? styles.heroCount : styles.count}
      data-covered={(placement === "gutter" && isCovered) || undefined}
    >
      <NumberFlow value={value} locales="en-US" suffix=" visitors" />
      <span className={styles.bars} aria-hidden="true">
        {BAR_LEVELS.map((level, index) => (
          <span
            key={index}
            className={styles.bar}
            style={{ "--level": value ? level : 0.15, "--index": index } as CSSProperties}
          />
        ))}
      </span>
    </div>
  );
}
