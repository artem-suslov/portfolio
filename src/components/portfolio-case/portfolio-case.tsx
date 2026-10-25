"use client";

import Link from "next/link";
import { useRef } from "react";
import { CaseMorph } from "@/components/case-study/case-morph";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { markCaseNavigation, rememberHomeScroll, useCaseReturnTarget } from "@/lib/case-return";
import { AiRibbon } from "./ai-ribbon";
import { CaseCover } from "./case-cover";
import { CaseInfo } from "./case-info";
import styles from "./portfolio-case.module.css";
import type { PortfolioCaseData } from "./types";

/** How much text sits under the cover: everything, the title only, or nothing. */
export type CaseCaption = "full" | "none" | "title";
import { useCoverExperiment } from "./use-cover-experiment";

export function PortfolioCase({
  caption = "full",
  comingSoon,
  cover: defaultCover,
  coverExperiment,
  description,
  details,
  href,
  id,
  ribbon,
  tile = false,
  title,
}: PortfolioCaseData & {
  caption?: CaseCaption;
  /** Fill a grid cell: the cover stretches to whatever height the cell leaves it. */
  tile?: boolean;
}) {
  const { playTap } = useInteractionSound();
  const cardRef = useRef<HTMLElement>(null);
  const { cover, trackOpen } = useCoverExperiment(
    defaultCover,
    coverExperiment,
    cardRef,
  );
  const isLinked = Boolean(href && title);
  useCaseReturnTarget(cardRef, href);

  return (
    <article
      className={[styles.case, isLinked && styles.linkedCase, tile && styles.tileCase]
        .filter(Boolean)
        .join(" ")}
      data-case-id={id}
      ref={cardRef}
    >
      {href ? (
        <CaseMorph slug={href.slice(1)}>
          <CaseCover caseId={id} cover={cover} isLinked title={title} />
        </CaseMorph>
      ) : comingSoon ? (
        <div className={styles.comingSoonCover}>
          <CaseCover caseId={id} cover={cover} expandable={!tile} isLinked={false} title={title} />
          <span aria-hidden="true" className={styles.comingSoonLabel}>
            Case coming soon
          </span>
        </div>
      ) : (
        // Grid tiles stay put; only full cards open their cover in the expanded view.
        <CaseCover caseId={id} cover={cover} expandable={!tile} isLinked={false} title={title} />
      )}
      {ribbon ? <AiRibbon label={ribbon} /> : null}
      {caption === "full" ? (
        <CaseInfo description={description} details={details} title={title} />
      ) : caption === "title" ? (
        <CaseInfo title={title} />
      ) : null}

      {href && title ? (
        <Link
          aria-label={title}
          className={styles.caseLinkOverlay}
          href={href}
          onClick={() => {
            markCaseNavigation();
            rememberHomeScroll();
            trackOpen();
            playTap();
          }}
        />
      ) : null}
    </article>
  );
}
