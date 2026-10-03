"use client";

import Image from "next/image";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import { CaseCoverModal } from "@/components/portfolio-case/case-cover-modal";
import { concepts } from "@/data/concepts";
import { MOBILE_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/media";
import styles from "./concepts-gallery.module.css";

// Matches `--radius-md` on `.conceptTrigger`.
const conceptRadius = 8;

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
      <Marquee
        autoFill
        gradient
        gradientColor="var(--concepts-fade, var(--color-surface))"
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
