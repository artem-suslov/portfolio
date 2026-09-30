"use client";

import { useEffect, useRef } from "react";
import styles from "./paper-intro.module.css";

const paperIntroFinishedEvent = "portfolio-paper-intro-finished";

/** A decorative cover: the real page keeps its layout and native scrolling. */
export function PaperIntro() {
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cover = coverRef.current;
    if (!cover) return;

    if (window.matchMedia("(max-width: 760px)").matches) return;

    if (document.documentElement.dataset.paperIntroPlayed === "true") {
      cover.hidden = true;
      return;
    }

    document.documentElement.dataset.paperIntro = "playing";
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    // <html> uses smooth scrolling; the reset must be instant, otherwise a
    // restored position visibly glides back to the top as the paper unrolls.
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    resetScroll();

    let scrollResetFrame: number | undefined = window.requestAnimationFrame(() => {
      // A browser can restore its previous position after hydration, so reset it
      // once more on the next frame while the cover is already visible.
      resetScroll();
      scrollResetFrame = undefined;
    });

    let hasFinished = false;
    const restoreScrollRestoration = () => {
      if (scrollResetFrame !== undefined) {
        window.cancelAnimationFrame(scrollResetFrame);
        scrollResetFrame = undefined;
      }
      window.history.scrollRestoration = previousScrollRestoration;
    };
    const skip = () => {
      if (hasFinished) return;

      hasFinished = true;
      restoreScrollRestoration();
      cover.hidden = true;
      delete document.documentElement.dataset.paperIntro;
      document.documentElement.dataset.paperIntroPlayed = "true";
      window.dispatchEvent(new Event(paperIntroFinishedEvent));
    };

    const events = ["wheel", "touchstart", "pointerdown", "keydown", "focusin", "resize"] as const;
    const cleanup = () => {
      events.forEach((event) => window.removeEventListener(event, skip));
    };
    events.forEach((event) => window.addEventListener(event, skip, { passive: true }));
    const introTimer = window.setTimeout(skip, 2600);

    return () => {
      window.clearTimeout(introTimer);
      cleanup();
      restoreScrollRestoration();
    };
  }, []);

  return (
    <div
      ref={coverRef}
      className={styles.cover}
      aria-hidden="true"
      data-paper-intro
    >
      <div className={styles.roll}>
        <span className={styles.edge} />
      </div>
    </div>
  );
}
