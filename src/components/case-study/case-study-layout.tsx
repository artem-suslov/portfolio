import type { ReactNode } from "react";
import { CaseRail, type CaseRailSection } from "./case-rail";
import styles from "./case-study.module.css";

/** Page shell for a case study: sticky table of contents plus the article card. */
export function CaseStudyLayout({
  children,
  sections,
}: {
  children: ReactNode;
  sections: readonly CaseRailSection[];
}) {
  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <CaseRail sections={sections} />
        <article className={styles.article}>{children}</article>
      </div>
    </main>
  );
}

/** Centered eyebrow and title, followed by the hero media and project meta. */
export function CaseOverview({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: ReactNode;
}) {
  return (
    <section className={styles.overview}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
      </header>
      <div className={styles.overviewContent}>{children}</div>
    </section>
  );
}

export function CaseMeta({
  items,
}: {
  items: readonly { label: string; value: ReactNode }[];
}) {
  return (
    <dl className={styles.meta}>
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseLabel({
  children,
  prominent = false,
}: {
  children: ReactNode;
  prominent?: boolean;
}) {
  return (
    <h3 className={prominent ? `${styles.label} ${styles.prominentLabel}` : styles.label}>
      {children}
    </h3>
  );
}
