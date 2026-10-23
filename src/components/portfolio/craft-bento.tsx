"use client";

import type { CSSProperties } from "react";
import { CaseInfo } from "@/components/portfolio-case/case-info";
import { PortfolioCase } from "@/components/portfolio-case/portfolio-case";
import caseStyles from "@/components/portfolio-case/portfolio-case.module.css";
import { SkeletonImage } from "@/components/ui/skeleton-image";
import { type Concept, conceptsById } from "@/data/concepts";
import {
  type CraftBentoSettings,
  type CraftTile,
  craftBento,
  craftBentoHiddenOnMobile,
} from "@/data/craft-bento";
import { portfolioCases } from "@/data/portfolio-cases";
import styles from "./craft-bento.module.css";

const casesById = new Map(portfolioCases.map((portfolioCase) => [portfolioCase.id, portfolioCase]));

const isHiddenOnMobile = (tile: CraftTile) => tile.id !== null && craftBentoHiddenOnMobile.has(tile.id);

function ConceptTile({
  captions,
  concept,
  fit,
  position,
}: {
  captions: CraftBentoSettings["captions"];
  concept: Concept;
  fit: CraftTile["fit"];
  position: CraftTile["position"];
}) {
  const { alt, id, src } = concept;

  return (
    <article className={`${caseStyles.case} ${caseStyles.tileCase}`} data-case-id={id}>
      <div className={styles.conceptFrame}>
        <SkeletonImage
          alt={alt}
          className={styles.concept}
          height={src.height}
          sizes="(max-width: 760px) 100vw, 800px"
          src={src}
          style={{ objectFit: fit, objectPosition: position }}
          width={src.width}
        />
      </div>
      {captions === "none" ? null : <CaseInfo title={alt} />}
    </article>
  );
}

function TileContent({ settings, tile }: { settings: CraftBentoSettings; tile: CraftTile }) {
  const portfolioCase = tile.id ? casesById.get(tile.id) : undefined;
  const concept = tile.id ? conceptsById.get(tile.id) : undefined;

  if (portfolioCase) {
    return <PortfolioCase {...portfolioCase} caption={settings.captions} tile />;
  }

  return concept ? (
    <ConceptTile
      captions={settings.captions}
      concept={concept}
      fit={tile.fit}
      position={tile.position}
    />
  ) : null;
}

export function CraftBento({ settings = craftBento }: { settings?: CraftBentoSettings }) {
  return (
    <section
      aria-labelledby="craft-heading"
      className={styles.craft}
      id="craft"
      style={
        {
          "--bento-gap": `${settings.gap}px`,
          "--bento-header-gap": `${settings.headerGap}px`,
          "--bento-header-width": `${settings.headerWidth}px`,
          "--bento-max-width": `${settings.maxWidth}px`,
          "--bento-row-gap": `${settings.rowGap}px`,
          // Unitless, so rows can scale with the grid's width.
          "--bento-row-height": settings.rowHeight,
          "--bento-row-ratio": settings.rowHeight / settings.maxWidth,
          "--bento-spacing": `${settings.spacing}px`,
          // Every cover in the grid rounds its corners with this token.
          "--radius-md": `${settings.radius}px`,
        } as CSSProperties
      }
    >
      <header className={styles.header}>
        <h2 className={styles.heading} id="craft-heading">
          {settings.heading}
        </h2>
        {settings.description ? <p className={styles.description}>{settings.description}</p> : null}
      </header>
      <div className={styles.grid} data-craft-grid>
        {settings.rows.map((row, rowIndex) => (
          <div
            className={
              row.every(isHiddenOnMobile) ? `${styles.row} ${styles.hiddenOnMobile}` : styles.row
            }
            key={rowIndex}
          >
            {row.map((tile) => (
              <div
                className={isHiddenOnMobile(tile) ? `${styles.tile} ${styles.hiddenOnMobile}` : styles.tile}
                key={tile.label}
                style={{ "--tile-width": tile.width } as CSSProperties}
              >
                <TileContent settings={settings} tile={tile} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
