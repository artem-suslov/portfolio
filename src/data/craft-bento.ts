/** Smaller work below the case studies: craft cases and concept shots, in rows of tiles. */

export type CraftCaptions = "full" | "none" | "title";
export type CraftTileFit = "contain" | "cover";
export type CraftTilePosition = "bottom" | "center" | "left top" | "right top" | "top";

export type CraftTile = {
  /** Concept images only: crop to the tile, or show the whole shot. */
  fit: CraftTileFit;
  /** A case id from portfolio-cases.ts, a concept id from concepts.ts, or null for a blank tile. */
  id: string | null;
  /** Name in the dev panel. */
  label: string;
  /** Concept images only: which part of a cropped shot stays in view. */
  position: CraftTilePosition;
  /** Width at the full grid width; tiles in a row keep these proportions as the grid narrows. */
  width: number;
};

export type CraftBentoSettings = {
  captions: CraftCaptions;
  description: string;
  /** Between tiles in a row. */
  gap: number;
  heading: string;
  /** Between the heading block and the grid. */
  headerGap: number;
  /** The heading block lines up with the content column of the page card. */
  headerWidth: number;
  maxWidth: number;
  radius: number;
  /** Row height at the full grid width; rows scale with the grid below it. */
  rowHeight: number;
  /** Between rows. */
  rowGap: number;
  rows: CraftTile[][];
  /** Space between the page card and the heading. */
  spacing: number;
};

const tile = (
  label: string,
  id: string | null,
  width: number,
  media: Partial<Pick<CraftTile, "fit" | "position">> = {},
): CraftTile => ({ fit: "cover", id, label, position: "center", width, ...media });

// Paper: "Concepts and craft" frame, 1280px wide. "Save to code" in the dev DialKit panel
// (/api/debug/craft-bento) rewrites everything between the markers; keep them.
// CRAFT_BENTO_START
export const craftBento: CraftBentoSettings = {
  captions: "none",
  description:
    "I genuinely love this craft. Building concepts with AI is how I keep learning — here are a few of them.",
  gap: 16,
  heading: "Concepts and craft",
  headerGap: 32,
  headerWidth: 636,
  maxWidth: 1280,
  radius: 8,
  rowHeight: 400,
  rowGap: 15,
  rows: [
    [tile("1 · left", "telegram-quick-stickers", 658), tile("1 · right", "mesh-card-demo", 555)],
    [tile("2 · left", "concept-tov", 556), tile("2 · right", "steamify-case-2", 718)],
    [tile("3 · left", "glow-hover-effect", 266), tile("3 · right", "concept-whisp", 481)],
  ],
  spacing: 96,
};
// CRAFT_BENTO_END
