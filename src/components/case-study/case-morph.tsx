import { ViewTransition, type ReactNode } from "react";

/**
 * Pairs a home page cover with its case-study hero: wrap both in `CaseMorph`
 * with the same `slug` and navigation morphs one into the other.
 * Styled by the `.case-morph` view-transition rules in `globals.css`.
 */
export function CaseMorph({ children, slug }: { children: ReactNode; slug: string }) {
  return (
    <ViewTransition default="none" name={`case-${slug}`} share="case-morph">
      {children}
    </ViewTransition>
  );
}
