import type { Font, PathCommand } from "opentype.js";

// The bookmark's label as glyph outlines, so its letters can bend point by point
// with the fabric instead of sliding as rigid blocks. Fonts are Geist cut down to
// printable ASCII (public/fonts/geist-outline, OFL); the parser loads on demand.

type Point = [number, number];

/** Glyph contours laid out on a baseline at y = 0, starting at x = 0. */
export type GlyphRun = {
  /** Cap height above the baseline, for centring the label vertically. */
  capHeight: number;
  contours: Point[][];
  width: number;
};

const weights = [300, 400, 500, 600, 700, 900];
// Enough to keep curves smooth even when the page is zoomed in.
const curveSteps = 8;
const fonts = new Map<number, Promise<Font>>();

export function nearestWeight(weight: number) {
  return weights.reduce((best, next) =>
    Math.abs(next - weight) < Math.abs(best - weight) ? next : best,
  );
}

export function loadGlyphFont(weight: number) {
  const nearest = nearestWeight(weight);
  let font = fonts.get(nearest);

  if (!font) {
    font = Promise.all([
      import("opentype.js"),
      fetch(`/fonts/geist-outline/geist-${nearest}.ttf`).then((response) => {
        if (!response.ok) {
          throw new Error(`Font ${nearest} failed to load`);
        }
        return response.arrayBuffer();
      }),
    ]).then(([opentype, buffer]) => opentype.parse(buffer));
    // A failed load can be retried on the next settings change.
    font.catch(() => fonts.delete(nearest));
    fonts.set(nearest, font);
  }

  return font;
}

function flatten(commands: PathCommand[]): Point[][] {
  const contours: Point[][] = [];
  let contour: Point[] = [];
  let [x, y] = [0, 0];

  for (const command of commands) {
    switch (command.type) {
      case "M":
        if (contour.length) {
          contours.push(contour);
        }
        contour = [[command.x, command.y]];
        [x, y] = [command.x, command.y];
        break;
      case "L":
        contour.push([command.x, command.y]);
        [x, y] = [command.x, command.y];
        break;
      case "Q":
        for (let i = 1; i <= curveSteps; i++) {
          const t = i / curveSteps;
          const u = 1 - t;
          contour.push([
            u * u * x + 2 * u * t * command.x1 + t * t * command.x,
            u * u * y + 2 * u * t * command.y1 + t * t * command.y,
          ]);
        }
        [x, y] = [command.x, command.y];
        break;
      case "C":
        for (let i = 1; i <= curveSteps; i++) {
          const t = i / curveSteps;
          const u = 1 - t;
          contour.push([
            u * u * u * x + 3 * u * u * t * command.x1 + 3 * u * t * t * command.x2 + t * t * t * command.x,
            u * u * u * y + 3 * u * u * t * command.y1 + 3 * u * t * t * command.y2 + t * t * t * command.y,
          ]);
        }
        [x, y] = [command.x, command.y];
        break;
      case "Z":
        if (contour.length) {
          contours.push(contour);
        }
        contour = [];
        break;
    }
  }

  if (contour.length) {
    contours.push(contour);
  }

  return contours;
}

export function layoutGlyphs(
  font: Font,
  text: string,
  { fontSize, letterSpacing }: { fontSize: number; letterSpacing: number },
): GlyphRun {
  const options = { kerning: true, letterSpacing };
  const path = font.getPath(text, 0, 0, fontSize, options);
  // Spacing follows every glyph, the last one too; the run is centred without it.
  const width = font.getAdvanceWidth(text, fontSize, options) - letterSpacing * fontSize;
  const capHeight = ((font.tables.os2?.sCapHeight ?? font.ascender * 0.7) / font.unitsPerEm) * fontSize;

  return { capHeight, contours: flatten(path.commands), width };
}
