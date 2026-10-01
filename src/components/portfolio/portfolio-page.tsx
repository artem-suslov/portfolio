import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/motion-provider";
import { PortfolioCase } from "@/components/portfolio-case/portfolio-case";
import { SoundProvider } from "@/components/sound/sound-provider";
import { portfolioCases, portfolioTabs } from "@/data/portfolio-cases";
import { AboutMeContent } from "./about-me-content";
import styles from "./portfolio-page.module.css";
import { PortfolioTabs } from "./portfolio-tabs";

const casesById = new Map(portfolioCases.map((portfolioCase) => [portfolioCase.id, portfolioCase]));

function WorkList({ caseIds }: { caseIds: readonly string[] }) {
  return (
    <section className={styles.work} id="work" aria-label="Selected work">
      {caseIds.map((caseId) => {
        const portfolioCase = casesById.get(caseId);
        return portfolioCase ? <PortfolioCase key={caseId} {...portfolioCase} /> : null;
      })}
    </section>
  );
}

const tabPanels = Object.fromEntries(
  portfolioTabs.map(({ caseIds, id }) => [id, <WorkList caseIds={caseIds} key={id} />]),
) as Record<(typeof portfolioTabs)[number]["id"], ReactNode>;

export async function PortfolioPage({
  hero,
  showAbout = true,
  showTabs = true,
  variant = "default",
}: {
  hero: ReactNode;
  showAbout?: boolean;
  showTabs?: boolean;
  variant?: "default" | "v2";
}) {
  const DebugPanel =
    process.env.NODE_ENV === "development"
      ? (await import("@/components/portfolio-case/portfolio-debug-panel")).PortfolioDebugPanel
      : null;

  return (
    <main className={styles.viewport}>
      <SoundProvider>
        <MotionProvider>
          <article
            className={
              variant === "v2" ? `${styles.portfolio} ${styles.v2Portfolio}` : styles.portfolio
            }
          >
            {hero}
            <PortfolioTabs
              panelClassName={styles.tabPanel}
              panels={tabPanels}
              showTabs={showTabs}
              tabs={portfolioTabs}
              tabsClassName={styles.heroTabs}
            />
            {portfolioCases.map(({ id }) => (
              <span className={styles.anchor} id={id} key={id} aria-hidden="true" />
            ))}
            <span className={styles.anchor} id="tools" aria-hidden="true" />
          </article>

          {showAbout ? (
            <section className={styles.aboutSection} aria-labelledby="about-me">
              <h2 className={styles.aboutHeading} id="about-me">
                About Me
              </h2>
              <AboutMeContent />
            </section>
          ) : null}
          {DebugPanel ? (
            <DebugPanel cases={portfolioCases.map(({ id, title }) => ({ id, label: title }))} />
          ) : null}
        </MotionProvider>
      </SoundProvider>
    </main>
  );
}
