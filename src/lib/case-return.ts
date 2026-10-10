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
