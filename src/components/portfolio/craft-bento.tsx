"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { CaseCoverModal } from "@/components/portfolio-case/case-cover-modal";
import { CaseInfo } from "@/components/portfolio-case/case-info";
import { PortfolioCase } from "@/components/portfolio-case/portfolio-case";
import caseStyles from "@/components/portfolio-case/portfolio-case.module.css";
import { type Concept, conceptsById } from "@/data/concepts";
import { type CraftBentoSettings, type CraftTileLayout, craftBento } from "@/data/craft-bento";
import { portfolioCases } from "@/data/portfolio-cases";
import styles from "./craft-bento.module.css";

const casesById = new Map(portfolioCases.map((portfolioCase) => [portfolioCase.id, portfolioCase]));

function ConceptTile({
  captions,
  concept,
  fit,
  radius,
}: {
  captions: CraftBentoSettings["captions"];
  concept: Concept;
  fit: CraftTileLayout["fit"];
  radius: number;
}) {
  const { alt, id, src } = concept;

  return (
    <article className={`${caseStyles.case} ${caseStyles.tileCase}`} data-case-id={id}>
      <CaseCoverModal
        caseId={id}
        className={styles.conceptTrigger}
        expandedSrc={src.src}
        label={alt}
        renderMedia={(isExpanded) => (
          <Image
            alt={alt}
            className={styles.concept}
            data-fit={fit}
            height={src.height}
            sizes={isExpanded ? "(max-width: 760px) 92vw, 900px" : "(max-width: 760px) 100vw, 640px"}
            src={src}
            // The expanded view shows the original file, not a recompressed variant.
            unoptimized={isExpanded}
            width={src.width}
          />
        )}
        scaleOnHover={false}
        thumbnailRadius={radius}
      />
      {captions === "none" ? null : <CaseInfo title={alt} />}
    </article>
  );
}

export function CraftBento({ settings = craftBento }: { settings?: CraftBentoSettings }) {
  const tiles = settings.tiles.filter(({ hidden }) => !hidden);

  return (
    <section
      aria-labelledby="craft-heading"
      className={styles.craft}
      id="craft"
      style={
        {
          "--bento-columns": settings.columns,
          "--bento-gap": `${settings.gap}px`,
          "--bento-max-width": `${settings.maxWidth}px`,
          "--bento-mobile-columns": settings.mobileColumns,
          "--bento-mobile-row": `${settings.mobileRowHeight}px`,
          "--bento-row": `${settings.rowHeight}px`,
          "--bento-spacing": `${settings.spacing}px`,
          // Every cover in the grid rounds its corners with this token.
          "--radius-md": `${settings.radius}px`,
        } as CSSProperties
      }
    >
      {settings.heading ? (
        <h2 className={styles.heading} id="craft-heading">
          {settings.heading}
        </h2>
      ) : null}
      <div className={styles.grid} data-dense={settings.dense || undefined}>
        {tiles.map(({ cols, fit, id, rows }) => {
          const portfolioCase = casesById.get(id);
          const concept = conceptsById.get(id);
          const columns = Math.min(cols, settings.columns);

          return portfolioCase || concept ? (
            <div
              className={styles.tile}
              key={id}
              style={
                {
                  "--tile-cols": columns,
                  "--tile-mobile-cols": Math.min(columns, settings.mobileColumns),
                  "--tile-rows": rows,
                } as CSSProperties
              }
            >
              {portfolioCase ? (
                <PortfolioCase {...portfolioCase} caption={settings.captions} tile />
              ) : concept ? (
                <ConceptTile
                  captions={settings.captions}
                  concept={concept}
                  fit={fit}
                  radius={settings.radius}
                />
              ) : null}
            </div>
          ) : null;
        })}
      </div>
    </section>
  );
}
