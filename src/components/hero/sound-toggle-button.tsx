"use client";

import { Volume2, VolumeX } from "lucide";
import { MorphIcon } from "morphicons/react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { Button } from "@/components/ui/button";

export function SoundToggleButton({ className }: { className?: string }) {
  const { isSoundEnabled, toggleSound } = useInteractionSound();
  const label = isSoundEnabled
    ? "Disable interaction sounds"
    : "Enable interaction sounds";
  return (
    <Button
      data-sound-toggle
      aria-label={label}
      aria-pressed={isSoundEnabled}
      className={className}
      iconOnly
      onClick={toggleSound}
      title={label}
      variant="outline"
    >
      <MorphIcon
        aria-hidden="true"
        icon={isSoundEnabled ? Volume2 : VolumeX}
        size={16}
        strokeWidth={1.5}
      />
    </Button>
  );
}
