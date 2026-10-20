import { links } from "@/lib/site";
import type { PortfolioCaseData } from "@/components/portfolio-case/types";
import safeDesignSystemThumbnail from "../../public/images/safe_thumb_case.png";
// Imported so the URL carries a content hash: replacing the file busts the image cache.
import steamifyCashoutPhones from "../../public/images/cashout_thumb_case.png";
import steamifyTradingBotScreen from "../../public/images/tradingbot_thumb_case.png";

export const portfolioCases: PortfolioCaseData[] = [
  {
    cover: {
      poster: "/images/video-posters/telegram-quick-stickers.webp?v=20261015-4",
      src: "/videos/telegram-quick-stickers.mp4?v=20261015-4",
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
  // Hidden for now; add "freelance-tracker" to `craftBento` in src/data/craft-bento.ts too.
  // {
  //   cover: {
  //     poster: "/images/video-posters/freelance-tracker.webp",
  //     src: "/videos/freelance_tracker_demo_2.mp4?v=20260903-fs",
  //     type: "video",
  //     variant: "freelance-tracker",
  //   },
  //   description:
  //     "A personal macOS app for freelance work that brings time, project rates, and earnings into one place — making workload and monthly income easier to plan with confidence.",
  //   id: "freelance-tracker",
  //   title: "Personal freelance tracker",
  // },
  {
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
      companyHref: links.steamify,
      description:
        "Redesigned the payout waiting step to introduce Telegram earlier, using usability testing and A/B-tested offers to raise web-to-Telegram conversion from 20% to 50%.",
      period: "2025",
      role: "Product Designer",
      title: "How I turned payout waiting into Telegram conversion",
    },
    href: "/steamify-skins-cashout",
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
      poster: "/images/video-posters/animator.webp?v=20261012",
      src: "/videos/animator_thumb_demo.mp4?v=20261012-2",
      type: "video",
      variant: "animator",
    },
    id: "animator",
    details: {
      company: "Personal project · Live",
      companyHref: "https://getanimator.xyz/",
      companyLabel: "Project",
      description:
        "Designed and built Animator solo with AI (Codex): a browser-based tool for creating looping MP4 showcases. Since launch: ~1,100 users, 81 sign-ups, and 165 MP4 exports.",
      descriptionLink: {
        href: "https://youtu.be/d9Nve2VaHQ4?si=Jy_Wdt_buRd10kKW",
        label: "Watch how I built it",
      },
      period: "2026",
      role: "Design Engineer",
      title: "Animator: a looping MP4 tool I designed and built with AI",
    },
    href: "/animator",
    title: "Animator: a looping MP4 tool I designed and built with AI",
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
      companyHref: links.safe,
      description:
        "Designed and evolved an open-source design system for Safe, creating reusable foundations and components used by 1,400+ people. The release received 85+ likes on Figma Community and got 33,000+ views on X.",
      period: "2023",
      role: "Product Designer",
      title: "Open-source design system used by 1,400+ people",
    },
    href: "/safe-design-system",
    title: "Open-source design system used by 1,400+ people",
  },
  {
    cover: {
      alt: "Steam trading management dashboard overview",
      height: steamifyTradingBotScreen.height,
      // Phones get a crop of the screen that matches their 37:30 cover frame.
      mobileSrc: "/images/Concept/tradingbot_thumb_case_mobile.png?v=20261015",
      src: steamifyTradingBotScreen,
      type: "image",
      // The exported cover carries its own gray surface, so it fills the frame like Safe's.
      variant: "dashboard",
      width: steamifyTradingBotScreen.width,
    },
    id: "orbit",
    details: {
      company: "Steamify",
      companyHref: links.steamify,
      description:
        "Designed a centralized dashboard for managing Steam trading operations, bringing inventory, listings, and transactions into one workspace.",
      period: "2023–2024",
      role: "Product Designer",
      title: "Steam trading management dashboard",
    },
    href: "/steamify-trading-bot",
    title: "Steam trading management dashboard",
  },
  // Hidden for now; uncomment together with "northstar" in `workCaseIds`.
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
    cover: {
      poster: "/images/video-posters/ccp-white.webp",
      src: "/videos/CCP_White_BG_compress.mp4?v=20261001-2",
      type: "video",
      variant: "ccp",
    },
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

/** Case studies, shown as full-width cards at the top of the page. */
export const workCaseIds = [
  "steamify-case",
  "animator",
  "orbit",
  "s7-case",
  "ccp-design-system",
  // "northstar",
] as const;
