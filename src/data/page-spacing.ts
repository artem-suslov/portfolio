/** Vertical spacing between the home page's sections below the page card, in pixels.
    The gap from the card to the craft grid is the craft grid's own `spacing`. */

export type PageSpacing = {
  /** Between the About Me heading and its text. */
  aboutHeadingGap: number;
  /** Between paragraphs of the About Me text. */
  aboutParagraphGap: number;
  /** From the bottom of the collage to the colophon. */
  aboutToColophon: number;
  /** Below the colophon, to the end of the page. */
  colophonBottom: number;
  /** From the craft grid to the About Me heading. */
  craftToAbout: number;
};

// "Save to code" in the Page spacing DialKit panel rewrites everything between these markers.
// PAGE_SPACING_START
export const pageSpacing: PageSpacing = {
  aboutHeadingGap: 12,
  aboutParagraphGap: 12,
  aboutToColophon: 100,
  colophonBottom: 81,
  craftToAbout: 120,
};
// PAGE_SPACING_END

/** The spacing as CSS custom properties for the page's root element. */
export function pageSpacingVars(spacing: PageSpacing) {
  return {
    "--page-about-heading-gap": `${spacing.aboutHeadingGap}px`,
    "--page-about-paragraph-gap": `${spacing.aboutParagraphGap}px`,
    "--page-about-to-colophon": `${spacing.aboutToColophon}px`,
    "--page-colophon-bottom": `${spacing.colophonBottom}px`,
    "--page-craft-to-about": `${spacing.craftToAbout}px`,
  };
}
