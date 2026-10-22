"use client";

import { AnimatePresence, m, useReducedMotion, type Variants } from "framer-motion";
import { useId, useState } from "react";
import { useInteractionSound } from "@/components/sound/sound-provider";
import styles from "./hero.module.css";

const CLAUDE_MARK_PATH =
  "M6.279 21.273L12.572 17.744L12.679 17.437L12.572 17.267L12.267 17.267L11.213 17.203L7.616 17.105L4.497 16.976L1.476 16.813L0.715 16.652L0 15.712L0.073 15.243L0.713 14.815L1.628 14.895L3.655 15.032L6.692 15.243L8.895 15.372L12.16 15.712L12.679 15.712L12.752 15.503L12.573 15.372L12.436 15.243L9.292 13.115L5.889 10.864L4.108 9.568L3.143 8.913L2.657 8.297L2.447 6.953L3.321 5.991L4.496 6.071L4.796 6.152L5.987 7.067L8.531 9.035L11.852 11.479L12.339 11.884L12.532 11.747L12.557 11.649L12.339 11.284L10.532 8.023L8.604 4.703L7.745 3.327L7.519 2.501C7.432 2.184 7.386 1.858 7.38 1.529L8.377 0.179L8.928 0L10.256 0.179L10.816 0.664L11.643 2.549L12.979 5.521L15.052 9.561L15.66 10.759L15.984 11.868L16.105 12.208L16.316 12.208L16.316 12.013L16.487 9.739L16.803 6.945L17.109 3.352L17.216 2.339L17.717 1.125L18.713 0.469L19.492 0.843L20.132 1.756L20.043 2.348L19.661 4.816L18.916 8.687L18.431 11.276L18.713 11.276L19.037 10.953L20.351 9.212L22.553 6.46L23.527 5.367L24.66 4.161L25.389 3.587L26.767 3.587L27.78 5.092L27.327 6.647L25.908 8.443L24.733 9.965L23.048 12.232L21.995 14.045L22.092 14.192L22.343 14.165L26.151 13.357L28.208 12.984L30.663 12.564L31.773 13.081L31.895 13.608L31.457 14.684L28.832 15.332L25.753 15.948L21.168 17.032L21.112 17.072L21.177 17.153L23.243 17.348L24.125 17.396L26.288 17.396L30.315 17.696L31.368 18.392L32 19.243L31.895 19.889L30.275 20.716L28.088 20.197L22.983 18.984L21.233 18.545L20.991 18.545L20.991 18.692L22.448 20.116L25.123 22.529L28.468 25.636L28.637 26.407L28.208 27.013L27.755 26.948L24.815 24.739L23.68 23.743L21.112 21.583L20.941 21.583L20.941 21.809L21.533 22.675L24.66 27.369L24.823 28.809L24.596 29.28L23.785 29.564L22.895 29.401L21.063 26.835L19.176 23.945L17.652 21.355L17.465 21.461L16.567 31.133L16.145 31.627L15.173 32L14.364 31.385L13.935 30.389L14.364 28.421L14.883 25.856L15.303 23.816L15.684 21.283L15.911 20.44L15.895 20.384L15.708 20.408L13.796 23.031L10.889 26.957L8.588 29.417L8.036 29.636L7.08 29.143L7.169 28.26L7.704 27.475L10.888 23.427L12.808 20.917L14.048 19.469L14.04 19.259L13.967 19.259L5.509 24.747L4.003 24.941L3.353 24.333L3.435 23.339L3.743 23.015L6.287 21.265Z";

