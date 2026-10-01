"use client";

import { type PointerEvent, useState } from "react";
import { isMouseHover } from "@/lib/media";

/** Tracks hover from a real mouse only, so touch taps never trigger hover effects. */
export function useMouseHover() {
  const [isHovered, setIsHovered] = useState(false);

  return {
    hoverProps: {
      onPointerEnter: (event: PointerEvent) => {
        if (isMouseHover(event)) {
          setIsHovered(true);
        }
      },
      onPointerLeave: () => setIsHovered(false),
    },
    isHovered,
  };
}
