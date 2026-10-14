/** Grid of smaller work below the case studies: craft cases and concept shots. */

export type CraftCaptions = "full" | "none" | "title";
export type CraftTileFit = "contain" | "cover";

export type CraftTileLayout = {
  cols: number;
  /** Concept images only: crop to the tile, or show the whole shot. */
  fit: CraftTileFit;
  hidden: boolean;
  /** A case id from portfolio-cases.ts or a concept id from concepts.ts. */
  id: string;
  /** Name in the dev panel. */
  label: string;
  rows: number;
};

export type CraftBentoSettings = {
  captions: CraftCaptions;
  columns: number;
  /** Tiles backfill holes left by larger tiles before them. */
  dense: boolean;
  gap: number;
  heading: string;
  /** The grid sits on the page below the card and can grow wider than it. */
  maxWidth: number;
  mobileColumns: number;
  mobileRowHeight: number;
  radius: number;
  rowHeight: number;
  /** Space between the page card and the heading. */
  spacing: number;
  tiles: CraftTileLayout[];
};

// Four narrow columns and short rows, so tiles can mix sizes:
//   Telegram 2×3 | Bank card 2×2, then Tone of voice and Whisp 1×1 under it
//   Phantom 1×2 | AI agents workspace 3×2
//   Agents dashboard 2×2 | Coding agent run 2×2
export const craftBento: CraftBentoSettings = {
  captions: "title",
  columns: 4,
  dense: true,
  gap: 16,
  heading: "Craft & concepts",
  maxWidth: 1024,
  mobileColumns: 2,
  mobileRowHeight: 140,
  radius: 8,
  rowHeight: 160,
  spacing: 96,
  tiles: [
    { cols: 2, fit: "cover", hidden: false, id: "telegram-quick-stickers", label: "Telegram stickers", rows: 3 },
    { cols: 2, fit: "cover", hidden: false, id: "mesh-card-demo", label: "Bank card", rows: 2 },
    { cols: 1, fit: "cover", hidden: false, id: "concept-tov", label: "Tone of voice", rows: 1 },
    { cols: 1, fit: "cover", hidden: false, id: "concept-whisp", label: "Whisp", rows: 1 },
    { cols: 1, fit: "cover", hidden: false, id: "glow-hover-effect", label: "Phantom glow", rows: 2 },
    { cols: 3, fit: "cover", hidden: false, id: "steamify-case-2", label: "AI agents workspace", rows: 2 },
    { cols: 2, fit: "cover", hidden: false, id: "concept-agents", label: "Agents dashboard", rows: 2 },
    { cols: 2, fit: "cover", hidden: false, id: "concept-loop", label: "Coding agent run", rows: 2 },
  ],
};
