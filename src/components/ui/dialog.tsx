"use client";

import {
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  use,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { Button } from "@/components/ui/button";
import { FINE_HOVER_QUERY, matchesMedia } from "@/lib/media";
import { useEscapeKey, useModalPhase, useScrollLock } from "@/lib/modal";
import styles from "./dialog.module.css";

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

const DialogContext = createContext<{ close: () => void } | null>(null);

type DialogProps = {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Sets `--dialog-*` overrides (backdrop color and blur); see dialog.module.css. */
  backdropClassName?: string;
  children: ReactNode;
  /** Panel styles; set `--dialog-*` here for width, radius, surface and shadow. */
  className?: string;
  /** Focused when the dialog opens; defaults to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
  open: boolean;
};

/**
 * Centered modal over a dimmed backdrop. Owns the enter/exit animation, Escape, scroll lock,
 * focus (moved in, trapped, and returned to the opener on mouse devices) and the tap sound for
 * backdrop clicks. The caller only keeps the `open` flag.
 */
export function Dialog({
  backdropClassName,
  children,
  className,
  initialFocusRef,
  onClose,
  open,
  ...labelProps
}: DialogProps) {
  const { playTap } = useInteractionSound();
  const panelRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { handleTransitionEnd, isMounted, phase } = useModalPhase(open, {
    onClosed: () => {
      if (matchesMedia(FINE_HOVER_QUERY)) {
        returnFocusRef.current?.focus();
      }
      returnFocusRef.current = null;
    },
  });

  useEscapeKey(open, onClose);
  useScrollLock(isMounted);

  useEffect(() => {
    if (phase === "opening" && returnFocusRef.current === null) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }

    if (phase !== "open" || !matchesMedia(FINE_HOVER_QUERY)) {
      return;
    }

    const target =
      initialFocusRef?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus({ preventScroll: true });
  }, [initialFocusRef, phase]);

  const trapFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !panelRef.current) {
      return;
    }

    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const first = focusable[0];
    const last = focusable.at(-1);

    if (!first || !last) {
      event.preventDefault();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      className={[styles.backdrop, backdropClassName].filter(Boolean).join(" ")}
      data-state={phase}
      onClick={() => {
        playTap();
        onClose();
      }}
      role="presentation"
    >
      <section
        {...labelProps}
        aria-modal="true"
        className={[styles.panel, className].filter(Boolean).join(" ")}
        data-state={phase}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={trapFocus}
        onTransitionEnd={handleTransitionEnd}
        ref={panelRef}
        role="dialog"
      >
        <DialogContext value={{ close: onClose }}>{children}</DialogContext>
      </section>
    </div>,
    document.body,
  );
}

/** Circular close button for a `Dialog`; plays the tap sound and closes it. */
export function DialogClose({
  "aria-label": ariaLabel = "Close dialog",
  iconSize = 16,
  onClick,
  size = "sm",
  ...props
}: Omit<ComponentProps<typeof Button>, "children" | "iconOnly"> & { iconSize?: number }) {
  const dialog = use(DialogContext);
  const { playTap } = useInteractionSound();

  return (
    <Button
      {...props}
      aria-label={ariaLabel}
      iconOnly
      onClick={(event) => {
        onClick?.(event);
        playTap();
        dialog?.close();
      }}
      size={size}
    >
      <X aria-hidden="true" size={iconSize} strokeWidth={1.7} />
    </Button>
  );
}
