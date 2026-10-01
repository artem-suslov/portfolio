// The Phantom logo outline, drawn in a 1823 × 1518 view box.
export const PHANTOM_VIEW_BOX = { height: 1518, width: 1823 } as const;

export const phantomPath =
  "M215.715 1518C448.348 1518 623.175 1315.69 727.504 1155.83C714.817 1191.2 707.769 1226.56 707.769 1260.52C707.769 1353.89 761.343 1420.39 867.089 1420.39C1012.3 1420.39 1167.4 1293.06 1247.76 1155.83C1242.12 1175.64 1239.3 1194.03 1239.3 1211C1239.3 1276.08 1275.96 1317.11 1350.68 1317.11C1586.13 1317.11 1823 899.767 1823 534.766C1823 250.406 1679.19 0 1318.26 0C683.798 0 0 775.271 0 1276.08C0 1472.73 105.742 1518 215.715 1518ZM1099.72 503.642C1099.72 432.906 1139.2 383.391 1197.01 383.391C1253.4 383.391 1292.88 432.906 1292.88 503.642C1292.88 574.379 1253.4 625.308 1197.01 625.308C1139.2 625.308 1099.72 574.379 1099.72 503.642ZM1401.44 503.642C1401.44 432.906 1440.92 383.391 1498.72 383.391C1555.12 383.391 1594.59 432.906 1594.59 503.642C1594.59 574.379 1555.12 625.308 1498.72 625.308C1440.92 625.308 1401.44 574.379 1401.44 503.642Z";

export const defaultPhantomGlowSettings = {
  blur: 53,
  brightness: 1.25,
  glowColor: "#614fee",
  isOutlineGlow: true,
  logoColor: "#0b0b0e",
  opacity: 0.92,
  outlineWidth: 2,
  radius: 150,
  saturation: 0.85,
  scale: 0.65,
};

export type PhantomGlowSettings = typeof defaultPhantomGlowSettings;

/** Offset of the gradient's middle stop: more blur moves it towards the center. */
export function getGlowMiddleStop(blur: number) {
  return Math.min(0.86, Math.max(0.16, 1 - blur / 72));
}
