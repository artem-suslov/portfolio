"use client";

import { useRef } from "react";
import type { VisitorStats } from "@/lib/visitors";
import { useCraftGridCover } from "./home-rail";
import styles from "./visitor-count.module.css";

const numberFormat = new Intl.NumberFormat("en-US");

/**
 * Visitor count pinned in the right gutter, mirroring the section rail on the left.
 * The bars show unique visitors for the last few days, scaled to the busiest one.
 */
export function VisitorCount({ stats }: { stats: VisitorStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const isCovered = useCraftGridCover(ref);
  const peak = Math.max(...stats.daily, 1);

  return (
    <div ref={ref} className={styles.count} data-covered={isCovered || undefined}>
      <span>{numberFormat.format(stats.total)} visitors</span>
      <span className={styles.bars} aria-hidden="true">
        {stats.daily.map((value, index) => (
          <span
            // Days have no identity beyond their position.
            key={index}
            className={styles.bar}
            style={{ height: `${Math.max(value / peak, 0.15) * 100}%` }}
          />
        ))}
      </span>
    </div>
  );
}
