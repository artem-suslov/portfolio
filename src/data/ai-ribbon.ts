/** Look and motion of the "Made with AI" label on the Animator card: a bookmark or a corner sash. Sizes are in pixels. */

export type AiRibbonVariant = "bookmark" | "corner";

/** How the label mixes with the fabric under it. */
export type AiRibbonTextBlend =
  | "color-dodge"
  | "hard-light"
  | "luminosity"
  | "multiply"
  | "normal"
  | "overlay"
  | "plus-lighter"
  | "screen"
  | "soft-light";

export type AiRibbon = {
  /** Vertical ripple of the bottom edge. */
  amplitude: number;
  colorDeep: string;
  colorLight: string;
  colorMid: string;
  /** Corner variant: from the card's corner to the band's centre line, along the diagonal. */
  cornerDistance: number;
  /** Corner variant: the band's thickness. */
  cornerThickness: number;
  /** Mix of a second, shorter ripple on top of the main one, 0–1. */
  detail: number;
  /** How fast the ripple grows from the attached top edge to the free bottom one; 1 is linear. */
  falloff: number;
  fontSize: number;
  fontWeight: number;
  /** How much gusts swell and calm the wind, 0–1. */
  gustiness: number;
  /** Seconds between gusts, roughly. */
  gustPeriod: number;
  height: number;
  /** Strength of the light on slopes facing up, 0–1. */
  highlight: number;
  /** From the card's left edge. */
  inset: number;
  /** In em. */
  letterSpacing: number;
  /** Depth of the V-notch in the bottom edge. */
  notch: number;
  /** How deeply the letters look pressed into the fabric, 0–1. */
  press: number;
  /** Seconds per wave in steady wind. */
  period: number;
  radius: number;
  /** Strength of the shade on slopes facing down, 0–1. */
  shadow: number;
  /** Gloss laid over fabric and letters alike, 0–1. */
  sheen: number;
  /** Side-to-side drift of the bottom edge. */
  sway: number;
  textBlend: AiRibbonTextBlend;
  textColor: string;
  /** Nudges the label up (negative) or down from the centre of the band above the notch. */
  textOffset: number;
  /** Below 1 the ribbon's colour shows through the letters. */
  textOpacity: number;
  /** Irregular noise mixed into the ripple, 0–1. */
  turbulence: number;
  /** How far the free end turns toward or away from the viewer, in radians. */
  twist: number;
  uppercase: boolean;
  /** A waving bookmark hanging from the top edge, or a sash across the corner. */
  variant: AiRibbonVariant;
  /** Wave length as a share of the ribbon's width. */
  wavelength: number;
  width: number;
};

// "Save to code" in the Ribbon DialKit panel rewrites everything between these markers.
// AI_RIBBON_START
export const aiRibbon: AiRibbon = {
  amplitude: 1.5,
  colorDeep: "#0061ca",
  colorLight: "#59b1ff",
  colorMid: "#0080e6",
  cornerDistance: 48,
  cornerThickness: 24,
  detail: 0.45,
  falloff: 0.9,
  fontSize: 10.5,
  fontWeight: 600,
  gustPeriod: 9,
  gustiness: 0.7,
  height: 33,
  highlight: 0.22,
  inset: 17,
  letterSpacing: 0.03,
  notch: 8,
  period: 2.3,
  press: 0.2,
  radius: 4,
  shadow: 0.13,
  sheen: 0.5,
  sway: 1.7,
  textBlend: "normal",
  textColor: "#ffffff",
  textOffset: 2.5,
  textOpacity: 0.84,
  turbulence: 0.35,
  twist: 0.49,
  uppercase: true,
  variant: "bookmark",
  wavelength: 0.7,
  width: 88,
};
// AI_RIBBON_END
