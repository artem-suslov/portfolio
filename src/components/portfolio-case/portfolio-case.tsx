"use client";

import Link from "next/link";
import { useRef } from "react";
import { CaseMorph } from "@/components/case-study/case-morph";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { CaseCover } from "./case-cover";
import { CaseInfo } from "./case-info";
import styles from "./portfolio-case.module.css";
import type { PortfolioCaseData } from "./types";
import { useCoverExperiment } from "./use-cover-experiment";

export function PortfolioCase({
  cover: defaultCover,
  coverExperiment,
  description,
  details,
  href,
  id,
  title,
}: PortfolioCaseData) {
  const { playTap } = useInteractionSound();
  const cardRef = useRef<HTMLElement>(null);
  const { cover, trackOpen } = useCoverExperiment(
    defaultCover,
    coverExperiment,
    cardRef,
  );
  const isLinked = Boolean(href && title);

  return (
    <article
      className={isLinked ? `${styles.case} ${styles.linkedCase}` : styles.case}
      data-case-id={id}
      ref={cardRef}
    >
      {href ? (
        <CaseMorph slug={href.slice(1)}>
          <CaseCover caseId={id} cover={cover} isLinked title={title} />
        </CaseMorph>
      ) : (
        <CaseCover caseId={id} cover={cover} isLinked={false} title={title} />
      )}
      <CaseInfo description={description} details={details} title={title} />

      {href && title ? (
        <Link
          aria-label={title}
          className={styles.caseLinkOverlay}
          href={href}
          onClick={() => {
            trackOpen();
            playTap();
          }}
        />
      ) : null}
    </article>
  );
}
