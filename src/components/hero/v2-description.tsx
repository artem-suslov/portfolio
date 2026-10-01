import { TextLink } from "@/components/ui/text-link";
import { links } from "@/lib/site";
import styles from "./hero.module.css";
import { SocialPreviewLink } from "./social-preview-link";

export function V2Description() {
  return (
    <div className={styles.v2Description}>
      <p>
        I have 5+ years of experience. I explore product design, AI, and
        emerging technologies to create better digital experiences. Previously,
        I worked at <TextLink href={links.steamify}>Steamify</TextLink>
        {", where I built an ecosystem for gamers. I've also designed products for crypto companies like "}
        <TextLink href={links.safe}>Safe</TextLink>
        {", with hands-on experience in Web3, wallets, and digital assets."}
      </p>
      <p>
        I also share practical insights on{" "}
        <SocialPreviewLink
          href={links.youtube}
          previewSrc="/videos/youtube_tooltip.mp4"
        >
          YouTube
        </SocialPreviewLink>{" "}
        and run a <TextLink href={links.telegramChannel}>Telegram</TextLink>{" "}
        channel for designers and tech enthusiasts. Outside of work, I play
        tennis, go to the gym, and compete in Counter-Strike 2.
      </p>
    </div>
  );
}
