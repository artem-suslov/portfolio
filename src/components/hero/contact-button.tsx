"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { HoverShimmer } from "@/components/ui/hover-shimmer";
import { useMouseHover } from "@/components/ui/use-mouse-hover";
import { EMAIL, links } from "@/lib/site";
import styles from "./contact-button.module.css";

type CopyState = "idle" | "copied" | "error";

const externalContacts = [
  { href: links.telegramPersonal, icon: "telegram", label: "Telegram", value: "@art_ew" },
  { href: links.x, icon: "x", label: "X", value: "@artyoyom" },
  { href: links.linkedin, icon: "linkedin", label: "LinkedIn", value: "Artem Suslov" },
] as const;

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Unable to copy email address");
  }
}

function ContactOptionContent({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <span className={styles.contactOptionContent}>
      <span className={styles.serviceIcon}>
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG icons */}
        <img alt="" src={`/icons/contact-${icon}.svg`} />
      </span>
      <span className={styles.contactOptionText}>
        <span className={styles.contactOptionLabel}>{label}</span>
        <span className={styles.contactOptionValue}>{value}</span>
      </span>
    </span>
  );
}

export function ContactButton({ className }: { className?: string }) {
  const { hoverProps, isHovered } = useMouseHover();
  const [isOpen, setIsOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const { playTap } = useInteractionSound();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const copyTimerRef = useRef<number | null>(null);
  const titleId = useId();

  const copyEmail = async () => {
    try {
      await copyToClipboard(EMAIL);
      setCopyState("copied");
      playTap();
    } catch {
      setCopyState("error");
    }

    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = window.setTimeout(() => {
      setCopyState("idle");
      copyTimerRef.current = null;
    }, 1800);
  };

  useEffect(
    () => () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    },
    [],
  );

  return (
    <>
      <Button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={className}
        onClick={() => {
          setIsOpen(true);
          playTap();
        }}
        variant="outline"
        {...hoverProps}
      >
        <HoverShimmer isActive={isHovered}>Contact me</HoverShimmer>
      </Button>

      <Dialog
        aria-labelledby={titleId}
        initialFocusRef={closeButtonRef}
        onClose={() => setIsOpen(false)}
        open={isOpen}
      >
        <header className={styles.modalHeader}>
          <p id={titleId}>Contact me</p>
          <DialogClose aria-label="Close contact dialog" ref={closeButtonRef} />
        </header>
        <div className={styles.contactOptions}>
          <button
            aria-label={`Copy ${EMAIL}`}
            className={styles.contactOption}
            onClick={copyEmail}
            type="button"
          >
            <ContactOptionContent icon="email" label="Email" value={EMAIL} />
            <span className={styles.contactOptionAction}>
              <span
                aria-hidden="true"
                className="t-icon-swap"
                data-state={copyState === "copied" ? "b" : "a"}
              >
                <span className="t-icon" data-icon="a">
                  <Copy size={15} strokeWidth={2} />
                </span>
                <span className="t-icon" data-icon="b">
                  <Check size={16} strokeWidth={2} />
                </span>
              </span>
            </span>
          </button>
          {externalContacts.map(({ href, icon, label, value }) => (
            <a
              className={styles.contactOption}
              href={href}
              key={icon}
              onClick={playTap}
              rel="noreferrer"
              target="_blank"
            >
              <ContactOptionContent icon={icon} label={label} value={value} />
              <ExternalLink aria-hidden="true" size={16} strokeWidth={1.8} />
            </a>
          ))}
        </div>
      </Dialog>
    </>
  );
}
