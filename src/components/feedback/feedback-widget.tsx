"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { AnimatePresence, m, MotionConfig, type Transition } from "framer-motion";
import { Caveat } from "next/font/google";
import { Bug } from "lucide-react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { Button } from "@/components/ui/button";
import { HoverShimmer } from "@/components/ui/hover-shimmer";
import { useMouseHover } from "@/components/ui/use-mouse-hover";
import { trackGoal } from "@/lib/analytics";
import { FINE_HOVER_QUERY, matchesMedia } from "@/lib/media";
import { useEscapeKey } from "@/lib/modal";
import styles from "./feedback-widget.module.css";

type SendState = "idle" | "sending" | "sent" | "error";

const MAX_MESSAGE_LENGTH = 2000;
/**
 * The button and the panel share one surface that morphs between the two shapes. Crossfade is off
 * on both, so the surface hands over at once instead of showing a stretched copy of the button.
 */
const SURFACE_LAYOUT_ID = "feedback-surface";
const morphTransition: Transition = {
  type: "spring",
  duration: 0.35,
  bounce: 0,
};
/** Send → Sending…: the old label slides up and out while the new one rises in. */
const labelTransition: Transition = {
  type: "spring",
  duration: 0.3,
  bounce: 0,
};
const TRIGGER_RADIUS = 22;
const PANEL_RADIUS = 12;

const MotionButton = m.create(Button);

/** Two twine tails hanging from under the roll, in a 52 × 74 box whose top 22px is the roll. */
const TWINE_TAILS = ["M24 21 C21 38 15 52 10 70", "M28 21 C31 38 37 52 42 71"];

/** Handwriting for the thanks note left on the frame under the roll. */
const handwriting = Caveat({
  subsets: ["latin"],
  weight: "500",
});

