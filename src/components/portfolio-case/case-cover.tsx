"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { CaseCoverModal } from "./case-cover-modal";
import { CaseVideo } from "./case-video";
import { DashboardCasePreview } from "./dashboard-case-preview";
import { InteractiveCardCover } from "./interactive-card-cover";
import { PhantomGlowCover } from "./phantom-glow-cover";
import styles from "./portfolio-case.module.css";
import type { CaseCover as CaseCoverData, CaseImageVariant } from "./types";

const caseViewSizes = "(max-width: 760px) 92vw, 900px";
// Matches `--radius-sm` on `.screenCaseTrigger`.
const screenCaseRadius = 6;

const imageClassNames: Record<CaseImageVariant, string> = {
  ccp: styles.ccpCaseImage,
  loop: styles.loopCaseImage,
  safe: styles.safeCaseImage,
  steamify: styles.steamifyCaseImage,
  "steamify-experiment": styles.steamifyExperimentCaseImage,
};

const imageVisualClassNames: Partial<Record<CaseImageVariant, string>> = {
  ccp: `${styles.ccpCaseVisual} ${styles.caseVisualFlushBottom}`,
  loop: styles.loopCaseVisual,
  safe: styles.caseVisualFlushBottom,
  steamify: styles.steamifyCaseVisual,
  "steamify-experiment": styles.steamifyExperimentCaseVisual,
};

const join = (...classNames: (string | undefined)[]) =>
  classNames.filter(Boolean).join(" ");

/** Imported images expose their URL through `.src`. */
const getImageUrl = (src: string | { src: string }) =>
  typeof src === "string" ? src : src.src;

/**
 * A static cover frame. On cards without their own page it opens the cover in
 * an expanded view; `renderMedia(true)` renders the original, unoptimized file.
 */
function StaticCover({
  caseId,
  className,
  expandedSrc,
  isLinked,
  label,
  mediaOnly = false,
  renderMedia,
  style,
  thumbnailRadius,
}: {
  caseId: string;
  className: string;
  expandedSrc?: string;
  isLinked: boolean;
  label: string;
  mediaOnly?: boolean;
  renderMedia: (isExpanded: boolean) => ReactNode;
  style?: CSSProperties;
  thumbnailRadius?: number;
}) {
  if (isLinked) {
    return (
      <div
        className={className}
        {...(mediaOnly ? { "data-debug-media": true } : { "data-debug-frame": true })}
        style={style}
      >
        {renderMedia(false)}
      </div>
    );
  }

  return (
    <CaseCoverModal
      caseId={caseId}
      className={className}
      expandedSrc={expandedSrc}
      label={label}
      mediaOnly={mediaOnly}
      renderMedia={renderMedia}
      style={style}
      thumbnailRadius={thumbnailRadius}
    />
  );
}

export function CaseCover({
  caseId,
  cover,
  isLinked,
  title,
}: {
  caseId: string;
  cover: CaseCoverData;
  isLinked: boolean;
  title: string;
}) {
  const label = title || "case image";

  switch (cover.type) {
    case "background": {
      const { foreground } = cover;

      return (
        <StaticCover
          caseId={caseId}
          className={join(styles.caseVisual, styles.backgroundCaseVisual)}
          expandedSrc={foreground?.src}
          isLinked={isLinked}
          label={label}
          renderMedia={(isExpanded) =>
            foreground ? (
              <Image
                alt={foreground.alt}
                className={styles.backgroundCaseImage}
                data-debug-media
                height={foreground.height}
                loading={isExpanded ? "eager" : undefined}
                sizes={isExpanded ? caseViewSizes : undefined}
                src={foreground.src}
                unoptimized={isExpanded}
                width={foreground.width}
              />
            ) : null
          }
          style={{ backgroundImage: `url("${cover.src}")` }}
        />
      );
    }

    case "screen":
      // Only the screen itself scales on hover and expands; the gray frame stays put.
      return (
        <div
          className={join(styles.caseVisual, styles.screenCaseVisual)}
          data-debug-frame
        >
          <StaticCover
            caseId={caseId}
            className={styles.screenCaseTrigger}
            expandedSrc={getImageUrl(cover.src)}
            isLinked={isLinked}
            label={label}
            mediaOnly
            renderMedia={(isExpanded) => (
              <Image
                alt={cover.alt}
                className={styles.screenCaseImage}
                height={cover.height}
                loading={isExpanded ? "eager" : undefined}
                sizes={isExpanded ? caseViewSizes : "(max-width: 760px) 90vw, 520px"}
                src={cover.src}
                unoptimized={isExpanded}
                width={cover.width}
              />
            )}
            thumbnailRadius={screenCaseRadius}
          />
        </div>
      );

    case "interactive-card":
      return (
        <div
          className={join(styles.caseVisual, styles.interactiveCaseVisual)}
          data-debug-frame
        >
          <div className={styles.interactiveCaseMedia} data-debug-media>
            <InteractiveCardCover />
          </div>
        </div>
      );

    case "phantom-glow":
      return (
        <div
          className={join(styles.caseVisual, styles.phantomCaseVisual)}
          data-debug-frame
        >
          <PhantomGlowCover />
        </div>
      );

    case "placeholder":
      return (
        <div
          aria-label="Case visual coming soon"
          className={join(styles.caseVisual, styles.placeholderCaseVisual)}
          data-debug-frame
          role="img"
        />
      );

    case "video":
      return (
        <CaseVideo
          {...cover}
          caseId={caseId}
          expandable={cover.expandable && !isLinked}
          label={label}
        />
      );

    case "image": {
      const isLoop = cover.variant === "loop";

      return (
        <StaticCover
          caseId={caseId}
          className={join(styles.caseVisual, imageVisualClassNames[cover.variant])}
          // The interactive dashboard and art-directed covers have no single original.
          expandedSrc={isLoop || cover.mobileSrc ? undefined : getImageUrl(cover.src)}
          isLinked={isLinked}
          label={label}
          renderMedia={(isExpanded) => {
            if (isLoop) {
              return (
                <DashboardCasePreview
                  alt={cover.alt}
                  sizes={
                    isExpanded
                      ? caseViewSizes
                      : (cover.sizes ?? "(max-width: 760px) calc(100vw - 40px), 512px")
                  }
                  src={cover.src}
                />
              );
            }

            const image = (
              <Image
                alt={cover.alt}
                className={join(styles.caseImage, imageClassNames[cover.variant])}
                data-debug-media
                height={cover.height}
                // The expanded view shows the original file, not a recompressed variant.
                loading={isExpanded ? "eager" : undefined}
                preload={cover.eager && !isExpanded ? true : undefined}
                sizes={
                  isExpanded
                    ? caseViewSizes
                    : (cover.sizes ?? "(max-width: 760px) 100vw, 700px")
                }
                src={cover.src}
                unoptimized={isExpanded || cover.unoptimized}
                width={cover.width}
              />
            );

            return cover.mobileSrc ? (
              <picture className={styles.steamifyExperimentPicture}>
                <source media="(max-width: 760px)" srcSet={cover.mobileSrc} />
                {image}
              </picture>
            ) : (
              image
            );
          }}
        />
      );
    }
  }
}
