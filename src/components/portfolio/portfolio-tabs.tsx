"use client";

import { m, useReducedMotion } from "framer-motion";
import { type ReactNode, useState } from "react";
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

  return (
    <>
      {showTabs ? (
        <div className={tabsClassName}>
          <AnimatedTabs
            activeTab={activeTab}
            onChange={(tabId, animate) => {
              setShouldAnimatePanel(animate);
              setActiveTab(tabId as TabId);
            }}
            tabs={tabs}
          />
        </div>
      ) : null}
      <m.div
        animate={{ opacity: 1, transform: "translateY(0)" }}
        initial={
          shouldAnimate ? { opacity: 0, transform: "translateY(6px)" } : false
        }
        key={activeTab}
        role="tabpanel"
        className={panelClassName}
        transition={shouldAnimate ? panelTransition : { duration: 0 }}
      >
        {panels[activeTab]}
      </m.div>
    </>
  );
}