/** The Codex cloud outline; the filled mark adds the ">_" prompt cut out of it. */
const CODEX_CLOUD_PATH =
  "M12.128 0.688C13.572 0.096 15.148-0.12 16.696 0.064 18.696 0.296 20.48 1.144 22.044 2.616 22.064 2.636 22.092 2.648 22.116 2.656 22.144 2.664 22.176 2.664 22.204 2.656 24.236 2.132 26.388 2.324 28.296 3.208L28.62 3.364C30.616 4.376 32.172 6.084 32.996 8.164 33.416 9.184 33.624 10.244 33.628 11.352 33.656 12.176 33.568 13 33.36 13.8 33.348 13.84 33.348 13.88 33.36 13.92 33.372 13.96 33.392 14 33.42 14.028 34.608 15.244 35.396 16.688 35.784 18.368 36.364 21.22 35.772 23.788 34.012 26.076L33.74 26.408C32.572 27.744 31.044 28.708 29.336 29.184 29.3 29.196 29.268 29.216 29.24 29.24 29.212 29.268 29.188 29.3 29.176 29.336 28.792 30.44 28.408 31.384 27.696 32.324 25.896 34.7 23.252 36.016 20.272 36 17.9 35.988 15.796 35.12 13.96 33.396 13.932 33.372 13.9 33.352 13.86 33.344 13.824 33.336 13.784 33.336 13.748 33.348 12.972 33.6 12.188 33.636 11.34 33.624 9.992 33.612 8.66 33.296 7.452 32.692 6.184 32.064 5.084 31.152 4.232 30.024 3.928 29.62 3.624 29.24 3.404 28.788 3.1 28.172 2.852 27.528 2.664 26.868 2.264 25.36 2.256 23.78 2.636 22.272 2.648 22.236 2.652 22.196 2.648 22.16 2.64 22.12 2.62 22.088 2.592 22.064 1.668 21.128 0.964 20 0.524 18.76 0.236 17.996 0.064 17.192 0.024 16.376-0.048 15.3 0.048 14.224 0.304 13.176 0.98 10.952 2.268 9.208 4.172 7.94 4.596 7.66 4.996 7.44 5.372 7.28 5.804 7.104 6.232 6.952 6.664 6.828 6.696 6.816 6.724 6.8 6.748 6.776 6.768 6.752 6.788 6.724 6.796 6.696 7.124 5.516 7.688 4.416 8.452 3.464 9.42 2.24 10.684 1.284 12.128 0.688Z";

/** A smaller white cloud under the mark, so the ">_" cut-out reads white, not the pill. */
const CODEX_BACKING_PATH =
  "M13.596 5.016C14.679 4.572 15.861 4.41 17.022 4.548 18.522 4.722 19.86 5.358 21.033 6.462 21.048 6.477 21.069 6.486 21.087 6.492 21.108 6.498 21.132 6.498 21.153 6.492 22.677 6.099 24.291 6.243 25.722 6.906 25.722 6.906 25.791 6.939 25.791 6.939 25.791 6.939 25.965 7.023 25.965 7.023 27.462 7.782 28.629 9.063 29.247 10.623 29.562 11.388 29.718 12.183 29.721 13.014 29.742 13.632 29.676 14.25 29.52 14.85 29.511 14.88 29.511 14.91 29.52 14.94 29.529 14.97 29.544 15 29.565 15.021 30.456 15.933 31.047 17.016 31.338 18.276 31.773 20.415 31.329 22.341 30.009 24.057 30.009 24.057 29.805 24.306 29.805 24.306 28.929 25.308 27.783 26.031 26.502 26.388 26.475 26.397 26.451 26.412 26.43 26.43 26.409 26.451 26.391 26.475 26.382 26.502 26.094 27.33 25.806 28.038 25.272 28.743 23.922 30.525 21.939 31.512 19.704 31.5 17.925 31.491 16.347 30.84 14.97 29.547 14.949 29.529 14.925 29.514 14.895 29.508 14.868 29.502 14.838 29.502 14.811 29.511 14.229 29.7 13.641 29.727 13.005 29.718 11.994 29.709 10.994 29.472 10.088 29.019 9.137 28.548 8.312 27.864 7.673 27.018 7.445 26.715 7.217 26.43 7.052 26.091 6.824 25.629 6.638 25.146 6.497 24.651 6.197 23.52 6.191 22.335 6.476 21.204 6.485 21.177 6.488 21.147 6.485 21.12 6.479 21.09 6.464 21.066 6.443 21.048 5.75 20.346 5.222 19.5 4.892 18.57 4.676 17.997 4.547 17.394 4.517 16.782 4.463 15.975 4.535 15.168 4.727 14.382 5.234 12.714 6.2 11.406 7.628 10.455 7.946 10.245 8.246 10.08 8.528 9.96 8.852 9.828 9.173 9.714 9.497 9.621 9.521 9.612 9.542 9.6 9.56 9.582 9.575 9.564 9.59 9.543 9.596 9.522 9.842 8.637 10.265 7.812 10.838 7.098 11.565 6.18 12.513 5.463 13.596 5.016Z";

