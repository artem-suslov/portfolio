"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { Button } from "@/components/ui/button";
import { HoverShimmer } from "@/components/ui/hover-shimmer";
import { useMouseHover } from "@/components/ui/use-mouse-hover";
import { FINE_HOVER_QUERY, matchesMedia } from "@/lib/media";
import { useEscapeKey } from "@/lib/modal";
import { EMAIL, links } from "@/lib/site";
import styles from "./contact-button.module.css";

type ModalState = "closed" | "opening" | "open" | "closing";
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

function getCloseDuration() {
  return (
    Number.parseFloat(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--modal-close-dur"),
    ) || 150
  );
}

function shouldManageDialogFocus() {
  return matchesMedia(FINE_HOVER_QUERY);
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
  const [modalState, setModalState] = useState<ModalState>("closed");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const { playTap } = useInteractionSound();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const isModalVisible = modalState !== "closed";

  const finishClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setModalState("closed");
    if (shouldManageDialogFocus()) {
      triggerRef.current?.focus();
    }
  }, []);

  const openModal = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setModalState("opening");
    playTap();
  };

  const closeModal = useCallback(() => {
    if (modalState === "closed" || modalState === "closing") {
      return;
    }

    setModalState("closing");
    closeTimerRef.current = window.setTimeout(() => {
      finishClose();
    }, getCloseDuration() + 50);
  }, [finishClose, modalState]);

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

  useEffect(() => {
    if (modalState !== "opening") {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      setModalState("open");
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [modalState]);

  useEffect(() => {
    if (modalState === "open" && shouldManageDialogFocus()) {
      closeButtonRef.current?.focus();
    }
  }, [modalState]);

  useEscapeKey(isModalVisible, closeModal);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }

      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    },
    [],
  );

  return (
    <>
      <Button
        aria-expanded={isModalVisible}
        aria-haspopup="dialog"
        className={className}
        onClick={openModal}
        ref={triggerRef}
        variant="outline"
        {...hoverProps}
      >
        <HoverShimmer isActive={isHovered}>Contact me</HoverShimmer>
      </Button>

      {isModalVisible
        ? createPortal(
            <div
              role="presentation"
              className={`${styles.backdrop} ${
                modalState === "open" ? styles.backdropOpen : ""
              } ${modalState === "closing" ? styles.backdropClosing : ""}`}
              onClick={() => {
                closeModal();
                playTap();
              }}
            >
              <section
                aria-labelledby="contact-modal-title"
                aria-modal="true"
                className={`${styles.modal} t-modal ${
                  modalState === "open"
                    ? "is-open"
                    : modalState === "closing"
                      ? "is-closing"
                      : ""
                }`}
                onClick={(event) => event.stopPropagation()}
                onTransitionEnd={(event) => {
                  if (
                    modalState === "closing" &&
                    event.currentTarget === event.target &&
                    event.propertyName === "opacity"
                  ) {
                    finishClose();
                  }
                }}
                role="dialog"
              >
                <header className={styles.modalHeader}>
                  <p id="contact-modal-title">Contact me</p>
                  <button
                    aria-label="Close contact dialog"
                    className={styles.closeButton}
                    onClick={() => {
                      closeModal();
                      playTap();
                    }}
                    ref={closeButtonRef}
                    type="button"
                  >
                    <X aria-hidden="true" size={16} strokeWidth={1.7} />
                  </button>
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
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
