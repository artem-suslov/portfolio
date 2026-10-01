"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Maximize2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import styles from "./steamify-case.module.css";

export function SteamifyCaseContent() {
  const { playTap } = useInteractionSound();

  return (
    <main className={styles.page}>
      <article className={styles.caseStudy}>
        <section className={styles.intro}>
          <div className={styles.caseToolbar}>
            <Link className={styles.homeButton} href="/" onClick={playTap}>
              <ChevronLeft
                aria-hidden="true"
                height={18}
                strokeWidth={1.5}
                width={18}
              />
              <span>Home</span>
            </Link>
          </div>
          <Image alt="Steamify" className={styles.caseLogo} height={24} src="/images/steamify-case/steamify-logo.svg" width={24} />
          <div className={styles.introTitleRow}>
            <h1>Steamify ― Skins Cashout</h1>
            <span>4 min read</span>
          </div>
          <p className={styles.lede}>A mobile cashout service with 500+ withdrawals per day, designed to convert in-game assets into real money.</p>
          <ExpandableCaseVideo alt="Steamify cashout product preview" className={styles.heroVideo} poster="/images/steamify-case/hero-poster.webp" src="/images/steamify-case/hero.mp4" />
          <dl className={styles.details}>
            <div><dt>Team</dt><dd>CEO, 2x Backend Devs, 1x Frontend Dev, Product Designer, QA</dd></div>
            <div><dt>My role</dt><dd>Product Design, Research, Design System, Handoff, Design Review, Analytics</dd></div>
            <div><dt>Timeline</dt><dd>2024–2025</dd></div>
          </dl>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>Problem</p>
          <h2>Steam doesn&apos;t allow users directly withdraw money</h2>
          <p>From a business perspective, I truly understand Steam — they want to keep users&apos; money in their products. But we are on the users&apos; side of course…</p>
          <p>The main goal was to build a seamless cashout experience that converts in-game assets into real money.</p>
          <p>The core challenge was designing a high-conversion, mobile-first cashout flow for a young, price-sensitive audience in a highly competitive market. The process had to minimize drop-offs across multiple steps, build trust in financial transactions, and leverage Telegram integration as a long-term retention channel.</p>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>Research</p>
          <h2>Our competitors are already big…</h2>
          <p>There are at least three well-established services that are widely used within the gaming community. As a new product entering this market, we carefully analyzed their UX patterns, design decisions and feedback in their socials.</p>
          <CaseImage alt="Steamify cashout product interface" src="/images/steamify-case/problem.jpg" />
          <h3 className={styles.subheading}>But how can we stand out?</h3>
          <ul className={styles.numberedList}>
            <li><span>01</span><p>Implement better UX;</p></li>
            <li><span>02</span><p>Reward our users with cashback;</p></li>
            <li><span>03</span><p>Give our users free skins;</p></li>
            <li><span>04</span><p>Provide better prices for their skins.</p></li>
          </ul>
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>Inventory</p>
          <h2>Let us see your inventory!</h2>
          <p>As soon as the user opens our service, they need to enter their Steam trade link so that we can parse their entire inventory and show it on the next step. Without this, it is impossible to continue using the service.</p>
          <CaseImage alt="Steam inventory connection flow" src="/images/steamify-case/research.jpg" />
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>Private inventory</p>
          <h2 className={styles.compactHeading}>But what if the user&apos;s inventory is private?</h2>
          <p className={styles.compactCopy}>Users often had privacy settings enabled, which prevented our parsing and displaying their inventory when the user wanted to view it.</p>
          <p>In this case, I created an explanatory modal window with video-instruction on how to change the privacy settings, since the Steam UX can be complex for some people and it&apos;s hard to find privacy settings inside of it.</p>
          <ExpandableCaseVideo alt="Steam privacy settings instruction" className={styles.mediaVideo} poster="/images/steamify-case/private-inventory-poster.webp" src="/images/steamify-case/private-inventory.mp4" />
        </section>

        <section className={styles.section}>
          <h2>Payment details</h2>
          <p>When the user selects the skins they want to sell, they must meet the minimum sale threshold. We indicate this in a progress bar at the bottom, which fills up as the user selects skins.</p>
          <p>After the user selects the skins, the “Receive money” button becomes available. When clicking it, the user is taken to a simple but very important form for the business — selecting the country, choosing the payment method, and entering payment details.</p>
          <CaseImage alt="Payment details interface" src="/images/steamify-case/payment-details.jpg" />
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>Core flow</p>
          <h2>Create cashout and accept trade</h2>
          <p>After completing the form user move to the core flow ― five-step cashout flow. With 90% of traffic coming from mobile, the flow had to be optimized for small screens and structured to minimize drop-offs.</p>
          <p>The final steps was strategically important: redirecting users to our Telegram bot enabled push notification opt-ins and created a retention channel.</p>
          <p>By moving the CTA from the final payout screen to the earlier 8-day waiting screen, we increased web-to-app conversion from 20% to 50%, addressing a key drop-off point.</p>
          <h3 className={styles.subheading}>Solutions</h3>
          <div className={styles.solutionGrid}>
            <div><span>01</span><p>Built a mobile-first 5-step cashout flow to minimize drop-offs.</p></div>
            <div><span>02</span><p>Integrated the most popular payment methods in Russia to reduce friction and increase transaction completion.</p></div>
            <div><span>03</span><p>Introduced a cashback + Telegram mini-app for retention.</p></div>
            <div><span>04</span><p>Turned Telegram integration into a retention loop through push notifications and re-engagement mechanics.</p></div>
            <div><span>05</span><p>Implemented behavioral design elements, including a progress bar tied to the minimum withdrawal threshold, to increase completion rates and transaction value.</p></div>
          </div>
          <CaseImage alt="Steamify cashout flow" src="/images/steamify-case/core-flow.jpg" />
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>Edge cases</p>
          <h2>Clear feedback keeps trust in the flow</h2>
          <p>Providing clear and relevant feedback is essential when users make mistakes or encounter errors. Since the product involves transactions and external integrations, the flow cannot always be perfectly seamless. In such cases, the design must communicate issues clearly and guide users on how to resolve them.</p>
          <p>Well-structured error states and system messages help maintain trust, reduce confusion, and ensure users can complete the process without unnecessary friction.</p>
          <CaseImage alt="Steamify error states" src="/images/steamify-case/edge-cases.jpg" />
        </section>

        <section className={styles.section}>
          <p className={styles.eyebrow}>Analytics</p>
          <h2>Metabase and Yandex Metrica for analytics</h2>
          <p>We tracked DAU &amp; MAU, $$$ volume, the amount of cashouts from the web and the Telegram app, promo code activations, different types of CRs and other stuff.</p>
          <CaseImage alt="Steamify analytics dashboard" src="/images/steamify-case/analytics.png" />
        </section>

        <section className={`${styles.section} ${styles.impactSection}`}>
          <p className={styles.eyebrow}>Impact</p>
          <h2 className={styles.achievementsHeading}>My achievements</h2>
          <ol className={styles.impactList}>
            <li><span>01</span><p>Redesigned the cashout flow, increasing web-to-Telegram app button CTR from 20% to 50%.</p></li>
            <li><span>02</span><p>Created a design system with 45+ reusable components and Figma Variables-based color tokens.</p></li>
            <li><span>03</span><p>Led frontend design reviews and helped drive the transition from Vue to React, Next.js, and shadcn/ui—improving consistency and delivery speed.</p></li>
          </ol>
        </section>

      </article>
    </main>
  );
}

