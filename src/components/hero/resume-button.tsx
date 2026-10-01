"use client";

import { useInteractionSound } from "@/components/sound/sound-provider";
import { HoverShimmer } from "@/components/ui/hover-shimmer";
import { useMouseHover } from "@/components/ui/use-mouse-hover";
import { links } from "@/lib/site";

export function ResumeButton({ className }: { className: string }) {
  const { hoverProps, isHovered } = useMouseHover();
  const { playTap } = useInteractionSound();

  return (
    <a
      aria-label="Resume"
      className={className}
      href={links.resume}
      onClick={playTap}
      rel="noreferrer"
      target="_blank"
      {...hoverProps}
    >
      <HoverShimmer isActive={isHovered}>Resume</HoverShimmer>
    </a>
  );
}
