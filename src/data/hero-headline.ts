/** Typography of the home page headline ("Artem Suslov, a Product Designer who can ship
    frontend") and its gap to the description below. Sizes are in pixels, letter spacing in em. */

export type HeroHeadline = {
  /** Between the headline and the description. */
  descriptionGap: number;
  /** Puts "who can ship frontend" on its own line on desktop too (phones always break). */
  desktopBreak: boolean;
  fontSize: number;
  fontWeight: number;
  /** In em. */
  letterSpacing: number;
  lineHeight: number;
  mobileFontSize: number;
  mobileLineHeight: number;
};

// "Save to code" in the Headline DialKit panel rewrites everything between these markers.
// HERO_HEADLINE_START
export const heroHeadline: HeroHeadline = {
  descriptionGap: 16,
  desktopBreak: true,
  fontSize: 28,
  fontWeight: 500,
  letterSpacing: -0.03,
  lineHeight: 34,
  mobileFontSize: 18,
  mobileLineHeight: 22,
};
// HERO_HEADLINE_END

/** The headline settings as CSS custom properties for the page's root element. */
export function heroHeadlineVars(headline: HeroHeadline) {
  return {
    "--hero-name-break": headline.desktopBreak ? "block" : "inline",
    "--hero-name-description-gap": `${headline.descriptionGap}px`,
    "--hero-name-font-size": `${headline.fontSize}px`,
    "--hero-name-font-weight": `${headline.fontWeight}`,
    "--hero-name-letter-spacing": `${headline.letterSpacing}em`,
    "--hero-name-line-height": `${headline.lineHeight}px`,
    "--hero-name-mobile-font-size": `${headline.mobileFontSize}px`,
    "--hero-name-mobile-line-height": `${headline.mobileLineHeight}px`,
  };
}
