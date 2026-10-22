"use client";

import { useDialKitController } from "dialkit";
import { type RefObject, useEffect, useState } from "react";
import "dialkit/styles.css";

// Dev-only: one "Save to code" for every DialKit panel on the home page. Each panel
// registers what it saves with `useDialSave`; the Save panel posts them all at once
// and reports the result. The panel shows up in the DialRoot that CraftBentoDebug mounts.

type DialSaveEntry = { endpoint: string; valueRef: RefObject<unknown> };

const entries = new Map<string, DialSaveEntry>();

/** Adds a panel's current values to the shared "Save to code". */
export function useDialSave(name: string, entry: DialSaveEntry) {
  const { endpoint, valueRef } = entry;

  useEffect(() => {
    entries.set(name, { endpoint, valueRef });
    return () => {
      entries.delete(name);
    };
  }, [endpoint, name, valueRef]);
}

const config = {
  save: { label: "Save to code", type: "action" as const },
};

export function DialSaveDebug() {
  const [status, setStatus] = useState<string | null>(null);

  useDialKitController("Save", config, {
    onAction: (action) => {
      if (action === "save") {
        void saveAll().then(setStatus);
      }
    },
  });

  useEffect(() => {
    if (!status) {
      return;
    }

    const timeout = window.setTimeout(() => setStatus(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [status]);

  return status ? (
    <div role="status" style={statusStyle}>
      {status}
    </div>
  ) : null;
}

async function saveAll() {
  const results = await Promise.all(
    [...entries].map(async ([name, { endpoint, valueRef }]) => {
      try {
        const response = await fetch(endpoint, {
          body: JSON.stringify(valueRef.current),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        return { name, ok: response.ok };
      } catch {
        return { name, ok: false };
      }
    }),
  );
  const failed = results.filter(({ ok }) => !ok).map(({ name }) => name);

  return failed.length === 0
    ? `Saved ${results.length} panels to src/data`
    : `Couldn’t save: ${failed.join(", ")}`;
}

const statusStyle = {
  position: "fixed",
  bottom: 24,
  left: "50%",
  zIndex: 2147483000,
  padding: "6px 12px",
  borderRadius: 999,
  background: "#111",
  color: "#fff",
  fontSize: 13,
  lineHeight: "20px",
  transform: "translateX(-50%)",
} as const;
