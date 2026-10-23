import shared from "@/components/case-study/case-study.module.css";
import { SkeletonImage } from "@/components/ui/skeleton-image";
import styles from "./animator-case.module.css";

export const imagePath = "/images/animator-case";
// The case column is at most 636px wide; without this, every screen loads the 2048–3840px variant.
export const imageSizes = "(max-width: 760px) calc(100vw - 32px), 636px";

export function CaseImage({
  alt,
  height = 1192,
  name,
  width = 2032,
}: {
  alt: string;
  height?: number;
  name: string;
  width?: number;
}) {
  return (
    <SkeletonImage
      alt={alt}
      className={shared.media}
      height={height}
      sizes={imageSizes}
      src={`${imagePath}/${name}`}
      width={width}
    />
  );
}

export function AnimatorHeroVideo() {
  return (
    <video
      autoPlay
      className={`${shared.media} ${styles.heroVideo}`}
      loop
      muted
      playsInline
      poster="/images/video-posters/animator.webp"
    >
      <source src="/videos/animator_thumb_demo.mp4" type="video/mp4" />
    </video>
  );
}

/** Looping, muted product clip that plays inline like the hero video. */
export function AnimatorClip({ label, src }: { label: string; src: string }) {
  return (
    <video aria-label={label} autoPlay className={`${shared.media} ${styles.clip}`} loop muted playsInline preload="metadata">
      <source src={src} type="video/mp4" />
    </video>
  );
}

/** Headline numbers for the results section. */
export function AnimatorMetrics({ items }: { items: readonly { label: string; value: string }[] }) {
  return (
    <dl className={styles.metrics}>
      {items.map(({ label, value }) => (
        <div key={label}>
          <dd>{value}</dd>
          <dt>{label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Core flow as outlined steps joined by arrows (stacked on phones). */
export function AnimatorFlow({ steps }: { steps: readonly string[] }) {
  return (
    <ol className={styles.flow}>
      {steps.map((step, index) => (
        <li key={step}>
          <span className={styles.flowStep}>{step}</span>
          {index < steps.length - 1 ? (
            <span aria-hidden="true" className={styles.flowArrow} />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
