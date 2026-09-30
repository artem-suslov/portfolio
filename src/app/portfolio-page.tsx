import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import safeDesignSystemThumbnail from "../../public/images/safe_design_system_thumbnail.png";
// Imported so the URL carries a content hash: replacing the file busts the image cache.
import steamifyCashoutPhones from "../../public/images/steamify_cashout_phones.jpg";
import steamifyTradingBotScreen from "../../public/images/steamify_trading_bot_4.jpg";
import styles from "./page.module.css";
import { AboutMeContent } from "./about-me-content";
import { PortfolioCase } from "./portfolio-case";
import { SoundProvider } from "./sound-provider";
import {
  PortfolioTabList,
  PortfolioTabPanels,
  PortfolioTabsProvider,
} from "./portfolio-tabs";

const workTabs = [
  { id: "case-study", label: "Work" },
  { id: "craft", label: "Craft" },
  { id: "my-products", label: "My products" },
];

type CaseDetails = {
  company: string;
  companyHref?: string;
  description: string;
  descriptionLink?: {
    href: string;
    label: string;
  };
  period: string;
  role: string;
  showMetadata?: boolean;
  title: string;
};

const portfolioCases: Array<{
  accent?: string;
  cover:
    | {
        foreground?: {
          alt: string;
          height: number;
          src: string;
          width: number;
        };
        src: string;
        type: "background";
      }
    | {
        alt: string;
        eager?: boolean;
        height: number;
        mobileSrc?: string;
        src: string | StaticImageData;
        type: "image";
        unoptimized?: boolean;
        variant: "steamify" | "steamify-experiment" | "loop" | "ccp" | "safe";
        width: number;
      }
    | {
        alt: string;
        height: number;
        src: string | StaticImageData;
        type: "screen";
        width: number;
      }
    | { type: "interactive-card" }
    | { type: "phantom-glow" }
    | { type: "placeholder" }
    | {
        mobilePoster?: string;
        mobileSrc?: string;
        poster?: string;
        src: string;
        type: "video";
        variant:
          | "loop"
          | "ccp"
          | "animator"
          | "steamify"
          | "quick-stickers"
        | "freelance-tracker";
      };
  coverExperiment?: {
    id: string;
    newCover: {
      alt: string;
      height: number;
      mobileSrc?: string;
      src: string;
      type: "image";
      variant: "steamify-experiment";
      width: number;
    };
  };
  id: string;
  details?: CaseDetails;
  description?: string;
  href?: string;
  metadata?: string[];
  metadataLinks?: Array<{
    href: string;
    item: string;
  }>;
  title: string | false;
  titleLink?: string;
}> = [
  {
    cover: {
      poster: "/images/video-posters/telegram-quick-stickers.webp",
      src: "/videos/telegram-quick-stickers.mp4?v=20260903-fs",
      type: "video",
      variant: "quick-stickers",
    },
    id: "telegram-quick-stickers",
    details: {
      company: "Personal concept",
      companyHref: "https://github.com/artew07/tg-attach-stickers",
      description:
        "Rebuilt Telegram’s iOS chat in UIKit and explored a quicker way to send stickers: press, slide, release. A long press on the sticker button fans out four choices; releasing on one sends it straight into the chat. Built with Codex.",
      period: "2026",
      role: "Design Engineer",
      showMetadata: false,
      title: "Quick stickers for Telegram on iPhone",
    },
    title: "Quick stickers for Telegram on iPhone",
  },
  {
    cover: {
      poster: "/images/video-posters/freelance-tracker.webp",
      src: "/videos/freelance_tracker_demo_2.mp4?v=20260903-fs",
      type: "video",
      variant: "freelance-tracker",
    },
    description:
      "A personal macOS app for freelance work that brings time, project rates, and earnings into one place — making workload and monthly income easier to plan with confidence.",
    id: "freelance-tracker",
    title: "Personal freelance tracker",
  },
  {
    accent: "20% to 50%",
    // Static cover retained for a quick rollback.
    // cover: {
    //   alt: "",
    //   eager: true,
    //   height: 302,
    //   src: "/images/steamify_2.webp",
    //   type: "image",
    //   unoptimized: true,
    //   variant: "steamify",
    //   width: 494,
    // },
    // Video cover retained for a quick rollback.
    // cover: {
    //   poster: "/images/video-posters/steamify.webp",
    //   src: "/videos/steamify_thumb_case.mp4?v=20260903-fs",
    //   type: "video",
    //   variant: "steamify",
    // },
    // A/B-test configuration retained for a quick rollback.
    // coverExperiment: {
    //   id: "steamify-cover-v1",
    //   newCover: {
    //     alt: "Steamify payout flow before and after introducing an earlier Telegram offer",
    //     height: 620,
    //     mobileSrc: "/images/steamify-case-v2/steamify_thumb_2_mobile.png?v=20260910-1302",
    //     src: "/images/steamify_thumb_2.png",
    //     type: "image",
    //     variant: "steamify-experiment",
    //     width: 1272,
    //   },
    // },
    cover: {
      alt: "Steamify cashout flow across mobile screens",
      height: steamifyCashoutPhones.height,
      src: steamifyCashoutPhones,
      type: "image",
      variant: "steamify-experiment",
      width: steamifyCashoutPhones.width,
    },
    id: "steamify-case",
    details: {
      company: "Steamify",
      companyHref: "https://steamify.io/cashout/cs2",
      description:
        "Redesigned the payout waiting step to introduce Telegram earlier, using usability testing and A/B-tested offers to raise web-to-Telegram conversion from 20% to 50%.",
      period: "2024–2025",
      role: "Product Designer",
      title: "How I turned payout waiting into Telegram conversion",
    },
    href: "/steamify-skins-cashout",
    metadata: ["Steamify", "2024"],
    metadataLinks: [
      {
        href: "https://steamify.io/cashout/cs2",
        item: "Steamify",
      },
    ],
    title: "How I turned payout waiting into Telegram conversion",
  },
  {
    cover: { type: "interactive-card" },
    description:
      "An interactive card experiment that explores how Paper Shaders can turn a familiar payment surface into a tactile, playful object.",
    id: "mesh-card-demo",
    title: "Interactive bank card built with Paper Shaders",
  },
  {
    cover: { alt: "", height: 1393, src: "/images/loop_case.png?v=20260706-2", type: "image", variant: "loop", width: 2544 },
    description:
      "A UI exploration for supervising AI agents — designed to make parallel runs, statuses, and handoffs easy to scan at a glance.",
    id: "steamify-case-2",
    title: "Workspace for managing AI agents",
  },
  {
    cover: {
      mobilePoster: "/images/video-posters/animator-mobile.webp",
      mobileSrc: "/videos/animator_demo_mobile.mp4?v=20260903-fs",
      poster: "/images/video-posters/animator.webp",
      src: "/videos/animator_demo.mp4?v=20260903-fs",
      type: "video",
      variant: "animator",
    },
    id: "animator",
    details: {
      company: "Animator",
      companyHref: "https://getanimator.xyz/",
      description:
        "Designed and built Animator from scratch — a browser-based tool for creating looping MP4 showcases.",
      descriptionLink: {
        href: "https://youtu.be/d9Nve2VaHQ4?si=Jy_Wdt_buRd10kKW",
        label: "Watch how I built it",
      },
      period: "2026",
      role: "Design Engineer",
      title: "Tool for creating looping MP4 showcases",
    },
    href: "/animator",
    title: "Tool for creating looping MP4 showcases",
  },
  {
    cover: {
      alt: "",
      height: 697,
      src: safeDesignSystemThumbnail,
      type: "image",
      variant: "safe",
      width: 1272,
    },
    id: "ccp-design-system",
    details: {
      company: "Safe {Wallet}",
      companyHref: "https://safe.global/",
      description:
        "Designed and evolved an open-source design system for Safe, creating reusable foundations and components used by 1,500+ people. The release received 85+ likes on Figma Community and reached 33,000 people on X.",
      period: "2023",
      role: "Product Designer",
      title: "Open-source design system used by 1,500+ people",
    },
    title: "Open-source design system used by 1,500+ people",
  },
  {
    cover: {
      alt: "Steam trading management dashboard overview",
      height: steamifyTradingBotScreen.height,
      src: steamifyTradingBotScreen,
      type: "screen",
      width: steamifyTradingBotScreen.width,
    },
    id: "orbit",
    details: {
      company: "Steamify",
      companyHref: "https://steamify.io/cashout/cs2",
      description:
        "Designed a centralized dashboard for managing Steam trading operations, bringing inventory, listings, and transactions into one workspace.",
      period: "2023",
      role: "Product Designer",
      title: "Steam trading management dashboard",
    },
    title: "Steam trading management dashboard",
  },
  // Hidden for now; uncomment together with "northstar" in the case-study tab.
  // {
  //   cover: {
  //     foreground: {
  //       alt: "Playdex game marketplace",
  //       height: 1038,
  //       src: "/images/playdex_thumbnail.webp",
  //       width: 1600,
  //     },
  //     src: "/images/AI_Bg_051.png",
  //     type: "background",
  //   },
  //   id: "northstar",
  //   details: {
  //     company: "Playdex",
  //     description:
  //       "Designed a Web3 NFT marketplace for gamers in Asia, making it easier to discover and rent in-game assets.",
  //     period: "2023",
  //     role: "Product Designer",
  //     title: "Web3 NFT marketplace for gamers in Asia",
  //   },
  //   title: "Web3 NFT marketplace for gamers in Asia",
  // },
  {
    cover: { poster: "/images/video-posters/ccp-white.webp", src: "/videos/CCP_White_BG_compress.mp4?v=20261001-fs", type: "video", variant: "ccp" },
    id: "s7-case",
    details: {
      company: "KOTELOV",
      companyHref: "https://kotelov.com/",
      description:
        "Flight attendants spent 30–60 minutes after each flight completing paper documentation by hand. I designed an offline iPad workflow that reduced this to 5 minutes, with over 60% of tasks now completed directly in the app.",
      period: "2020",
      role: "Product Designer",
      title: "Offline iPad app for flight attendants",
    },
    title: "Offline iPad app for flight attendants",
  },
  {
    cover: { type: "phantom-glow" },
    description:
      "A motion and lighting study that uses a responsive glow to give the Phantom mark depth, focus, and a sense of movement.",
    id: "glow-hover-effect",
    title: "Interactive Phantom logo hover effect",
  },
];

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
      ? (await import("@/components/portfolio-debug-panel")).PortfolioDebugPanel
      : null;

  function renderWork(caseIds: string[]) {
    const selectedCases = caseIds.flatMap((caseId) => {
      const portfolioCase = portfolioCases.find(({ id }) => id === caseId);
      return portfolioCase ? [portfolioCase] : [];
    });

    return (
      <section className={styles.work} id="work" aria-label="Selected work">
        {selectedCases.map(
          ({ accent, cover, coverExperiment, description, details, href, id, metadata, metadataLinks, title, titleLink }) => (
            <PortfolioCase
              accent={accent}
              caseId={id}
              cover={cover}
              coverExperiment={coverExperiment}
              description={description}
              details={details}
              href={href}
              key={id}
              metadata={metadata}
              metadataLinks={metadataLinks}
              title={title}
              titleLink={titleLink}
            />
          ),
        )}
      </section>
    );
  }

  return (
    <main className={styles.viewport}>
      <SoundProvider>
        <PortfolioTabsProvider>
          <article
            className={`${styles.portfolio} ${
              variant === "v2" ? styles.v2Portfolio : ""
            }`}
          >
            {hero}
            {showTabs ? (
              <div className={styles.heroTabs}>
                <PortfolioTabList tabs={workTabs} />
              </div>
            ) : null}
            <PortfolioTabPanels
              panels={{
                "case-study": renderWork([
                  "steamify-case",
                  "orbit",
                  "s7-case",
                  "ccp-design-system",
                  // "northstar",
                ]),
                "my-products": renderWork(["animator"]),
                craft: renderWork([
                  "telegram-quick-stickers",
                  "freelance-tracker",
                  "mesh-card-demo",
                  "steamify-case-2",
                  "glow-hover-effect",
                ]),
              }}
            />
            {portfolioCases.map(({ id }) => <span className={styles.anchor} id={id} key={id} aria-hidden="true" />)}
            <span className={styles.anchor} id="tools" aria-hidden="true" />
          </article>

          {showAbout ? (
            <section className={styles.aboutSection} aria-labelledby="about-me">
              <h2 className={styles.aboutHeading} id="about-me">About Me</h2>
              <AboutMeContent />
            </section>
          ) : null}
          {DebugPanel ? <DebugPanel cases={portfolioCases.map(({ id, title }) => ({ id, label: title || id }))} /> : null}
        </PortfolioTabsProvider>
      </SoundProvider>
    </main>
  );
}
