"use client";

import Image from "next/image";
import { useRef } from "react";
import { CaseCoverModal } from "@/components/portfolio-case/case-cover-modal";
import { ExpandedCaseVideo } from "@/components/portfolio-case/case-video";
import styles from "./case-media.module.css";

// The page needs a `MotionProvider` above these, since the expanding view animates with `m.*`.

const defaultCaseId = "case-media";
const defaultSizes = "(max-width: 760px) calc(100vw - 32px), 636px";

function frameClass(frameClassName?: string) {
  return frameClassName ? `${styles.frame} ${frameClassName}` : styles.frame;
}

/**
 * Case-study image that opens in the same expanding view as the home page covers.
 * The expanded view scales up a copy rendered at thumbnail size, so it reuses the
 * already loaded and decoded file instead of fetching a new one mid-animation.
 */
export function CaseImage({
  alt,
  caseId = defaultCaseId,
  className,
  expandable = true,
  frameClassName,
  height,
  preload,
  sizes = defaultSizes,
  src,
  thumbnailRadius = 0,
  width,
}: {
  alt: string;
  caseId?: string;
  /** Class for the image itself. */
  className?: string;
  /** False renders a plain image, e.g. for case heroes the reader just saw full size. */
  expandable?: boolean;
  /** Class for the clickable frame, e.g. its corner radius and background. */
  frameClassName?: string;
  height: number;
  preload?: boolean;
  sizes?: string;
  src: string;
  /** Corner radius of the frame, so the expanded view grows out of it. */
  thumbnailRadius?: number;
  width: number;
}) {
  const imageClassName = className ? `${styles.media} ${className}` : styles.media;

  if (!expandable) {
    return (
      <div className={frameClassName ? `${styles.still} ${frameClassName}` : styles.still}>
        <Image alt={alt} className={imageClassName} height={height} preload={preload} sizes={sizes} src={src} width={width} />
      </div>
    );
  }

  return (
    <CaseCoverModal
      caseId={caseId}
      className={frameClass(frameClassName)}
      label={alt}
      mediaOnly
      renderMedia={(isExpanded) => (
        <Image
          alt={alt}
          className={imageClassName}
          height={height}
          loading={isExpanded ? "eager" : undefined}
          preload={isExpanded ? undefined : preload}
          sizes={sizes}
          src={src}
          width={width}
        />
      )}
      thumbnailRadius={thumbnailRadius}
    />
  );
}

/** Looping case-study video; the expanded view continues from the current frame. */
export function CaseVideo({
  alt,
  caseId = defaultCaseId,
  className,
  frameClassName,
  poster,
  src,
  thumbnailRadius = 0,
}: {
  alt: string;
  caseId?: string;
  className?: string;
  frameClassName?: string;
  poster?: string;
  src: string;
  thumbnailRadius?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);
  const videoClassName = className ? `${styles.media} ${styles.video} ${className}` : `${styles.media} ${styles.video}`;

  return (
    <CaseCoverModal
      caseId={caseId}
      className={frameClass(frameClassName)}
      label={alt}
      mediaOnly
      plainBackdrop
      renderMedia={(isExpanded) =>
        isExpanded ? (
          <ExpandedCaseVideo
            className={videoClassName}
            sourceRef={videoRef}
            style={{}}
            videoRef={expandedVideoRef}
          />
        ) : (
          <video
            aria-hidden="true"
            autoPlay
            className={videoClassName}
            loop
            muted
            playsInline
            poster={poster}
            preload="metadata"
            ref={videoRef}
            src={src}
          />
        )
      }
      thumbnailRadius={thumbnailRadius}
    />
  );
}
