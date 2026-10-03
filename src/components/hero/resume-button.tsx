"use client";

import { useInteractionSound } from "@/components/sound/sound-provider";
import { ButtonLink } from "@/components/ui/button";
import { HoverShimmer } from "@/components/ui/hover-shimmer";
import { useMouseHover } from "@/components/ui/use-mouse-hover";
import { links } from "@/lib/site";

export function ResumeButton({ className }: { className?: string }) {
  const { hoverProps, isHovered } = useMouseHover();
  const { playTap } = useInteractionSound();

  return (
    <ButtonLink
      aria-label="Resume"
      className={className}
      href={links.resume}
      onClick={playTap}
      rel="noreferrer"
      target="_blank"
      variant="primary"
      {...hoverProps}
    >
      <HoverShimmer isActive={isHovered}>Resume</HoverShimmer>
    </ButtonLink>
  );
}
