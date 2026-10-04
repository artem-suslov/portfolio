"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";
import Marquee from "react-fast-marquee";
import { CaseCoverModal } from "@/components/portfolio-case/case-cover-modal";
import { concepts } from "@/data/concepts";
import { MOBILE_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/media";
import styles from "./concepts-gallery.module.css";

// Matches `--radius-md` on `.conceptTrigger`.
const conceptRadius = 8;
// Each layer blurs harder over a shorter stretch, so the blur ramps up to 32px at the window edge.
const edgeBlurLayers = [2, 4, 8, 16, 32];
// Off while trying the strip without edge treatment; flip back to restore the fades and blur.
const showEdgeFades = false;

function EdgeBlur({ side }: { side: "left" | "right" }) {
  return (
    <div aria-hidden="true" className={styles.edgeBlur} data-side={side}>
      {edgeBlurLayers.map((blur, index) => (
        <div
          className={styles.edgeBlurLayer}
          key={blur}
          style={{
            "--blur": `${blur}px`,
            "--reach": `${100 - (index * 100) / edgeBlurLayers.length}%`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function ConceptsGallery({ className }: { className?: string }) {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  // The strip holds still while a concept is expanded, so the view can
  // settle back into the exact slot it opened from.
  const [isViewing, setIsViewing] = useState(false);

  return (
    <section
      aria-label="Concepts"
      className={className ? `${styles.gallery} ${className}` : styles.gallery}
    >
      {/* Painted before the marquee's color fades, so the fades sit on top of the blur. */}
      {showEdgeFades ? (
        <>
          <EdgeBlur side="left" />
          <EdgeBlur side="right" />
        </>
      ) : null}
      <Marquee
        autoFill
        gradient={showEdgeFades}
        gradientColor="var(--concepts-fade, var(--color-surface))"
        // Keep in sync with `--concepts-edge` in the CSS module.
        gradientWidth={isMobile ? 32 : 120}
        play={!prefersReducedMotion && !isViewing}
        speed={48}
      >
        {concepts.map(({ alt, src }, index) => (
          <div className={styles.slot} key={src.src}>
            <CaseCoverModal
              caseId={`concept-${index + 1}`}
              className={styles.conceptTrigger}
              expandedSrc={src.src}
              label={alt}
              onOpenChange={setIsViewing}
              renderMedia={(isExpanded) => (
                <Image
                  alt={alt}
                  className={styles.concept}
                  height={src.height}
                  // Lazy loading starts only once a frame slides into view, flashing an empty slot.
                  loading="eager"
                  sizes={
                    isExpanded
                      ? "(max-width: 760px) 92vw, 900px"
                      : "(max-width: 760px) 384px, 756px"
                  }
                  src={src}
                  // The expanded view shows the original file, not a recompressed variant.
                  unoptimized={isExpanded}
                  width={src.width}
                />
              )}
              scaleOnHover={false}
              thumbnailRadius={conceptRadius}
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
