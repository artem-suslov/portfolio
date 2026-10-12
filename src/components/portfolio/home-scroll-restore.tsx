"use client";

import { useRestoreHomeScroll } from "@/lib/case-return";

/** Returns the home page to where a case-study cover was opened from. */
export function HomeScrollRestore() {
  useRestoreHomeScroll();
  return null;
}
