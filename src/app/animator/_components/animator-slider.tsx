"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type CSSProperties, useRef, useState } from "react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { Button } from "@/components/ui/button";
import { SkeletonImage } from "@/components/ui/skeleton-image";
import { imagePath, imageSizes } from "./animator-case-parts";
import styles from "./animator-case.module.css";

// A horizontal swipe shorter than this is treated as a tap, not a slide change.
const swipeThreshold = 40;

/**
 * Carousel of screenshots: the current one sits in the middle and its neighbours peek in
 * from the sides. Chevron buttons below or a swipe switch it.
 */
export function AnimatorSlider({
  images,
  labels,
}: {
  images: readonly { alt: string; height: number; name: string; width: number }[];
  labels: { next: string; previous: string; slider: string };
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const { playTap } = useInteractionSound();
  const last = images.length - 1;

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), last);
    if (clamped === index) return;
    setIndex(clamped);
    playTap();
  };

  return (
    <div aria-label={labels.slider} aria-roledescription="carousel" className={styles.slider} role="group">
      <div
        className={styles.sliderViewport}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const deltaX = event.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(deltaX) >= swipeThreshold) goTo(index + (deltaX < 0 ? 1 : -1));
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
      >
        <div className={styles.sliderTrack} style={{ "--slider-index": index } as CSSProperties}>
          {images.map(({ alt, height, name, width }, slide) => (
            <div
              aria-hidden={slide !== index}
              aria-label={`${slide + 1} / ${images.length}`}
              aria-roledescription="slide"
              className={styles.sliderSlide}
              inert={slide !== index}
              key={name}
              role="group"
            >
              <SkeletonImage alt={alt} height={height} sizes={imageSizes} src={`${imagePath}/${name}`} width={width} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.sliderControls}>
        <Button aria-label={labels.previous} className={styles.sliderButton} disabled={index === 0} iconOnly onClick={() => goTo(index - 1)}>
          <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.7} />
        </Button>
        <span aria-live="polite" className={styles.sliderCount}>
          {index + 1} / {images.length}
        </span>
        <Button aria-label={labels.next} className={styles.sliderButton} disabled={index === last} iconOnly onClick={() => goTo(index + 1)}>
          <ChevronRight aria-hidden="true" size={16} strokeWidth={1.7} />
        </Button>
      </div>
    </div>
  );
}