function CaseImage({ alt, src }: { alt: string; src: string }) {
  return <ExpandableCaseImage alt={alt} className={styles.media} src={src} />;
}

type ModalState = "closed" | "opening" | "open" | "closing";

function ExpandableCaseImage({
  alt,
  className,
  priority = false,
  src,
}: {
  alt: string;
  className: string;
  priority?: boolean;
  src: string;
}) {
  const [modalState, setModalState] = useState<ModalState>("closed");
  const closeTimerRef = useRef<number | null>(null);
  const { playTap } = useInteractionSound();
  const isModalVisible = modalState !== "closed";

  const finishClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setModalState("closed");
  }, []);

  const closeModal = useCallback(() => {
    if (modalState === "closed" || modalState === "closing") {
      return;
    }

    playTap();
    setModalState("closing");
    const closeDuration = Number.parseFloat(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--modal-close-dur"),
    ) || 150;
    closeTimerRef.current = window.setTimeout(finishClose, closeDuration + 50);
  }, [finishClose, modalState, playTap]);

  const openModal = useCallback(() => {
    if (modalState === "open" || modalState === "opening") {
      return;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    playTap();
    setModalState("opening");
  }, [modalState, playTap]);

  useEffect(() => {
    if (modalState !== "opening") {
      return;
    }

    const frame = window.requestAnimationFrame(() => setModalState("open"));

    return () => window.cancelAnimationFrame(frame);
  }, [modalState]);

  useEffect(() => {
    if (!isModalVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isModalVisible]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  return (
    <div className={styles.expandableMedia}>
      <Image alt={alt} className={className} height={1117} priority={priority} src={src} width={2048} />
      <button
        aria-label={`Open ${alt} in modal`}
        className={styles.expandButton}
        onClick={openModal}
        type="button"
      >
        <Maximize2 aria-hidden="true" size={16} strokeWidth={1.5} />
      </button>

      {isModalVisible
        ? createPortal(
            <div
              aria-label={alt}
              aria-modal="true"
              className={`${styles.modalBackdrop} ${
                modalState === "open" ? styles.modalBackdropOpen : ""
              } ${modalState === "closing" ? styles.modalBackdropClosing : ""}`}
              onClick={closeModal}
              role="dialog"
            >
              <div
                className={`${styles.modalPanel} t-modal ${
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
              >
                <button
                  aria-label={`Close ${alt} preview`}
                  autoFocus
                  className={styles.closeButton}
                  onClick={closeModal}
                  type="button"
                >
                  <X aria-hidden="true" size={18} strokeWidth={1.75} />
                </button>
                <Image alt={alt} className={styles.modalImage} height={1117} priority src={src} width={2048} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function ExpandableCaseVideo({
  alt,
  className,
  poster,
  src,
}: {
  alt: string;
  className: string;
  poster?: string;
  src: string;
}) {
  const [modalState, setModalState] = useState<ModalState>("closed");
  const closeTimerRef = useRef<number | null>(null);
  const { playTap } = useInteractionSound();
  const isModalVisible = modalState !== "closed";

  const finishClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setModalState("closed");
  }, []);

  const closeModal = useCallback(() => {
    if (modalState === "closed" || modalState === "closing") {
      return;
    }

    playTap();
    setModalState("closing");
    const closeDuration = Number.parseFloat(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--modal-close-dur"),
    ) || 150;
    closeTimerRef.current = window.setTimeout(finishClose, closeDuration + 50);
  }, [finishClose, modalState, playTap]);

  const openModal = useCallback(() => {
    if (modalState === "open" || modalState === "opening") {
      return;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    playTap();
    setModalState("opening");
  }, [modalState, playTap]);

  useEffect(() => {
    if (modalState !== "opening") {
      return;
    }

    const frame = window.requestAnimationFrame(() => setModalState("open"));

    return () => window.cancelAnimationFrame(frame);
  }, [modalState]);

  useEffect(() => {
    if (!isModalVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isModalVisible]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  return (
    <div className={styles.expandableMedia}>
      <video autoPlay className={className} loop muted playsInline poster={poster} preload="metadata" src={src} />
      <button
        aria-label={`Open ${alt} in modal`}
        className={styles.expandButton}
        onClick={openModal}
        type="button"
      >
        <Maximize2 aria-hidden="true" size={16} strokeWidth={1.5} />
      </button>

      {isModalVisible
        ? createPortal(
            <div
              aria-label={alt}
              aria-modal="true"
              className={`${styles.modalBackdrop} ${
                modalState === "open" ? styles.modalBackdropOpen : ""
              } ${modalState === "closing" ? styles.modalBackdropClosing : ""}`}
              onClick={closeModal}
              role="dialog"
            >
              <div
                className={`${styles.modalPanel} t-modal ${
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
              >
                <button
                  aria-label={`Close ${alt} preview`}
                  autoFocus
                  className={styles.closeButton}
                  onClick={closeModal}
                  type="button"
                >
                  <X aria-hidden="true" size={18} strokeWidth={1.75} />
                </button>
                <video autoPlay className={styles.modalVideo} controls loop muted playsInline preload="metadata" src={src} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