const CODEX_PROMPT_PATH =
  "M19.092 21.82C18.768 21.836 18.46 21.98 18.236 22.216 18.012 22.452 17.888 22.764 17.888 23.092 17.888 23.416 18.012 23.728 18.236 23.964 18.46 24.204 18.768 24.344 19.092 24.364L26.364 24.364C26.536 24.372 26.708 24.348 26.872 24.288 27.036 24.228 27.184 24.136 27.312 24.016 27.436 23.896 27.536 23.752 27.604 23.596 27.672 23.436 27.708 23.264 27.708 23.092 27.708 22.916 27.672 22.744 27.604 22.588 27.536 22.428 27.436 22.284 27.312 22.164 27.184 22.044 27.036 21.952 26.872 21.896 26.708 21.836 26.536 21.808 26.364 21.82L19.092 21.82ZM10.924 12.46C10.752 12.18 10.476 11.976 10.156 11.892 9.832 11.812 9.492 11.856 9.208 12.02 8.92 12.184 8.708 12.452 8.616 12.772 8.524 13.088 8.556 13.432 8.712 13.724L11.256 18.172 8.724 22.444C8.64 22.588 8.584 22.744 8.56 22.912 8.536 23.076 8.544 23.244 8.584 23.408 8.628 23.568 8.7 23.72 8.8 23.856 8.9 23.988 9.024 24.1 9.168 24.188 9.312 24.272 9.472 24.328 9.64 24.352 9.804 24.376 9.972 24.368 10.132 24.324 10.296 24.284 10.448 24.212 10.58 24.112 10.716 24.012 10.828 23.884 10.912 23.74L13.82 18.832C13.936 18.636 13.996 18.416 14 18.192 14 17.968 13.944 17.744 13.832 17.552L10.924 12.46Z";

type Tool = "claude" | "chatgpt";

/** The soft sticker shadow both marks sit on. */
function MarkShadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
      <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.06" />
      <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.1" />
    </filter>
  );
}

function ClaudeMark() {
  const shadowId = useId();

  return (
    <svg className={styles.aiToolMark} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <defs>
        <MarkShadow id={shadowId} />
      </defs>
      <g transform="translate(2 2)">
        {/* White sticker outline under the mark. */}
        <path
          d={CLAUDE_MARK_PATH}
          fill="#fff"
          stroke="#fff"
          strokeWidth="4.778"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${shadowId})`}
        />
        <path d={CLAUDE_MARK_PATH} fill="#d97757" />
      </g>
    </svg>
  );
}

function CodexMark() {
  const gradientId = useId();
  const shadowId = useId();

  return (
    <svg
      className={`${styles.aiToolMark} ${styles.codexMark}`}
      viewBox="0 0 36 36"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#b1a7ff" />
          <stop offset="0.5" stopColor="#7a9dff" />
          <stop offset="1" stopColor="#3941ff" />
        </linearGradient>
        <MarkShadow id={shadowId} />
      </defs>
      <g filter={`url(#${shadowId})`}>
        <path d={CODEX_BACKING_PATH} fill="#fff" />
        <path
          d={`${CODEX_CLOUD_PATH}${CODEX_PROMPT_PATH}`}
          fillRule="nonzero"
          fill={`url(#${gradientId})`}
        />
        <path d={CODEX_CLOUD_PATH} fill="none" stroke="#fff" strokeWidth="2" />
      </g>
    </svg>
  );
}

const TOOL_NAMES: Record<Tool, string> = { claude: "Claude", chatgpt: "ChatGPT" };

// Strong ease-out (same curve as --ease-out-snappy).
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const LETTER_STAGGER = 0.02;

