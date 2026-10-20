import Image from "next/image";
import shared from "@/components/case-study/case-study.module.css";
import styles from "./animator-case.module.css";

export const imagePath = "/images/animator-case";

export function CaseImage({ alt, name }: { alt: string; name: string }) {
  return (
    <Image
      alt={alt}
      className={shared.media}
      height={1192}
      src={`${imagePath}/${name}`}
      width={2032}
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

/** Three settings screenshots side by side (stacked on phones). */
export function ImageTriptych({
  images,
}: {
  images: readonly { alt: string; name: string; width: number }[];
}) {
  return (
    <div className={styles.mediaTriptych}>
      {images.map(({ alt, name, width }) => (
        <Image alt={alt} height={298} key={name} src={`${imagePath}/${name}`} width={width} />
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
