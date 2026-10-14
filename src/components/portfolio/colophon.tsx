import styles from "./colophon.module.css";

export function Colophon({ className }: { className?: string }) {
  return (
    <footer
      className={className ? `${styles.colophon} ${className}` : styles.colophon}
      aria-labelledby="colophon"
    >
      <h2 className={styles.heading} id="colophon">
        Designed and built by me
      </h2>
      <p className={styles.text}>
        Next.js, TypeScript, my own design tokens and components. Geist, Lucide, Framer Motion and
        Paper shaders. Hosted on Vercel, coded with help from Claude and Codex.
      </p>
    </footer>
  );
}
