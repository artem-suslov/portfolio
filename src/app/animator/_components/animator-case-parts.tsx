import Image from "next/image";
import shared from "@/components/case-study/case-study.module.css";
import styles from "./animator-case.module.css";

export const imagePath = "/images/animator-case";

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
    <Image
      alt={alt}
      className={shared.media}
      height={height}
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

/** Settings screenshots stacked one under another at full width. */
export function ImageStack({
  images,
}: {
  images: readonly { alt: string; name: string }[];
}) {
  return (
    <div className={styles.mediaStack}>
      {images.map(({ alt, name }) => (
        <Image alt={alt} height={1666} key={name} src={`${imagePath}/${name}`} width={2914} />
      ))}
    </div>
  );
}

/** Headline numbers for the results section, with the source and date underneath. */
export function AnimatorMetrics({
  items,
  note,
}: {
  items: readonly { label: string; value: string }[];
  note: string;
}) {
  return (
    <figure className={styles.metrics}>
      <dl>
        {items.map(({ label, value }) => (
          <div key={label}>
            <dd>{value}</dd>
            <dt>{label}</dt>
          </div>
        ))}
      </dl>
      <figcaption>{note}</figcaption>
    </figure>
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
