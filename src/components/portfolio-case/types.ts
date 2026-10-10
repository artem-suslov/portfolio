import type { StaticImageData } from "next/image";

export type CaseImageVariant =
  | "steamify"
  | "steamify-experiment"
  | "loop"
  | "ccp"
  | "safe";

export type CaseVideoVariant =
  | "loop"
  | "ccp"
  | "animator"
  | "steamify"
  | "quick-stickers"
  | "freelance-tracker";

export type CaseImageCover = {
  alt: string;
  eager?: boolean;
  height: number;
  mobileSrc?: string;
  sizes?: string;
  src: string | StaticImageData;
  type: "image";
  unoptimized?: boolean;
  variant: CaseImageVariant;
  width: number;
};

export type CaseVideoCover = {
  /** Clicking the cover opens the video in the expanded view. */
  expandable?: boolean;
  mobilePoster?: string;
  mobileSrc?: string;
  poster?: string;
  src: string;
  type: "video";
  variant: CaseVideoVariant;
};

export type CaseCover =
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
      // A bare screen capture placed on the native gray cover surface.
      alt: string;
      height: number;
      src: string | StaticImageData;
      type: "screen";
      width: number;
    }
  | { type: "interactive-card" }
  | { type: "phantom-glow" }
  | { type: "placeholder" }
  | CaseImageCover
  | CaseVideoCover;

export type CaseDetails = {
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

export type CoverExperiment = {
  id: string;
  newCover: CaseImageCover & { variant: "steamify-experiment" };
};

export type PortfolioCaseData = {
  /** No case page yet: hovering the cover shows a "coming soon" label. */
  comingSoon?: boolean;
  cover: CaseCover;
  coverExperiment?: CoverExperiment;
  /** Short caption under the cover, used when the card has no `details`. */
  description?: string;
  details?: CaseDetails;
  /** Internal case-study page; the whole card becomes a link to it. */
  href?: string;
  id: string;
  title: string;
};
