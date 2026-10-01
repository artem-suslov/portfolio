"use client";

import { useEffect, useRef } from "react";
import { PAPER_INTRO_FINISHED_EVENT } from "@/lib/events";
import { matchesMedia, MOBILE_QUERY } from "@/lib/media";
import styles from "./paper-intro.module.css";

/** A decorative cover: the real page keeps its layout and native scrolling. */
export function PaperIntro() {
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cover = coverRef.current;
    if (!cover) return;

    if (matchesMedia(MOBILE_QUERY)) return;

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
    // A pointer press, a resize or the timer dismisses the cover; one signal removes every listener.
    const listeners = new AbortController();
    const skip = () => {
      if (hasFinished) return;

      hasFinished = true;
      listeners.abort();
      restoreScrollRestoration();
      cover.hidden = true;
      delete document.documentElement.dataset.paperIntro;
      document.documentElement.dataset.paperIntroPlayed = "true";
      window.dispatchEvent(new Event(PAPER_INTRO_FINISHED_EVENT));
    };

    // Scrolling and typing are left alone: the page scrolls natively under the
    // cover while the unroll plays to the end.
    for (const event of ["touchstart", "pointerdown", "resize"]) {
      window.addEventListener(event, skip, { passive: true, signal: listeners.signal });
    }
    const introTimer = window.setTimeout(skip, 2600);

    return () => {
      window.clearTimeout(introTimer);
      listeners.abort();
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
