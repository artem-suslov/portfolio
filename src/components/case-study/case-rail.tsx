"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import styles from "./case-study.module.css";

export type CaseRailSection = {
  id: string;
  label: string;
};

export function CaseRail({
  sections,
}: {
  sections: readonly CaseRailSection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const { playTap } = useInteractionSound();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const readingLine = Math.min(window.innerHeight * 0.25, 180);
      let current = sections[0]?.id ?? "";
      for (const { id } of sections) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= readingLine) current = id;
      }
      // Short final sections may never reach the reading line.
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1]?.id ?? current;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [sections]);

  return <aside className={styles.rail} aria-label="Case navigation">
    <Link href="/" className={styles.home} onClick={playTap}>
      <Image src="/images/steamify-case-v2/back.svg" width={7} height={20} alt="" />Back
    </Link>
    <nav aria-label="Table of contents" className={styles.railItems}>
      {sections.map(({ id, label }) => <a
        key={id}
        href={`#${id}`}
        className={styles.railItem}
        aria-current={activeId === id ? "location" : undefined}
        onClick={() => { if (activeId !== id) playTap(); }}
      >{label}</a>)}
    </nav>
  </aside>;
}
