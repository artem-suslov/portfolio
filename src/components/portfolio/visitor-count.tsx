"use client";

import NumberFlow from "@number-flow/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { PAPER_INTRO_FINISHED_EVENT } from "@/lib/events";
import type { VisitorStats } from "@/lib/visitors";
import { useCraftGridCover } from "./home-rail";
import styles from "./visitor-count.module.css";

/**
 * Visitor count pinned in the right gutter, mirroring the section rail on the left.
 * The digits roll up from zero once the page is in view (after the paper intro, if
 * it plays). The bars show unique visitors for the last three days, scaled to the
 * busiest one: they grow in with the digits, then keep gently breathing.
 */
export function VisitorCount({ stats }: { stats: VisitorStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const isCovered = useCraftGridCover(ref);
  const [value, setValue] = useState(0);
  const peak = Math.max(...stats.daily, 1);

  useEffect(() => {
    const reveal = () => setValue(stats.total);
    if (document.documentElement.dataset.paperIntro !== "playing") {
      reveal();
      return;
    }
    window.addEventListener(PAPER_INTRO_FINISHED_EVENT, reveal, { once: true });
    return () => window.removeEventListener(PAPER_INTRO_FINISHED_EVENT, reveal);
  }, [stats.total]);

  return (
    <div ref={ref} className={styles.count} data-covered={isCovered || undefined}>
      <NumberFlow value={value} locales="en-US" suffix=" visitors" />
      <span className={styles.bars} aria-hidden="true">
        {stats.daily.map((dayValue, index) => (
          <span
            // Days have no identity beyond their position.
            key={index}
            className={styles.bar}
            style={
              {
                "--level": value ? Math.max(dayValue / peak, 0.15) : 0.15,
                "--index": index,
              } as CSSProperties
            }
          />
        ))}
      </span>
    </div>
  );
}
