"use client";

import Image, { type ImageProps } from "next/image";
import styles from "./skeleton-image.module.css";

/**
 * `next/image` that pulses as a gray skeleton until the file has loaded.
 * The flag is set on the element itself, so loading never re-renders the tree.
 */
export function SkeletonImage({ alt, className, onLoad, ...props }: ImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      className={className ? `${styles.image} ${className}` : styles.image}
      onLoad={(event) => {
        event.currentTarget.dataset.loaded = "";
        onLoad?.(event);
      }}
    />
  );
}
