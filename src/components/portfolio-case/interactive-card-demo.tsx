"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dithering, MeshGradient } from "@paper-design/shaders-react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import { isMouseHover, matchesMedia, REDUCED_MOTION_QUERY } from "@/lib/media";
import styles from "./interactive-card-demo.module.css";

const RESET_TRANSFORM =
  "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const COLOR_MORPH_DURATION = 420;
const CARD_GRAIN_OVERLAY = 0.27;
const CARD_GRAIN_MIXER = 0.46;

type ThemeId = "ember" | "gold" | "cyan" | "pink";
type ModalState = "closed" | "opening" | "open" | "closing";

interface CardTheme {
  id: ThemeId;
  colors: [string, string];
  base: string;
  meshColors: [string, string];
  glowColors: [string, string];
}

const rawCardThemes: Array<{
  id: ThemeId;
  colors: [string, string];
}> = [
  { id: "ember", colors: ["#0DF869", "#051B0B"] },
  { id: "gold", colors: ["#E98332", "#2A1000"] },
  { id: "cyan", colors: ["#00BDC5", "#F2F2F2"] },
  { id: "pink", colors: ["#DB2B89", "#F4CADE"] },
];

const cardThemes: CardTheme[] = rawCardThemes.map(normalizeTheme);

export default function InteractiveCardDemo() {
  const [modalState, setModalState] = useState<ModalState>("closed");
  const [selectedThemeId, setSelectedThemeId] =
    useState<ThemeId>("ember");
  const { playTap } = useInteractionSound();
  const closeTimerRef = useRef<number | null>(null);
  const isModalVisible = modalState !== "closed";

  const selectedTheme = useMemo(
    () =>
      cardThemes.find((theme) => theme.id === selectedThemeId) ??
      cardThemes[0],
    [selectedThemeId],
  );
  const animatedTheme = useAnimatedTheme(
    selectedTheme,
    COLOR_MORPH_DURATION,
  );

  const selectTheme = useCallback((themeId: ThemeId) => {
    if (themeId === selectedThemeId) {
      return;
    }

    playTap();
    setSelectedThemeId(themeId);
  }, [playTap, selectedThemeId]);

  const finishClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setModalState("closed");
  }, []);

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

  const closeModal = useCallback(() => {
    if (modalState === "closed" || modalState === "closing") {
      return;
    }

    playTap();
    setModalState("closing");
    const closeDuration =
      Number.parseFloat(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("--modal-close-dur"),
      ) || 150;
    closeTimerRef.current = window.setTimeout(
      finishClose,
      closeDuration + 50,
    );
  }, [finishClose, modalState, playTap]);

  useEffect(() => {
    if (modalState !== "opening") {
      return;
    }

    const frame = window.requestAnimationFrame(() => setModalState("open"));

    return () => window.cancelAnimationFrame(frame);
  }, [modalState]);

  useEffect(() => {
    if (!isModalVisible) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
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
    <div className={styles.demo}>
      <div className={styles.composition}>
        <CardStage theme={animatedTheme} />

        <div
          aria-label="Card color"
          className={styles.selector}
          role="radiogroup"
        >
          {cardThemes.map((theme) => (
            <button
              aria-checked={selectedThemeId === theme.id}
              aria-label={theme.id}
              className={styles.swatch}
              key={theme.id}
              onClick={() => selectTheme(theme.id)}
              role="radio"
              type="button"
            >
              <span
                className={styles.swatchColor}
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme.colors[0]} 0 50%, ${theme.colors[1]} 50% 100%)`,
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <span className={styles.hint}>Hover on card</span>
        <button
          aria-label="Open card in modal"
          className={styles.expandButton}
          onClick={openModal}
          type="button"
        >
          <Maximize2 aria-hidden="true" size={16} strokeWidth={1.5} />
        </button>
      </div>

      {isModalVisible
        ? createPortal(
            <div
              aria-label="Interactive card preview"
              aria-modal="true"
              className={`${styles.modalBackdrop} ${
                modalState === "open" ? styles.modalBackdropOpen : ""
              } ${
                modalState === "closing" ? styles.modalBackdropClosing : ""
              }`}
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
                  aria-label="Close card preview"
                  autoFocus
                  className={styles.closeButton}
                  onClick={closeModal}
                  type="button"
                >
                  <X aria-hidden="true" size={18} strokeWidth={1.75} />
                </button>
                <CardStage modal theme={animatedTheme} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function CardStage({
  modal = false,
  theme,
}: {
  modal?: boolean;
  theme: CardTheme;
}) {
  const canUseShaders = useCanUseShaders();
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      !isMouseHover(event) ||
      matchesMedia(REDUCED_MOTION_QUERY)
    ) {
      return;
    }

    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card || !spotlight) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 8;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.04)`;
      card.style.boxShadow = "0 26px 56px rgb(5 27 11 / 26%)";
      spotlight.style.opacity = "0.08";
      spotlight.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgb(255 255 255 / 34%), transparent 44%)`;
    });
  };

  const handlePointerLeave = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (cardRef.current) {
      cardRef.current.style.transform = RESET_TRANSFORM;
      cardRef.current.style.boxShadow = "0 18px 40px rgb(5 27 11 / 18%)";
    }

    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  return (
    <div className={`${styles.stage} ${modal ? styles.modalStage : ""}`}>
      {canUseShaders ? (
        <MeshGradient
          colors={theme.glowColors}
          distortion={0.7}
          frame={4724338.63399413}
          scale={0.5}
          speed={1}
          style={{
            filter: "blur(100px)",
            height: "250px",
            left: "50%",
            opacity: 0.6,
            pointerEvents: "none",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
          }}
          swirl={0.1}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle, ${theme.glowColors[0]}, ${theme.glowColors[1]} 70%)`,
            filter: "blur(100px)",
            height: "250px",
            left: "50%",
            opacity: 0.6,
            pointerEvents: "none",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
          }}
        />
      )}

      <div
        className={styles.card}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        ref={cardRef}
        style={{ transitionTimingFunction: EASE_OUT }}
      >
        <div className={styles.face} style={{ backgroundColor: theme.base }}>
          <Image
            alt="Vezdekarta"
            className={styles.cardArtwork}
            fill
            sizes="392px"
            src="/assets/redcard.svg"
            unoptimized
          />

          {canUseShaders ? (
            <MeshGradient
              colors={theme.meshColors}
              distortion={0.9}
              frame={4645010.753993971}
              grainMixer={CARD_GRAIN_MIXER}
              grainOverlay={CARD_GRAIN_OVERLAY}
              scale={1}
              speed={2}
              style={{
                height: "331px",
                left: "50%",
                opacity: 1,
                pointerEvents: "none",
                position: "absolute",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "520px",
                zIndex: 1,
              }}
              swirl={0.69}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                background: `linear-gradient(135deg, ${theme.meshColors[0]}, ${theme.meshColors[1]})`,
                inset: 0,
                opacity: 0.42,
                pointerEvents: "none",
                position: "absolute",
                zIndex: 1,
              }}
            />
          )}

          {canUseShaders && theme.id === "gold" ? (
            <Dithering
              colorBack="#00000000"
              colorFront="#E983324D"
              frame={599502.1000000839}
              scale={1}
              shape="swirl"
              size={1.9}
              speed={1}
              style={{
                backgroundColor: "#00000000",
                height: "406px",
                left: "50%",
                pointerEvents: "none",
                position: "absolute",
                top: "-63px",
                transform: "translateX(-50%)",
                width: "542px",
                zIndex: 2,
              }}
              type="4x4"
            />
          ) : null}

          <CardLogoOverlay />
          <div className={styles.spotlight} ref={spotlightRef} />
        </div>
      </div>
    </div>
  );
}

