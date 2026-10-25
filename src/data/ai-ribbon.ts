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
  /** From the card's left edge. */
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
  amplitude: 1.3,
  colorDeep: "#2923d4",
  colorLight: "#c5e5ff",
  colorMid: "#2484ff",
  falloff: 0.9,
  fontSize: 13,
  height: 38,
  highlight: 0.22,
  inset: 10,
  notch: 8,
  period: 1.9,
  radius: 0,
  shadow: 0.13,
  sway: 1.3,
  wavelength: 0.7,
  width: 102,
};
// AI_RIBBON_END
