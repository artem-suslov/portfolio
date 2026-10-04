"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { Bug, ChevronLeft, ChevronRight, Lightbulb, X } from "lucide-react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { Button } from "@/components/ui/button";
import { HoverShimmer } from "@/components/ui/hover-shimmer";
import { useMouseHover } from "@/components/ui/use-mouse-hover";
import { trackGoal } from "@/lib/analytics";
import { FINE_HOVER_QUERY, matchesMedia } from "@/lib/media";
import { useEscapeKey, useModalPhase } from "@/lib/modal";
import styles from "./feedback-widget.module.css";

type SendState = "idle" | "sending" | "sent" | "error";
type FeedbackKind = "bug" | "idea";

const MAX_MESSAGE_LENGTH = 2000;

/**
 * Telegram usernames use only Latin letters, digits and "_". Keeps an optional leading "@"
 * and turns a pasted t.me link into "@name".
 */
function sanitizeTelegram(value: string) {
  const withoutLink = value.trimStart().replace(/^(https?:\/\/)?(t|telegram)\.me\//i, "@");
  const hasAt = withoutLink.startsWith("@");
  return (hasAt ? "@" : "") + withoutLink.replace(/[^a-z0-9_]/gi, "");
}

const kindOptions = [
  {
    description: "A glitch, a broken link, a layout that fell apart",
    icon: Bug,
    kind: "bug",
    label: "Something's broken",
  },
  {
    description: "A detail to add or something to do better",
    icon: Lightbulb,
    kind: "idea",
    label: "I have an idea",
  },
] as const;

const kindCopy = {
  bug: {
    description: "Just describe what broke; I'll get the page and your browser automatically.",
    label: "What went wrong?",
    placeholder: "The video in the Steamify case froze on my iPhone",
    sentTitle: "Got it, I'll take a look",
    title: "Report a bug",
  },
  idea: {
    description: "Anything from a missing detail in a case study to how the site feels on a phone.",
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
  const [panelHeight, setPanelHeight] = useState<{ animate: boolean; value: number } | null>(null);
  const step = !kind ? "choose" : sendState === "sent" ? "sent" : kind;
  const canSubmit = message.trim() !== "" && sendState !== "sending";

  const {
    handleTransitionEnd,
    isMounted: isPanelVisible,
    phase: panelState,
  } = useModalPhase(isOpen, {
    // A sent form starts over from the first step; an unsent draft stays where it was.
    onClosed: () => {
      if (sendState === "sent") {
        setMessage("");
      }
      if (sendState === "sent" || !message.trim()) {
        setKind(null);
      }
      if (sendState !== "sending") {
        setSendState("idle");
      }
    },
  });

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
        body: JSON.stringify({ kind, message, page: window.location.href, telegram, website }),
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
    if (panelState === "open" && matchesMedia(FINE_HOVER_QUERY)) {
      (messageRef.current ?? firstOptionRef.current)?.focus();
    }
  }, [panelState]);

  useEffect(() => {
    if (!shouldMoveFocusRef.current) {
      return;
    }

    shouldMoveFocusRef.current = false;
    (kind ? messageRef.current : firstOptionRef.current)?.focus({ preventScroll: true });
  }, [kind]);

  // The panel gets an explicit height that follows its content, so a step change can transition
  // between two heights. Other resizes (textarea drag, error line) follow instantly.
  const stepRef = useRef(step);
  useLayoutEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    const content = contentRef.current;
    if (!isPanelVisible || !content) {
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
  }, [isPanelVisible]);

  useEffect(() => {
    if (panelState !== "open") {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closePanel();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [panelState]);

  useEscapeKey(isPanelVisible, () => {
    closePanel();
    if (matchesMedia(FINE_HOVER_QUERY)) {
      triggerRef.current?.focus();
    }
  });

  return (
    <div className={styles.root} ref={rootRef}>
      {isPanelVisible ? (
        <section
          aria-labelledby={titleId}
          className={styles.panel}
          data-state={panelState}
          onTransitionEnd={handleTransitionEnd}
          role="dialog"
          style={panelHeight ? { height: panelHeight.value } : undefined}
          data-animate-height={panelHeight?.animate || undefined}
        >
          <div className={styles.content} ref={contentRef}>
            <header className={styles.header}>
              {kind && sendState !== "sent" ? (
                <Button aria-label="Back to choosing a topic" iconOnly onClick={goBack} size="sm">
                  <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.8} />
                </Button>
              ) : null}
              <h2 className={styles.title} id={titleId}>
                {kind ? (sendState === "sent" ? kindCopy[kind].sentTitle : kindCopy[kind].title) : "Bug or feature?"}
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
                  Found something broken, or have an idea for the portfolio? Pick one and tell me
                  about it; the message goes straight to my Telegram.
                </p>
                <div className={styles.options}>
                  {kindOptions.map(({ description, icon: Icon, kind: optionKind, label }, index) => (
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
                  ))}
                </div>
              </div>
            ) : sendState === "sent" ? (
              <div className={styles.body} key="sent">
                <p className={styles.description}>
                  {telegram.trim()
                    ? "The message is already in my Telegram, and I'll write back to you there."
                    : "The message is already in my Telegram. Leave your username next time if you'd like an answer."}
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
                  <input
                    aria-describedby={telegramHintId}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    className={styles.control}
                    id={telegramId}
                    maxLength={33}
                    name="telegram"
                    onChange={(event) => setTelegram(sanitizeTelegram(event.target.value))}
                    placeholder="@username"
                    spellCheck={false}
                    type="text"
                    value={telegram}
                  />
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
                    It didn&apos;t go through. Try once more, or write to me directly at @art_ew.
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
          </div>
        </section>
      ) : null}

      <Button
        aria-expanded={isPanelVisible}
        aria-haspopup="dialog"
        aria-label="Report a bug or leave feedback"
        className={styles.trigger}
        data-active={isPanelVisible || undefined}
        iconOnly
        onClick={togglePanel}
        ref={triggerRef}
        size="lg"
      >
        <Bug aria-hidden="true" size={18} strokeWidth={1.8} />
      </Button>
    </div>
  );
}
