import { type RefObject, useLayoutEffect } from "react";

/**
 * Leaving a case study marks `<html data-case-return="/case-path">` for a moment, so
 * the home page that replaces it can fade its content in while the cover of that
 * case morphs back into place (see `CaseMorph`).
 */
const attribute = "caseReturn";
// Longer than the cover morph plus the staggered fade-in after it, so removing a
// mark never cuts an animation short.
const markDuration = 2000;

let clearTimer = 0;
let navClearTimer = 0;

/**
 * Marks `<html data-case-nav>` while a cover morphs between the home page and a case
 * study: the incoming page then holds its content back until the cover has landed
 * (`--content-enter-delay` in globals.css). Direct page loads show content right away.
 */
export function markCaseNavigation() {
  const root = document.documentElement;
  root.dataset.caseNav = "";
  window.clearTimeout(navClearTimer);
  navClearTimer = window.setTimeout(() => delete root.dataset.caseNav, markDuration);
}

// The home page scroll position when a cover was opened. Session storage keeps it
// across a reload of the case page.
const scrollKey = "case-return-scroll";

/** Call when a home page cover opens its case: remembers where the page was scrolled. */
export function rememberHomeScroll() {
  try {
    sessionStorage.setItem(scrollKey, String(window.scrollY));
  } catch {
    // Storage can be unavailable (private mode); the return then starts at the top.
  }
}

/**
 * Call once on the home page. Coming back from a case study, it restores the scroll
 * position the cover was opened from, so the cover morphs back into its own card.
 * Runs in a layout effect, before the view transition captures the page.
 */
export function useRestoreHomeScroll() {
  useLayoutEffect(() => {
    if (!readCaseReturn()) return;
    let top = 0;
    try {
      top = Number(sessionStorage.getItem(scrollKey)) || 0;
    } catch {
      // Without storage, fall back to the top of the page.
    }
    // `<html>` scrolls smoothly; the restore must jump.
    window.scrollTo({ top, behavior: "instant" });
    // Forget the position afterwards, not right away: Strict Mode runs this effect
    // twice in development, and the second run must read the same value.
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.removeItem(scrollKey);
      } catch {}
    });
    return () => window.clearTimeout(timer);
  }, []);
}

/** Call on every case-study page: marks the return as the page unmounts. */
export function useMarkCaseReturn() {
  // A layout-effect cleanup runs inside the navigation commit, before the view
  // transition captures the incoming page.
  useLayoutEffect(() => {
    const path = window.location.pathname;
    return () => {
      const root = document.documentElement;
      root.dataset[attribute] = path;
      markCaseNavigation();
      window.clearTimeout(clearTimer);
      clearTimer = window.setTimeout(() => delete root.dataset[attribute], markDuration);
    };
  }, []);
}

/** The case path being returned from, or `null` on a regular page load. */
export function readCaseReturn() {
  return typeof document === "undefined"
    ? null
    : (document.documentElement.dataset[attribute] ?? null);
}

/**
 * Marks `element` with `data-return-target` when the page mounts while returning
 * from the case at `href`. Rendering runs before the leaving page sets the mark,
 * so this checks in a layout effect, which still lands before the view transition
 * captures the page.
 */
export function useCaseReturnTarget(element: RefObject<HTMLElement | null>, href: string | undefined) {
  useLayoutEffect(() => {
    const node = element.current;
    if (!node || !href || readCaseReturn() !== href) return;
    node.setAttribute("data-return-target", "");
    const timer = window.setTimeout(() => node.removeAttribute("data-return-target"), markDuration);
    return () => window.clearTimeout(timer);
  }, [element, href]);
}
