/** Typography of the home page headline ("Artem Suslov, a Product Designer who can ship
    frontend") and its gap to the tagline. Sizes are in pixels, letter spacing in em. */

export type HeroHeadline = {
  /** Puts "who can ship frontend" on its own line on desktop too (phones always break). */
  desktopBreak: boolean;
  fontSize: number;
  fontWeight: number;
  /** In em. */
  letterSpacing: number;
  lineHeight: number;
  mobileFontSize: number;
  mobileLineHeight: number;
  /** Between the headline and the tagline. */
  taglineGap: number;
};

// "Save to code" in the Headline DialKit panel rewrites everything between these markers.
// HERO_HEADLINE_START
export const heroHeadline: HeroHeadline = {
  desktopBreak: false,
  fontSize: 18,
  fontWeight: 500,
  letterSpacing: -0.02,
  lineHeight: 24,
  mobileFontSize: 18,
  mobileLineHeight: 22,
  taglineGap: 4,
};
// HERO_HEADLINE_END

/** The headline settings as CSS custom properties for the page's root element. */
export function heroHeadlineVars(headline: HeroHeadline) {
  return {
    "--hero-name-break": headline.desktopBreak ? "block" : "inline",
    "--hero-name-font-size": `${headline.fontSize}px`,
    "--hero-name-font-weight": `${headline.fontWeight}`,
    "--hero-name-letter-spacing": `${headline.letterSpacing}em`,
    "--hero-name-line-height": `${headline.lineHeight}px`,
    "--hero-name-mobile-font-size": `${headline.mobileFontSize}px`,
    "--hero-name-mobile-line-height": `${headline.mobileLineHeight}px`,
    "--hero-name-tagline-gap": `${headline.taglineGap}px`,
  };
}
