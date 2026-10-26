import { TextLink } from "@/components/ui/text-link";
import { links } from "@/lib/site";
import styles from "./hero.module.css";

export function V2Description() {
  return (
    <div className={styles.v2Description}>
      <p>
        5+ years designing B2C products for web and mobile. At Kringga, I
        design Telegram Mini Apps and a channel analytics service, and ship
        the frontend to production myself. Before that: a gaming ecosystem at{" "}
        <TextLink href={links.steamify}>Steamify</TextLink>
        {" and a design system for "}
        <TextLink href={links.safe}>Safe</TextLink>.
      </p>
    </div>
  );
}
