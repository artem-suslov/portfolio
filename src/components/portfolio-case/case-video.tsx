"use client";

import { Pause, Play } from "lucide";
import { MorphIcon } from "morphicons/react";
import { type CSSProperties, useRef, useState } from "react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import styles from "./portfolio-case.module.css";
import type { CaseVideoCover, CaseVideoVariant } from "./types";

const videoClassNames: Record<CaseVideoVariant, string> = {
  animator: styles.animatorCaseVideo,
  ccp: styles.ccpCaseVideo,
  "freelance-tracker": styles.freelanceTrackerCaseVideo,
  loop: styles.loopCaseVideo,
  "quick-stickers": styles.quickStickersCaseVideo,
  steamify: styles.steamifyCaseVideo,
};

/** Muted looping cover video with a play/pause toggle. */
export function CaseVideo({
  mobilePoster,
  mobileSrc,
  poster,
  src,
  variant,
}: CaseVideoCover) {
  const { playTap } = useInteractionSound();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // The first frame is painted as a background image so the mobile source can
  // carry its own poster through a media query; `poster` takes a single value.
  const posterStyle = {
    ...(poster ? { "--case-poster": `url(${poster})` } : {}),
    ...(mobilePoster ? { "--case-poster-mobile": `url(${mobilePoster})` } : {}),
  } as CSSProperties;

  function togglePlayback() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsPaused(false);
          playTap();
        })
        .catch(() => setIsPaused(true));
      return;
    }

    video.pause();
    setIsPaused(true);
    playTap();
  }

  return (
    <div className={styles.caseVisual} data-debug-frame>
      <video
        aria-hidden="true"
        autoPlay
        className={`${styles.caseVideo} ${videoClassNames[variant]}`}
        data-debug-media
        loop
        muted
        playsInline
        preload="metadata"
        ref={videoRef}
        style={posterStyle}
        {...(mobileSrc ? {} : { src })}
      >
        {mobileSrc ? (
          <>
            <source media="(max-width: 760px)" src={mobileSrc} />
            <source src={src} />
          </>
        ) : null}
      </video>
      <button
        aria-label={isPaused ? "Play case video" : "Pause case video"}
        className={styles.caseVideoControl}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          togglePlayback();
        }}
        type="button"
      >
        <MorphIcon
          aria-hidden="true"
          icon={isPaused ? Play : Pause}
          size={16}
          strokeWidth={1.75}
          viewBox="0 0 24 24"
        />
      </button>
    </div>
  );
}
