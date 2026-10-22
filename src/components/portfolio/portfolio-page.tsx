import type { CSSProperties, ReactNode } from "react";
import { FeedbackWidget } from "@/components/feedback/feedback-widget";
import { SocialPreviewLink } from "@/components/hero/social-preview-link";
import { MotionProvider } from "@/components/motion/motion-provider";
import { PortfolioCase } from "@/components/portfolio-case/portfolio-case";
import { SoundProvider } from "@/components/sound/sound-provider";
import { TextLink } from "@/components/ui/text-link";
import { pageSpacing, pageSpacingVars } from "@/data/page-spacing";
import { portfolioCases, workCaseIds } from "@/data/portfolio-cases";
import { links } from "@/lib/site";
import { AboutCollage } from "./about-collage";
import { Colophon } from "./colophon";
import { CraftBento } from "./craft-bento";
import { HomeScrollRestore } from "./home-scroll-restore";
import styles from "./portfolio-page.module.css";

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

export async function PortfolioPage({
  hero,
  showAbout = true,
  variant = "default",
}: {
  hero: ReactNode;
  showAbout?: boolean;
  variant?: "default" | "v2";
}) {
  const DebugPanel =
    process.env.NODE_ENV === "development"
      ? (await import("@/components/portfolio-case/portfolio-debug-panel")).PortfolioDebugPanel
      : null;
  // In development the grid, the About Me collage and the section spacing come with live
  // DialKit controls.
  const CraftSection =
    process.env.NODE_ENV === "development"
      ? (await import("./craft-bento-debug")).CraftBentoDebug
      : CraftBento;
  const AboutSection =
    process.env.NODE_ENV === "development"
      ? (await import("./about-collage-debug")).AboutCollageDebug
      : AboutCollage;
  const SpacingPanel =
    process.env.NODE_ENV === "development"
      ? (await import("./page-spacing-debug")).PageSpacingDebug
      : null;

  return (
    <main className={styles.viewport} style={pageSpacingVars(pageSpacing) as CSSProperties}>
      <HomeScrollRestore />
      <SoundProvider>
        <MotionProvider>
          <article
            className={
              variant === "v2" ? `${styles.portfolio} ${styles.v2Portfolio}` : styles.portfolio
            }
          >
            {hero}
            <WorkList caseIds={workCaseIds} />
            {portfolioCases.map(({ id }) => (
              <span className={styles.anchor} id={id} key={id} aria-hidden="true" />
            ))}
            <span className={styles.anchor} id="tools" aria-hidden="true" />
          </article>

          <CraftSection />

          {showAbout ? (
            <section className={styles.aboutSection} aria-labelledby="about-me">
              <h2 className={styles.aboutHeading} id="about-me">
                About Me
              </h2>
              <div className={styles.aboutBody}>
                <p className={styles.aboutText}>
                  I was born and raised in Saint Petersburg. In 2020 I got hooked on UX/UI design, and
                  it&apos;s been a big part of my life ever since. I still genuinely love what I do.
                </p>
                <p className={styles.aboutText}>
                  I started out with simple landing pages, banners, and business cards in Photoshop.
                  The projects have grown a lot since then, but the excitement hasn&apos;t worn off: I
                  still learn something new about design every day, collect inspiration everywhere, and
                  keep trying small experiments. Every day I try to be a bit better than yesterday and
                  give the work everything I&apos;ve got.
                </p>
                <p className={styles.aboutText}>
                  I also share practical insights on{" "}
                  <SocialPreviewLink href={links.youtube} previewSrc="/videos/youtube_tooltip.mp4">
                    YouTube
                  </SocialPreviewLink>{" "}
                  and run a <TextLink href={links.telegramChannel}>Telegram</TextLink> channel for
                  designers and tech enthusiasts. Off the screen, I play tennis, go to the gym, and
                  compete in Counter-Strike 2.
                </p>
              </div>
              <AboutSection />
            </section>
          ) : null}
          <Colophon className={styles.colophon} />
          <FeedbackWidget />
          {SpacingPanel ? <SpacingPanel /> : null}
          {DebugPanel ? (
            <DebugPanel cases={portfolioCases.map(({ id, title }) => ({ id, label: title }))} />
          ) : null}
        </MotionProvider>
      </SoundProvider>
    </main>
  );
}
