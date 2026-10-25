/** Look and motion of the "Made with AI" bookmark on the Animator card. Sizes are in pixels. */

export type AiRibbon = {
  /** Vertical ripple of the bottom edge. */
  amplitude: number;
  colorDeep: string;
  colorLight: string;
  colorMid: string;
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
  /** Seconds per wave in steady wind. */
  period: number;
  radius: number;
  /** Strength of the shade on slopes facing down, 0–1. */
  shadow: number;
  /** Side-to-side drift of the bottom edge. */
  sway: number;
  textColor: string;
  /** Nudges the label up (negative) or down from the centre of the band above the notch. */
  textOffset: number;
  /** Irregular noise mixed into the ripple, 0–1. */
  turbulence: number;
  /** How far the free end turns toward or away from the viewer, in radians. */
  twist: number;
  uppercase: boolean;
  /** Wave length as a share of the ribbon's width. */
  wavelength: number;
  width: number;
};

// "Save to code" in the Ribbon DialKit panel rewrites everything between these markers.
// AI_RIBBON_START
export const aiRibbon: AiRibbon = {
  amplitude: 1.3,
  colorDeep: "#2923d4",
  colorLight: "#c5e5ff",
  colorMid: "#2484ff",
  detail: 0.45,
  falloff: 0.9,
  fontSize: 11,
  fontWeight: 700,
  gustiness: 0.5,
  gustPeriod: 4,
  height: 38,
  highlight: 0.22,
  inset: 10,
  letterSpacing: 0.01,
  notch: 8,
  period: 1.9,
  radius: 0,
  shadow: 0.13,
  sway: 2.9,
  textColor: "#ffffff",
  textOffset: 1.5,
  turbulence: 0.35,
  twist: 0.25,
  uppercase: true,
  wavelength: 0.7,
  width: 102,
};
// AI_RIBBON_END
