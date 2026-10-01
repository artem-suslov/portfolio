"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./dashboard-case-preview.module.css";

const LocalDashboardOverview = dynamic(
  () =>
    import("./local-dashboard-overview").then(
      (module) => module.LocalDashboardOverview,
    ),
  {
    loading: () => null,
    ssr: false,
  },
);

interface DashboardCasePreviewProps {
  alt: string;
  sizes: string;
  src: string | StaticImageData;
}

export function DashboardCasePreview({
  alt,
  sizes,
  src,
}: DashboardCasePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const supportsInteractivePreview = window.matchMedia(
          "(hover: hover) and (pointer: fine) and (min-width: 761px)",
        ).matches;

        if (entry.isIntersecting && supportsInteractivePreview) {
          setShouldLoad(true);
          intersectionObserver.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );

    intersectionObserver.observe(container);

    return () => intersectionObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.dashboardCaseEmbed}
    >
      <Image
        alt={alt}
        className={styles.dashboardCasePreview}
        fill
        sizes={sizes}
        src={src}
        unoptimized
      />
      {shouldLoad ? <LocalDashboardOverview /> : null}
    </div>
  );
}