type LetterPosition = { index: number; count: number };

const MARK_SPRING = { type: "spring", duration: 0.5, bounce: 0.25 } as const;

const FADE_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.2 } },
  gone: { opacity: 0, transition: { duration: 0.15 } },
};

const MARK_VARIANTS: Variants = {
  hidden: { opacity: 0, transform: "rotate(-90deg) scale(0.5)" },
  shown: {
    opacity: 1,
    transform: "rotate(0deg) scale(1)",
    transition: { ...MARK_SPRING, opacity: { duration: 0.15 } },
  },
  gone: {
    opacity: 0,
    transform: "rotate(90deg) scale(0.5)",
    transition: { duration: 0.18, ease: EASE_OUT },
  },
};

/** Letters roll up out of the line and in from below it, one after another. */
const LETTER_VARIANTS: Variants = {
  hidden: { opacity: 0, transform: "translateY(100%)" },
  shown: ({ index }: LetterPosition) => ({
    opacity: 1,
    transform: "translateY(0%)",
    transition: { duration: 0.32, ease: EASE_OUT, delay: index * LETTER_STAGGER },
  }),
  // Leaves as unhurriedly as it arrives, so the swap reads as one roll, not a cut. Letters
  // leave from the end, so a longer outgoing name clears the pill's right edge first.
  gone: ({ index, count }: LetterPosition) => ({
    opacity: 0,
    transform: "translateY(-100%)",
    transition: { duration: 0.32, ease: EASE_OUT, delay: (count - 1 - index) * LETTER_STAGGER },
  }),
};

/** "Claude" with its mark, set inline in the hero headline; a click swaps it for ChatGPT and back.
    The marks swap with a spin, and the letters after the shared "C" roll like a flap display. */
export function AiToolChip() {
  const { playTap } = useInteractionSound();
  const reduceMotion = useReducedMotion();
  const [tool, setTool] = useState<Tool>("claude");
  const name = TOOL_NAMES[tool];
  // Both names start with "C", so it stays put while the rest rolls.
  const tail = name.slice(1).split("");
  // Reduced motion keeps the crossfade and drops the spin and roll.
  const presence = { initial: "hidden", animate: "shown", exit: "gone" } as const;

  return (
    <button
      type="button"
      className={styles.aiToolChip}
      data-tool={tool}
      aria-label={name}
      onClick={() => {
        setTool((current) => (current === "claude" ? "chatgpt" : "claude"));
        playTap();
      }}
    >
      {/* The pill's fill is its own layer: when the name changes width, Motion eases it with
          scaleX and corrects the rounded ends, while the mark and letters stay unscaled. */}
      <m.span
        layout={!reduceMotion}
        // Narrowing waits for the outgoing name's last letters to fade, so they never
        // hang past the pill's edge; widening starts at once to make room for the new ones.
        transition={{
          layout: { duration: 0.32, ease: EASE_OUT, delay: tool === "claude" ? 0.1 : 0 },
        }}
        style={{ borderRadius: 999 }}
        className={styles.aiToolFill}
        aria-hidden="true"
      />
      <span className={styles.aiToolMarkSlot} aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={tool}
            className={styles.aiToolMarkFrame}
            variants={reduceMotion ? FADE_VARIANTS : MARK_VARIANTS}
            {...presence}
          >
            {tool === "claude" ? <ClaudeMark /> : <CodexMark />}
          </m.span>
        </AnimatePresence>
      </span>
      <span className={styles.aiToolName} aria-hidden="true">
        C
        <span className={styles.aiToolTail}>
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span key={tool} className={styles.aiToolTailWord}>
              {tail.map((letter, index) => (
                <m.span
                  key={`${letter}-${index}`}
                  custom={{ index, count: tail.length } satisfies LetterPosition}
                  className={styles.aiToolLetter}
                  variants={reduceMotion ? FADE_VARIANTS : LETTER_VARIANTS}
                  {...presence}
                >
                  {letter}
                </m.span>
              ))}
            </m.span>
          </AnimatePresence>
        </span>
      </span>
    </button>
  );
}
