"use client";

import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { ButtonLink } from "@/components/ui/button";
import styles from "./case-study.module.css";

export type CaseRailSection = {
  id: string;
  label: string;
};

export function CaseRail({
  sections,
}: {
  sections: readonly CaseRailSection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const { playTap } = useInteractionSound();
  const navRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  // While a click-triggered scroll runs, the scroll spy stays paused so the dot
  // goes straight to the clicked item instead of stepping through every section on the way.
  const isClickScrollingRef = useRef(false);
  const releaseTimerRef = useRef(0);

  // Moves the single active dot next to the current item so it slides between items.
  const placeDot = useCallback(() => {
    const dot = dotRef.current;
    const item = navRef.current?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!dot || !item) return;
    // Center the 4px dot on the first 32px line of the item.
    dot.style.transform = `translateY(${item.offsetTop + 14}px)`;
    if (!dot.dataset.ready) {
      // Commit the first position before enabling the transition so the dot doesn't fly in from the top.
      dot.getBoundingClientRect();
      dot.dataset.ready = "true";
    }
  }, []);

  useLayoutEffect(placeDot, [activeId, placeDot]);

  useEffect(() => {
    window.addEventListener("resize", placeDot);
    return () => window.removeEventListener("resize", placeDot);
  }, [placeDot]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (isClickScrollingRef.current) return;
      const readingLine = Math.min(window.innerHeight * 0.25, 180);
      let current = sections[0]?.id ?? "";
      for (const { id } of sections) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= readingLine) current = id;
      }
      // Short final sections may never reach the reading line.
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1]?.id ?? current;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    // Smooth scrolling has no reliable end event everywhere, so wait for scroll events to go quiet.
    const onScroll = () => {
      if (isClickScrollingRef.current) {
        window.clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = window.setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 150);
        return;
      }
      schedule();
    };
    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(releaseTimerRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [sections]);

  return <aside className={styles.rail} aria-label="Case navigation">
    <ButtonLink className={styles.back} href="/" onClick={playTap} variant="outline">
      <ChevronLeft absoluteStrokeWidth aria-hidden="true" size={16} strokeWidth={1.1} />Back
    </ButtonLink>
    <nav ref={navRef} aria-label="Table of contents" className={styles.railItems}>
      <span ref={dotRef} className={styles.railDot} aria-hidden="true" />
      {sections.map(({ id, label }) => <a
        key={id}
        href={`#${id}`}
        className={styles.railItem}
        aria-current={activeId === id ? "location" : undefined}
        onClick={() => {
          if (activeId === id) return;
          playTap();
          setActiveId(id);
          isClickScrollingRef.current = true;
          // Released by the scroll handler once scrolling settles; this longer first wait gives
          // smooth scrolling time to start, and covers clicks where the page doesn't need to move.
          window.clearTimeout(releaseTimerRef.current);
          releaseTimerRef.current = window.setTimeout(() => {
            isClickScrollingRef.current = false;
          }, 300);
        }}
      >{label}</a>)}
    </nav>
  </aside>;
}
