"use client";

import InteractiveCardDemo from "./interactive-card-demo";
import styles from "./interactive-card-demo.module.css";

export function InteractiveCardCover() {
  return (
    <div className={styles.demo}>
      <InteractiveCardDemo />
    </div>
  );
}
