"use client";

import { Pause, Play } from "lucide";
import { MorphIcon } from "morphicons/react";
import {
  type CSSProperties,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { CaseCoverModal } from "./case-cover-modal";
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

const expandedFrameMaxWidth = 1280;

/** The cover's current frame, so the expanded copy never shows a stale poster. */
function captureFrame(video: HTMLVideoElement) {
  if (!video.videoWidth) {
    return null;
  }

  const scale = Math.min(1, expandedFrameMaxWidth / video.videoWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(video.videoWidth * scale);
  canvas.height = Math.round(video.videoHeight * scale);

  try {
    canvas
      .getContext("2d")
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  } catch {
    return null;
  }
}

/**
 * The copy shown in the expanded view. It picks up where the cover video is,
 * so the cover appears to grow instead of restarting.
 */
export function ExpandedCaseVideo({
  className,
  sourceRef,
  style,
  videoRef,
}: {
  className: string;
  sourceRef: RefObject<HTMLVideoElement | null>;
  style: CSSProperties;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  useLayoutEffect(() => {
    const video = videoRef.current;
    const source = sourceRef.current;

    if (!video || !source) {
      return;
    }

    const frame = captureFrame(source);

    if (frame) {
      video.style.setProperty("--case-poster", `url(${frame})`);
    }

    video.src = source.currentSrc;
    video.currentTime = source.currentTime;

    if (!source.paused) {
      void video.play().catch(() => undefined);
    }
  }, [sourceRef, videoRef]);

  return (
    <video
      aria-hidden="true"
      className={className}
      loop
      muted
      playsInline
      preload="auto"
      ref={videoRef}
      style={style}
    />
  );
}

/** Muted looping cover video with a play/pause toggle. */
export function CaseVideo({
  caseId,
  expandable,
  label,
  mobilePoster,
  mobileSrc,
  poster,
  src,
  variant,
}: CaseVideoCover & { caseId: string; label: string }) {
  const { playTap } = useInteractionSound();
  const videoRef = useRef<HTMLVideoElement>(null);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // The first frame is painted as a background image so the mobile source can
  // carry its own poster through a media query; `poster` takes a single value.
  const posterStyle = {
    ...(poster ? { "--case-poster": `url(${poster})` } : {}),
    ...(mobilePoster ? { "--case-poster-mobile": `url(${mobilePoster})` } : {}),
  } as CSSProperties;

  function togglePlayback() {
    // While expanded, the cover keeps running underneath: drive both so the
    // cover is in the same state when the view closes.
    const videos = [expandedVideoRef.current, videoRef.current].filter(
      (video) => video !== null,
    );
    const [video] = videos;

    if (!video) {
      return;
    }

    if (video.paused) {
      Promise.all(videos.map((item) => item.play()))
        .then(() => {
          setIsPaused(false);
          playTap();
        })
        .catch(() => setIsPaused(true));
      return;
    }

    videos.forEach((item) => item.pause());
    setIsPaused(true);
    playTap();
  }

  const videoClassName = `${styles.caseVideo} ${videoClassNames[variant]}`;

  const video = (
    <video
      aria-hidden="true"
      autoPlay
      className={videoClassName}
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
  );

  const renderControl = (isExpanded: boolean) => (
    <button
      aria-label={isPaused ? "Play case video" : "Pause case video"}
      className={styles.caseVideoControl}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        togglePlayback();
      }}
      // Keep a press on the toggle from starting a drag of the expanded view.
      onPointerDownCapture={
        isExpanded ? (event) => event.stopPropagation() : undefined
      }
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
  );

  if (expandable) {
    // The cover is itself a button, so the playback toggle sits beside it.
    return (
      <div className={styles.caseVideoFrame}>
        <CaseCoverModal
          caseId={caseId}
          className={styles.caseVisual}
          label={label}
          plainBackdrop
          renderExpandedOverlay={() => renderControl(true)}
          renderMedia={(isExpanded) =>
            isExpanded ? (
              <ExpandedCaseVideo
                className={videoClassName}
                sourceRef={videoRef}
                style={posterStyle}
                videoRef={expandedVideoRef}
              />
            ) : (
              video
            )
          }
        />
        {renderControl(false)}
      </div>
    );
  }

  return (
    <div className={styles.caseVisual} data-debug-frame>
      {video}
      {renderControl(false)}
    </div>
  );
}
