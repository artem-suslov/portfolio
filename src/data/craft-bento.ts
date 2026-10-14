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

export const craftBento: CraftBentoSettings = {
  captions: "title",
  columns: 3,
  dense: true,
  gap: 16,
  heading: "Craft & concepts",
  maxWidth: 1024,
  mobileColumns: 1,
  mobileRowHeight: 200,
  radius: 8,
  rowHeight: 220,
  spacing: 96,
  tiles: [
    { cols: 2, fit: "cover", hidden: false, id: "telegram-quick-stickers", label: "Telegram stickers", rows: 2 },
    { cols: 1, fit: "cover", hidden: false, id: "mesh-card-demo", label: "Bank card", rows: 1 },
    { cols: 1, fit: "cover", hidden: false, id: "glow-hover-effect", label: "Phantom glow", rows: 1 },
    { cols: 1, fit: "cover", hidden: false, id: "concept-tov", label: "Tone of voice", rows: 1 },
    { cols: 1, fit: "cover", hidden: false, id: "concept-agents", label: "Agents dashboard", rows: 1 },
    { cols: 1, fit: "cover", hidden: false, id: "concept-whisp", label: "Whisp", rows: 1 },
    { cols: 2, fit: "cover", hidden: false, id: "steamify-case-2", label: "AI agents workspace", rows: 1 },
    { cols: 1, fit: "cover", hidden: false, id: "concept-loop", label: "Coding agent run", rows: 1 },
  ],
};
