import { TextLink } from "@/components/ui/text-link";
import styles from "./portfolio-case.module.css";
import type { CaseDetails } from "./types";

function CaseDetailsSection({ details }: { details: CaseDetails }) {
  const metadata = [
    {
      label: "Company",
      value: details.companyHref ? (
        <TextLink className={styles.detailsLink} href={details.companyHref}>
          {details.company}
        </TextLink>
      ) : (
        details.company
      ),
    },
    { label: "Role", value: details.role },
    { label: "Period", value: details.period },
  ];

  return (
    <section className={styles.caseDetails}>
      <h3>{details.title}</h3>
      <p>
        {details.description}{" "}
        {details.descriptionLink ? (
          <TextLink href={details.descriptionLink.href}>
            {details.descriptionLink.label}
          </TextLink>
        ) : null}
      </p>
      {details.showMetadata !== false ? (
        <dl>
          {metadata.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}

/** Text under a case cover: full project details, or a title with a short description. */
export function CaseInfo({
  description,
  details,
  title,
}: {
  description?: string;
  details?: CaseDetails;
  title: string;
}) {
  if (details) {
    return <CaseDetailsSection details={details} />;
  }

  if (!title) {
    return null;
  }

  return (
    <div className={styles.caseCaption}>
      <span className={styles.caseTitle}>{title}</span>
      {description ? (
        <p className={styles.caseShortDescription}>{description}</p>
      ) : null}
    </div>
  );
}
