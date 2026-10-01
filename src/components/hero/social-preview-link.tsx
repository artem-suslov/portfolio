"use client";

import { useRef } from "react";
import { TextLink } from "@/components/ui/text-link";
import styles from "./social-preview-link.module.css";

interface SocialPreviewLinkProps {
  children: string;
  href: string;
  previewSrc: string;
}

export function SocialPreviewLink({
  children,
  href,
  previewSrc,
}: SocialPreviewLinkProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function startPreview() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.dataset.loaded !== "true") {
      video.dataset.loaded = "true";
      video.src = previewSrc;
      video.load();
    }

    video.currentTime = 0;
    void video.play().catch(() => {
      // The preview remains useful as soon as its first frame is ready.
    });
  }

  function stopPreview() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.pause();
    video.currentTime = 0;
  }

  return (
    <TextLink
      aria-label={`${children} — opens in a new tab`}
      className={styles.link}
      href={href}
      onBlur={stopPreview}
      onFocus={startPreview}
      onPointerEnter={startPreview}
      onPointerLeave={stopPreview}
    >
      {children}
      <span aria-hidden="true" className={styles.tooltip}>
        <video
          className={styles.video}
          loop
          muted
          playsInline
          preload="none"
          ref={videoRef}
        />
      </span>
    </TextLink>
  );
}
