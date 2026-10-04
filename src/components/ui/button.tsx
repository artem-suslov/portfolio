import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./button.module.css";

/** `overlay` is a dark translucent button for controls drawn over photos and video. */
export type ButtonVariant = "outline" | "primary" | "overlay";
/** Height: `sm` 28px, `md` 32px, `lg` 44px (floating buttons). */
export type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleProps = {
  /** Circular button for a single icon; pass an `aria-label`. */
  iconOnly?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

function buttonClassName({
  className,
  iconOnly = false,
  size = "md",
  variant = "outline",
}: ButtonStyleProps & { className?: string }) {
  return [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly ? styles.iconOnly : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Pill-shaped text button (or a circle with `iconOnly`). Callers play `playTap()`
 * in their own handlers, since not every activation should make a sound.
 */
export function Button({
  className,
  iconOnly,
  size,
  type = "button",
  variant,
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return (
    <button
      className={buttonClassName({ className, iconOnly, size, variant })}
      type={type}
      {...props}
    />
  );
}

/** A link styled as `Button`; works for internal routes and external URLs. */
export function ButtonLink({
  className,
  iconOnly,
  size,
  variant,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={buttonClassName({ className, iconOnly, size, variant })} {...props} />;
}
