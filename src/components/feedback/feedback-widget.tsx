"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, m, MotionConfig, type Transition } from "framer-motion";
import { Bug, ChevronLeft, ChevronRight, Lightbulb, X } from "lucide-react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { Button } from "@/components/ui/button";
import { HoverShimmer } from "@/components/ui/hover-shimmer";
import { useMouseHover } from "@/components/ui/use-mouse-hover";
import { trackGoal } from "@/lib/analytics";
import { FINE_HOVER_QUERY, matchesMedia } from "@/lib/media";
import { useEscapeKey } from "@/lib/modal";
import styles from "./feedback-widget.module.css";

type SendState = "idle" | "sending" | "sent" | "error";
type FeedbackKind = "bug" | "idea";

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
const TRIGGER_RADIUS = 22;
const PANEL_RADIUS = 16;

const MotionButton = m.create(Button);

/**
 * Returns the bare username: the field shows its own "@" prefix, so a typed "@" is dropped,
 * a pasted t.me link is cut down to the name, and only Latin letters, digits and "_" remain.
 */
function sanitizeTelegram(value: string) {
  return value
    .trim()
    .replace(/^(https?:\/\/)?(t|telegram)\.me\//i, "")
    .replace(/[^a-z0-9_]/gi, "");
}

const kindOptions = [
  {
    description: "A glitch or a layout that fell apart",
    icon: Bug,
    kind: "bug",
    label: "Something's broken",
  },
  {
    description: "Something to add or improve",
    icon: Lightbulb,
    kind: "idea",
    label: "I have an idea",
  },
] as const;

const kindCopy = {
  bug: {
    description: "Describe what broke. I'll see the page and browser on my side.",
    label: "What went wrong?",
    placeholder: "The video in the Steamify case froze on my iPhone",
    sentTitle: "Got it, I'll take a look",
    title: "Report a bug",
  },
  idea: {
    description: "Anything from a missing detail to a case that didn't land.",
    label: "What would you change?",
    placeholder: "Show the final numbers at the top of each case",
    sentTitle: "Thanks for the idea",
    title: "Suggest an improvement",
  },
} satisfies Record<FeedbackKind, Record<string, string>>;

/** Floating bug button in the bottom-left corner that opens a feedback form sent to Telegram. */
export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [kind, setKind] = useState<FeedbackKind | null>(null);
  const [message, setMessage] = useState("");
  const [telegram, setTelegram] = useState("");
  const { playTap } = useInteractionSound();
  const { hoverProps: submitHoverProps, isHovered: isSubmitHovered } = useMouseHover();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  // Set when the user switches steps, so focus follows them into the new step.
  const shouldMoveFocusRef = useRef(false);
  const titleId = useId();
  const messageId = useId();
  const telegramId = useId();
  const telegramHintId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const measuredStepRef = useRef<string | null>(null);
  const [panelHeight, setPanelHeight] = useState<{
    animate: boolean;
    value: number;
  } | null>(null);
  const step = !kind ? "choose" : sendState === "sent" ? "sent" : kind;
  const canSubmit = message.trim() !== "" && sendState !== "sending";

  // A sent form starts over from the first step; an unsent draft stays where it was.
  const handleClosed = () => {
    if (sendState === "sent") {
      setMessage("");
    }
    if (sendState === "sent" || !message.trim()) {
      setKind(null);
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

  const chooseKind = (nextKind: FeedbackKind) => {
    playTap();
    setKind(nextKind);
    setSendState("idle");
    shouldMoveFocusRef.current = true;
  };

  const goBack = () => {
    playTap();
    setKind(null);
    setSendState("idle");
    shouldMoveFocusRef.current = true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!kind || !message.trim() || sendState === "sending") {
      return;
    }

    const website = new FormData(event.currentTarget).get("website");
    playTap();
    setSendState("sending");

    try {
      const response = await fetch("/api/feedback", {
        body: JSON.stringify({
          kind,
          message,
          page: window.location.href,
          telegram: telegram ? `@${telegram}` : "",
          website,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Feedback request failed with ${response.status}`);
      }

      setSendState("sent");
      trackGoal(`feedback_sent_${kind}`);
    } catch {
      setSendState("error");
    }
  };

  useEffect(() => {
    if (isOpen && matchesMedia(FINE_HOVER_QUERY)) {
      (messageRef.current ?? firstOptionRef.current)?.focus({
        preventScroll: true,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!shouldMoveFocusRef.current) {
      return;
    }

    shouldMoveFocusRef.current = false;
    (kind ? messageRef.current : firstOptionRef.current)?.focus({
      preventScroll: true,
    });
  }, [kind]);

  // The panel gets an explicit height that follows its content, so a step change can transition
  // between two heights. Other resizes (textarea drag, error line) follow instantly.
  const stepRef = useRef(step);
  useLayoutEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    const content = contentRef.current;
    if (!isOpen || !content) {
      measuredStepRef.current = null;
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const value = entry.borderBoxSize[0]?.blockSize ?? content.offsetHeight;
      const animate =
        measuredStepRef.current !== null && measuredStepRef.current !== stepRef.current;
      measuredStepRef.current = stepRef.current;
      setPanelHeight({ animate, value });
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [isOpen]);

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
              aria-labelledby={titleId}
              className={styles.panel}
              data-animate-height={panelHeight?.animate || undefined}
              // Only the open/close morph is a layout animation; step changes resize with CSS.
              layoutDependency={0}
              layoutCrossfade={false}
              layoutId={SURFACE_LAYOUT_ID}
              role="dialog"
              style={{
                borderRadius: PANEL_RADIUS,
                height: panelHeight?.value,
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
                <header className={styles.header}>
                  {kind && sendState !== "sent" ? (
                    <Button
                      aria-label="Back to choosing a topic"
                      iconOnly
                      onClick={goBack}
                      size="sm"
                    >
                      <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.8} />
                    </Button>
                  ) : null}
                  <h2 className={styles.title} id={titleId}>
                    {kind
                      ? sendState === "sent"
                        ? kindCopy[kind].sentTitle
                        : kindCopy[kind].title
                      : "Bug or feature?"}
                  </h2>
                  <Button
                    aria-label="Close feedback form"
                    iconOnly
                    onClick={() => {
                      playTap();
                      closePanel();
                    }}
                    size="sm"
                  >
                    <X aria-hidden="true" size={16} strokeWidth={1.7} />
                  </Button>
                </header>

                {!kind ? (
                  <div className={styles.body} key="choose">
                    <p className={styles.description}>
                      Tell me what&apos;s broken or what could be better. It goes straight to my
                      Telegram.
                    </p>
                    <div className={styles.options}>
                      {kindOptions.map(
                        ({ description, icon: Icon, kind: optionKind, label }, index) => (
                          <button
                            className={styles.option}
                            key={optionKind}
                            onClick={() => chooseKind(optionKind)}
                            ref={index === 0 ? firstOptionRef : undefined}
                            type="button"
                          >
                            <span className={styles.optionIcon} data-kind={optionKind}>
                              <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                            </span>
                            <span className={styles.optionText}>
                              <span className={styles.optionLabel}>{label}</span>
                              <span className={styles.optionDescription}>{description}</span>
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className={styles.optionChevron}
                              size={16}
                              strokeWidth={1.8}
                            />
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                ) : sendState === "sent" ? (
                  <div className={styles.body} key="sent">
                    <p className={styles.description}>
                      {telegram.trim()
                        ? "It's already in my Telegram. I'll reply to you there."
                        : "It's already in my Telegram. Add your username next time if you want a reply."}
                    </p>
                    <Button
                      className={styles.submit}
                      onClick={() => {
                        playTap();
                        closePanel();
                      }}
                      variant="primary"
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <form className={styles.body} key={kind} noValidate onSubmit={handleSubmit}>
                    <p className={styles.description}>{kindCopy[kind].description}</p>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={messageId}>
                        {kindCopy[kind].label}
                      </label>
                      <textarea
                        className={`${styles.control} ${styles.textarea}`}
                        id={messageId}
                        maxLength={MAX_MESSAGE_LENGTH}
                        name="message"
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder={kindCopy[kind].placeholder}
                        ref={messageRef}
                        required
                        rows={4}
                        value={message}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor={telegramId}>
                        Your Telegram <span className={styles.optional}>optional</span>
                      </label>
                      <div className={styles.prefixedControl}>
                        <span aria-hidden="true" className={styles.prefix}>
                          @
                        </span>
                        <input
                          aria-describedby={telegramHintId}
                          autoCapitalize="none"
                          autoComplete="off"
                          autoCorrect="off"
                          className={styles.control}
                          id={telegramId}
                          maxLength={32}
                          name="telegram"
                          onChange={(event) => setTelegram(sanitizeTelegram(event.target.value))}
                          placeholder="username"
                          spellCheck={false}
                          type="text"
                          value={telegram}
                        />
                      </div>
                      <p className={styles.hint} id={telegramHintId}>
                        Only if you want a reply.
                      </p>
                    </div>

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

                    <Button
                      className={styles.submit}
                      disabled={!canSubmit}
                      type="submit"
                      variant="primary"
                      {...submitHoverProps}
                    >
                      <HoverShimmer isActive={isSubmitHovered && canSubmit}>
                        {sendState === "sending" ? "Sending…" : "Send"}
                      </HoverShimmer>
                    </Button>
                  </form>
                )}
              </m.div>
            </m.section>
          ) : null}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
