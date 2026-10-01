import styles from "./hero.module.css";
import { ContactButton } from "./contact-button";
import { HeroHeading } from "./hero-heading";
import { HeroVideo } from "./hero-video";
import { SoundToggleButton } from "./sound-toggle-button";

export function DefaultHero() {
  return (
    <header className={styles.intro}>
      <div className={styles.heroToolbar}>
        <div className={styles.heroIdentity}>
          <span className={styles.identityMark} aria-hidden="true" />
          <span className={styles.name}>Artem Suslov</span>
        </div>

        <div className={styles.heroActions}>
          <SoundToggleButton className={styles.iconButton} />
          <ContactButton className={styles.contactButton} />
        </div>
      </div>

      <div className={styles.heroContent}>
        <HeroVideo />
        <HeroHeading />
      </div>

      <span className={styles.heroDivider} aria-hidden="true" />
    </header>
  );
}