/** Floating bug button in the bottom-left corner that opens a feedback form sent to Telegram. */
export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [message, setMessage] = useState("");
  const { playTap } = useInteractionSound();
  const { hoverProps: submitHoverProps, isHovered: isSubmitHovered } = useMouseHover();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const submitSizerRef = useRef<HTMLSpanElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  // The roll-up animation travels the card's own height, measured when the message goes out.
  const [sheetHeight, setSheetHeight] = useState(0);
  const isSent = sendState === "sent";
  const canSubmit = message.trim() !== "" && sendState !== "sending";
  // Stays on "Sending…" once sent, so the label doesn't swap back while the card rolls away.
  const submitLabel = sendState === "sending" || sendState === "sent" ? "Sending…" : "Send";

  // A sent form starts over empty; an unsent draft stays for the next time.
  const handleClosed = () => {
    if (sendState === "sent") {
      setMessage("");
    }
    if (sendState !== "sending") {
      setSendState("idle");
    }
  };

  const closePanel = () => setIsOpen(false);

  const togglePanel = () => {
    playTap();
    setIsOpen((current) => !current);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim() || sendState === "sending") {
      return;
    }

    const website = new FormData(event.currentTarget).get("website");
    playTap();
    setSendState("sending");

    try {
      const response = await fetch("/api/feedback", {
        body: JSON.stringify({
          message,
          page: window.location.href,
          website,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Feedback request failed with ${response.status}`);
      }

      setSheetHeight(cardRef.current?.offsetHeight ?? 0);
      setSendState("sent");
      trackGoal("feedback_sent");
    } catch {
      setSendState("error");
    }
  };

  useEffect(() => {
    if (isOpen && matchesMedia(FINE_HOVER_QUERY)) {
      messageRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  // The panel gets an explicit height that follows its content (the error line, for one), so the
  // open/close morph lands on the content's real size.
  useEffect(() => {
    const content = contentRef.current;
    if (!isOpen || !content) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setPanelHeight(entry.borderBoxSize[0]?.blockSize ?? content.offsetHeight);
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [isOpen]);

  // Sizes the button to the label it is about to show, before paint, so the CSS width transition
  // starts from the old width in the same frame the labels start to swap.
  useLayoutEffect(() => {
    const button = submitRef.current;
    const sizer = submitSizerRef.current;
    if (!isOpen || !button || !sizer) {
      return;
    }

    button.style.width = `calc(${sizer.getBoundingClientRect().width}px + 2 * var(--space-4))`;
  }, [isOpen, submitLabel]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closePanel();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEscapeKey(isOpen, () => {
    closePanel();
    if (matchesMedia(FINE_HOVER_QUERY)) {
      triggerRef.current?.focus();
    }
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.root} ref={rootRef}>
        <MotionButton
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Report a bug or leave feedback"
          className={styles.trigger}
          iconOnly
          layoutCrossfade={false}
          layoutId={SURFACE_LAYOUT_ID}
          onClick={togglePanel}
          ref={triggerRef}
          size="lg"
          style={{ borderRadius: TRIGGER_RADIUS }}
          tabIndex={isOpen ? -1 : undefined}
          transition={morphTransition}
        >
          <span className={styles.triggerIcon}>
            <Bug aria-hidden="true" size={18} strokeWidth={1.8} />
          </span>
        </MotionButton>

        <AnimatePresence onExitComplete={handleClosed}>
          {isOpen ? (
            <m.section
              aria-describedby={descriptionId}
              aria-labelledby={titleId}
              className={styles.panel}
              // Only the open/close morph is a layout animation; the roll-up runs in CSS.
              layoutDependency={0}
              layoutCrossfade={false}
              layoutId={SURFACE_LAYOUT_ID}
              role="dialog"
              style={{
                borderRadius: PANEL_RADIUS,
                height: panelHeight ?? undefined,
              }}
              transition={morphTransition}
            >
              <m.div
                animate={{
                  opacity: 1,
                  transition: { delay: 0.08, duration: 0.2 },
                }}
                className={styles.content}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
                initial={{ opacity: 0 }}
                // Counter-scaled during the morph, so the content is revealed rather than squashed.
                layout
                layoutDependency={0}
                ref={contentRef}
              >
                {isSent ? (
                  <p className={styles.thanks} role="status">
                    <span className={`${styles.thanksNote} ${handwriting.className}`}>
                      Thanks for feedback!
                    </span>
                  </p>
                ) : null}

                {/* After sending, the white card rolls up like paper and uncovers the thanks. */}
                <div
                  className={styles.sheet}
                  data-rolled={isSent || undefined}
                  style={{ "--sheet-height": `${sheetHeight}px` } as CSSProperties}
                >
                  <div className={styles.wind}>
                    <form
                      className={styles.card}
                      inert={isSent}
                      noValidate
                      onSubmit={handleSubmit}
                      ref={cardRef}
                    >
                      <div className={styles.heading}>
                        <h2 className={styles.title} id={titleId}>
                          Bug or feature?
                        </h2>
                        <p className={styles.description} id={descriptionId}>
                          Tell me what&apos;s broken or what could be better. It goes straight to my
                          Telegram.
                        </p>
                      </div>

                      <textarea
                        aria-describedby={descriptionId}
                        aria-labelledby={titleId}
                        className={styles.textarea}
                        maxLength={MAX_MESSAGE_LENGTH}
                        name="message"
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Leave your thoughts"
                        ref={messageRef}
                        required
                        value={message}
                      />

                      {/* Honeypot for bots; hidden from people and assistive tech. */}
                      <input
                        aria-hidden="true"
                        autoComplete="off"
                        className={styles.honeypot}
                        name="website"
                        tabIndex={-1}
                        type="text"
                      />

                      {sendState === "error" ? (
                        <p className={styles.error} role="alert">
                          It didn&apos;t go through. Try again or message me at @art_ew.
                        </p>
                      ) : null}

                      {/*
                        The button's width follows its label: an invisible copy of the label is
                        measured and the width transitions in CSS, so nothing is scaled mid-resize.
                      */}
                      <Button
                        className={styles.submit}
                        disabled={!canSubmit}
                        ref={submitRef}
                        type="submit"
                        variant="primary"
                        {...submitHoverProps}
                      >
                        <span
                          aria-hidden="true"
                          className={styles.submitSizer}
                          ref={submitSizerRef}
                        >
                          {submitLabel}
                        </span>
                        <AnimatePresence initial={false} mode="popLayout">
                          <m.span
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.submitLabel}
                            exit={{ opacity: 0, y: -12 }}
                            initial={{ opacity: 0, y: 12 }}
                            key={submitLabel}
                            transition={labelTransition}
                          >
                            <HoverShimmer isActive={isSubmitHovered && canSubmit}>
                              {submitLabel}
                            </HoverShimmer>
                          </m.span>
                        </AnimatePresence>
                      </Button>
                    </form>
                  </div>
                  {isSent ? (
                    <span aria-hidden="true" className={styles.roll}>
                      <svg className={styles.twine} viewBox="0 0 52 74">
                        {TWINE_TAILS.map((path) => (
                          <g className={styles.twineStrand} key={path}>
                            <path d={path} pathLength={1} />
                            {/* Darker flecks along the cord read as its twist. */}
                            <path className={styles.twineTwist} d={path} />
                          </g>
                        ))}
                      </svg>
                      {/* Pressed onto the tails once the twine is tied, sealing the message. */}
                      <span className={styles.seal}>
                        <Bug size={15} strokeWidth={2.2} />
                      </span>
                    </span>
                  ) : null}
                </div>
              </m.div>
            </m.section>
          ) : null}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
