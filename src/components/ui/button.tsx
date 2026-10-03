import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./button.module.css";

export type ButtonVariant = "outline" | "primary";

type ButtonStyleProps = {
  /** Circular 32px button for a single icon; pass an `aria-label`. */
  iconOnly?: boolean;
  variant?: ButtonVariant;
};

function buttonClassName({
  className,
  iconOnly = false,
  variant = "outline",
}: ButtonStyleProps & { className?: string }) {
  return [styles.button, styles[variant], iconOnly ? styles.iconOnly : null, className]
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
  type = "button",
  variant,
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return (
    <button
      className={buttonClassName({ className, iconOnly, variant })}
      type={type}
      {...props}
    />
  );
}

/** A link styled as `Button`; works for internal routes and external URLs. */
export function ButtonLink({
  className,
  iconOnly,
  variant,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={buttonClassName({ className, iconOnly, variant })} {...props} />;
}
