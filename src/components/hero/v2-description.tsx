import { TextLink } from "@/components/ui/text-link";
import { links } from "@/lib/site";
import styles from "./hero.module.css";

export function V2Description() {
  return (
    <div className={styles.v2Description}>
      <p>
        I have 5+ years of experience designing B2C products for web and
        mobile. I explore product design, AI, and emerging technologies to
        create better digital experiences. Previously, I worked at <TextLink href={links.steamify}>Steamify</TextLink>
        {", where I designed products for a gaming ecosystem. I've also designed products for crypto companies like "}
        <TextLink href={links.safe}>Safe</TextLink>
        {", with hands-on experience in Web3, wallets, and digital assets."}
      </p>
    </div>
  );
}
