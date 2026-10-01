"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import styles from "./text-link.module.css";

type TextLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
};

/** Underlined inline link that opens in a new tab and plays the shared tap sound. */
export function TextLink({ className, href, onClick, ...props }: TextLinkProps) {
  const { playTap } = useInteractionSound();

  return (
    <a
      className={className ? `${styles.link} ${className}` : styles.link}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        playTap();
      }}
      rel="noreferrer"
      target="_blank"
      {...props}
    />
  );
}
