"use client";

import { GradientShimmer } from "gradient-shimmer";

/** Mint shimmer shown over a label while a mouse hovers its control. */
export function HoverShimmer({
  children,
  isActive,
}: {
  children: string;
  isActive: boolean;
}) {
  if (!isActive) {
    return children;
  }

  return (
    <GradientShimmer
      angle={105}
      duration={0.5}
      easing="smooth"
      gradient="mint"
      pauseBetween={1600}
      spread={4}
    >
      {children}
    </GradientShimmer>
  );
}
