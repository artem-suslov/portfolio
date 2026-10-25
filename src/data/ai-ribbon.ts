/** Look and motion of the "Made with AI" bookmark on the Animator card. Sizes are in pixels. */

export type AiRibbon = {
  /** Vertical ripple of the bottom edge. */
  amplitude: number;
  colorDeep: string;
  colorLight: string;
  colorMid: string;
  /** How fast the ripple grows from the attached top edge to the free bottom one; 1 is linear. */
  falloff: number;
  fontSize: number;
  height: number;
  /** Strength of the light on slopes facing up, 0–1. */
  highlight: number;
  /** From the card's right edge. */
  inset: number;
  /** Depth of the V-notch in the bottom edge. */
  notch: number;
  /** Seconds per wave. */
  period: number;
  radius: number;
  /** Strength of the shade on slopes facing down, 0–1. */
  shadow: number;
  /** Side-to-side drift of the bottom edge. */
  sway: number;
  /** Wave length as a share of the ribbon's width. */
  wavelength: number;
  width: number;
};

// "Save to code" in the Ribbon DialKit panel rewrites everything between these markers.
// AI_RIBBON_START
export const aiRibbon: AiRibbon = {
  amplitude: 2.6,
  colorDeep: "#5b78f2",
  colorLight: "#9ad2ff",
  colorMid: "#6eaaff",
  falloff: 1.2,
  fontSize: 13,
  height: 46,
  highlight: 0.3,
  inset: 24,
  notch: 9,
  period: 2.6,
  radius: 7,
  shadow: 0.2,
  sway: 1.1,
  wavelength: 0.95,
  width: 116,
};
// AI_RIBBON_END