function useCanUseShaders() {
  const [canUseShaders, setCanUseShaders] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCanUseShaders(canUseWebGL2());
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return canUseShaders;
}

function canUseWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");

    context?.getExtension("WEBGL_lose_context")?.loseContext();

    return context !== null;
  } catch {
    return false;
  }
}

function normalizeTheme(theme: {
  id: ThemeId;
  colors: [string, string];
}): CardTheme {
  const [base, accent] = theme.colors;

  return {
    ...theme,
    base,
    meshColors: [base, accent],
    glowColors: [base, accent],
  };
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((channel) =>
      Math.round(channel).toString(16).padStart(2, "0"),
    )
    .join("")
    .toUpperCase()}`;
}

function mixHex(from: string, to: string, progress: number) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);

  return rgbToHex({
    r: start.r + (end.r - start.r) * progress,
    g: start.g + (end.g - start.g) * progress,
    b: start.b + (end.b - start.b) * progress,
  });
}

function mixTheme(from: CardTheme, to: CardTheme, progress: number) {
  return {
    ...to,
    base: mixHex(from.base, to.base, progress),
    meshColors: to.meshColors.map((color, index) =>
      mixHex(from.meshColors[index] ?? color, color, progress),
    ) as [string, string],
    glowColors: to.glowColors.map((color, index) =>
      mixHex(from.glowColors[index] ?? color, color, progress),
    ) as [string, string],
  };
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function useAnimatedTheme(targetTheme: CardTheme, duration: number) {
  const [animatedTheme, setAnimatedTheme] = useState(targetTheme);
  const animatedThemeRef = useRef(targetTheme);

  useEffect(() => {
    if (animatedThemeRef.current.id === targetTheme.id) return;

    let animationFrame = 0;
    const startedAt = performance.now();
    const fromTheme = animatedThemeRef.current;

    const tick = (now: number) => {
      const linearProgress = Math.min((now - startedAt) / duration, 1);
      const nextTheme = mixTheme(
        fromTheme,
        targetTheme,
        easeOutCubic(linearProgress),
      );

      animatedThemeRef.current = nextTheme;
      setAnimatedTheme(nextTheme);

      if (linearProgress < 1) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        animatedThemeRef.current = targetTheme;
        setAnimatedTheme(targetTheme);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, targetTheme]);

  return animatedTheme;
}

function CardLogoOverlay() {
  return (
    <svg
      aria-hidden="true"
      className={styles.logo}
      fill="none"
      height="256"
      viewBox="0 0 256 256"
      width="256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 100 136 C 111.046 136 120 144.954 120 156 L 120 256 L 100 256 C 44.772 256 0 211.228 0 156 L 0 136 Z M 256 256 L 136 256 L 136 156 C 136 144.954 144.954 136 156 136 L 256 136 Z M 120 100 C 120 111.046 111.046 120 100 120 L 0 120 L 0 100 C 0 44.772 44.772 0 100 0 L 120 0 Z M 156 0 C 211.228 0 256 44.772 256 100 L 256 120 L 156 120 C 144.954 120 136 111.046 136 100 L 136 0 Z"
        fill="#CFCFCF"
      />
    </svg>
  );
}
