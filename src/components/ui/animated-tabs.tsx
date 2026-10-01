"use client";

import { m } from "framer-motion";
import { useInteractionSound } from "@/components/sound/sound-provider";
import styles from "./animated-tabs.module.css";

export interface Tab {
  id: string;
  label: string;
}

interface AnimatedTabsProps {
  activeTab: string;
  /** `shouldAnimate` is false for keyboard activation, which skips the panel transition. */
  onChange: (tabId: string, shouldAnimate: boolean) => void;
  tabs: readonly Tab[];
}

export function AnimatedTabs({ activeTab, onChange, tabs }: AnimatedTabsProps) {
  const { playTap } = useInteractionSound();

  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            aria-selected={isActive}
            className={styles.tab}
            key={tab.id}
            onClick={(event) => {
              if (isActive) {
                return;
              }

              playTap();
              onChange(tab.id, event.detail !== 0);
            }}
            role="tab"
            type="button"
          >
            {isActive ? (
              <m.span
                className={styles.bubble}
                layoutId="bubble"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            ) : null}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
