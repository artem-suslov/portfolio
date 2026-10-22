"use client";

import { useEffect, useRef } from "react";

// A muted looping clip that only plays while it is on screen. With reduced motion it
// stays on its poster frame.
export function CollageVideo({ label, poster, src }: { label: string; poster?: string; src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      aria-label={label}
      loop
      muted
      playsInline
      poster={poster}
      preload="none"
      ref={videoRef}
      src={src}
    />
  );
}
