"use client";

import { m, useReducedMotion } from "framer-motion";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { AnimatedTabs, type Tab } from "@/components/ui/animated-tabs";

const panelTransition = { duration: 0.18, ease: [0.23, 1, 0.32, 1] } as const;

export function PortfolioTabs<TabId extends string>({
  panelClassName,
  panels,
  showTabs,
  tabs,
  tabsClassName,
}: {
  panelClassName?: string;
  panels: Record<TabId, ReactNode>;
  showTabs: boolean;
  tabs: readonly (Tab & { id: TabId })[];
  tabsClassName?: string;
}) {
  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);
  const [shouldAnimatePanel, setShouldAnimatePanel] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = shouldAnimatePanel && !prefersReducedMotion;
  const panelFrameRef = useRef<HTMLDivElement>(null);

  // React removes the old panel before inserting the new one, and the tab
  // bubble's layout measurement lands in that gap: the page is briefly one
  // screen tall and the browser clamps the scroll position to the top. The
  // frame holds the old height until the new panel is in place.
  useLayoutEffect(() => {
    panelFrameRef.current?.style.removeProperty("min-height");
  }, [activeTab]);

  return (
    <>
      {showTabs ? (
        <div className={tabsClassName}>
          <AnimatedTabs
            activeTab={activeTab}
            onChange={(tabId, animate) => {
              const panelFrame = panelFrameRef.current;
              if (panelFrame) {
                panelFrame.style.minHeight = `${panelFrame.offsetHeight}px`;
              }

              setShouldAnimatePanel(animate);
              setActiveTab(tabId as TabId);
            }}
            tabs={tabs}
          />
        </div>
      ) : null}
      <div className={panelClassName} ref={panelFrameRef}>
        <m.div
          animate={{ opacity: 1, transform: "translateY(0)" }}
          initial={
            shouldAnimate ? { opacity: 0, transform: "translateY(6px)" } : false
          }
          key={activeTab}
          role="tabpanel"
          transition={shouldAnimate ? panelTransition : { duration: 0 }}
        >
          {panels[activeTab]}
        </m.div>
      </div>
    </>
  );
}
