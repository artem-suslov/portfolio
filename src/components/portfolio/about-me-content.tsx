import Image from "next/image";
import { links } from "@/lib/site";
import styles from "./about-me-content.module.css";

interface InlineImageProps {
  alt: string;
  grouped?: boolean;
  src: string;
}

function InlineImage({ alt, grouped = false, src }: InlineImageProps) {
  return (
    <Image
      alt={alt}
      className={`${styles.inlineImage} ${
        grouped ? styles.inlineImageGrouped : ""
      }`}
      height={20}
      sizes="20px"
      src={src}
      width={20}
    />
  );
}

export function AboutMeContent() {
  return (
    <div className={styles.content}>
      <p>
        I&apos;ve been designing digital products for over{" "}
        <strong>5 years,</strong> with a primary focus on{" "}
        <span className={styles.inlineGroup}>
          <InlineImage
            alt="People using digital products"
            grouped
            src="/images/About_me/users.webp"
          />
          B2C
        </span>{" "}
        web and mobile applications.
      </p>

      <p>
        I actively keep up with the latest trends in
        <InlineImage alt="Color palette" src="/images/About_me/palette.webp" />
        product design,
        <InlineImage alt="AI" src="/images/About_me/ai-stars.webp" />
        AI, and emerging technologies, constantly exploring new tools and
        workflows to improve the way digital products are built.
      </p>

      <p>
        Beyond my day-to-day work, I create content about product design and AI
        on my{" "}
        <a
          className={styles.inlineLink}
          href={links.youtube}
          rel="noreferrer"
          target="_blank"
        >
          <InlineImage
            alt=""
            grouped
            src="/images/About_me/youtube.svg"
          />
          <strong>YouTube,</strong>
        </a>{" "}
        where I share practical insights, experiments, and my perspective on
        how the industry is evolving. I also run a{" "}
        <a
          className={styles.inlineLink}
          href={links.telegramChannel}
          rel="noreferrer"
          target="_blank"
        >
          <InlineImage
            alt=""
            grouped
            src="/images/About_me/telegram.svg"
          />
          <strong>Telegram channel</strong>
        </a>{" "}
        for designers and tech enthusiasts.
      </p>

      <p>
        Outside of work, I enjoy playing
        <InlineImage alt="Tennis" src="/images/About_me/tennis.webp" />
        tennis, going to the
        <InlineImage alt="Gym" src="/images/About_me/gym.webp" />
        gym, and competing{" "}
        <br className={styles.desktopBreak} />
        <span
          className={`${styles.inlineGroup} ${styles.counterStrikeGroup}`}
        >
          <InlineImage alt="Gaming PC" grouped src="/images/About_me/pc.webp" />
          in Counter-Strike 2.
        </span>
      </p>
    </div>
  );
}
