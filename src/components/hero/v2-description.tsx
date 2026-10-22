import { TextLink } from "@/components/ui/text-link";
import { links } from "@/lib/site";
import styles from "./hero.module.css";

export function V2Description() {
  return (
    <div className={styles.v2Description}>
      <p>
        I have 5+ years of experience designing B2C products for web and
        mobile. Now at Kringga agency, I design a Telegram channel
        analytics service and Mini Apps. Previously, I worked at <TextLink href={links.steamify}>Steamify</TextLink>
        {" on a gaming ecosystem and built a design system for "}
        <TextLink href={links.safe}>Safe</TextLink>
        {" on contract."}
      </p>
    </div>
  );
}
