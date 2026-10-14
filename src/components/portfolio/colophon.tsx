import styles from "./colophon.module.css";

const colophonItems = [
  { label: "Code", value: "Next.js, TypeScript" },
  { label: "Styling", value: "CSS Modules, Tailwind" },
  { label: "Type", value: "Geist" },
  { label: "Icons", value: "Lucide" },
  { label: "Motion", value: "Framer Motion" },
  { label: "Shaders", value: "Paper Shaders" },
  { label: "Hosting", value: "Vercel" },
  { label: "Analytics", value: "Yandex Metrica" },
  { label: "Built with", value: "Claude Code, Codex" },
] as const;

export function Colophon({ className }: { className?: string }) {
  return (
    <footer
      className={className ? `${styles.colophon} ${className}` : styles.colophon}
      aria-labelledby="colophon"
    >
      <h2 className={styles.heading} id="colophon">
        Colophon
      </h2>
      <p className={styles.lead}>Designed and built in code by me, not in a site builder.</p>
      <dl className={styles.list}>
        {colophonItems.map(({ label, value }) => (
          <div className={styles.row} key={label}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{value}</dd>
          </div>
        ))}
      </dl>
    </footer>
  );
}
