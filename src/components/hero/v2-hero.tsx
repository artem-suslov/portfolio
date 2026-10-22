import { AiToolChip } from "./ai-tool-chip";
import { ContactButton } from "./contact-button";
import styles from "./hero.module.css";
import { HeroVideo } from "./hero-video";
import { ResumeButton } from "./resume-button";
import { SoundToggleButton } from "./sound-toggle-button";
import { V2Description } from "./v2-description";

export function V2Hero() {
  return (
    <header className={styles.v2Hero}>
      <div className={styles.v2Toolbar}>
        <HeroVideo compact />
        <SoundToggleButton />
      </div>
      <div className={styles.v2Content}>
        <h1 className={styles.v2Name}>
          Artem Suslov, a Product Designer{" "}
          <span className={styles.v2NameBreak}>
            who can ship frontend with <AiToolChip />
          </span>
        </h1>
        <V2Description />
        <div className={styles.v2Actions}>
          <ResumeButton />
          <ContactButton />
        </div>
      </div>
    </header>
  );
}
