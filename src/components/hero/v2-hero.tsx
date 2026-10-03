import { ContactButton } from "./contact-button";
import styles from "./hero.module.css";
import { HeroVideo } from "./hero-video";
import { ResumeButton } from "./resume-button";
import { SoundToggleButton } from "./sound-toggle-button";
import { V2Description } from "./v2-description";

export function V2Hero({ showDivider = true }: { showDivider?: boolean }) {
  return (
    <header className={styles.v2Hero}>
      <div className={styles.v2Toolbar}>
        <HeroVideo compact />
        <SoundToggleButton />
      </div>
      <div className={styles.v2Content}>
        <div className={styles.v2Identity}>
          <h1 className={styles.v2Name}>Artem Suslov, a Product Designer</h1>
          <p className={styles.v2Tagline}>
            Designing B2C products for Web and Mobile
          </p>
        </div>
        <V2Description />
        <div className={styles.v2Actions}>
          <ResumeButton />
          <ContactButton />
        </div>
      </div>
      {showDivider ? <span className={styles.v2Divider} aria-hidden="true" /> : null}
    </header>
  );
}
