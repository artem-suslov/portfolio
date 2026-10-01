"use client";

import { Check, RotateCcw, Settings2, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useInteractionSound } from "@/components/sound/sound-provider";

type MediaFit = "contain" | "cover" | "fill";

type MediaSettings = {
  fit: MediaFit;
  height: number;
  scale: number;
  width: number;
  x: number;
  y: number;
};

type DebugCase = {
  id: string;
  label: string;
};

const storageKey = "portfolio-case-media-debug";
const initialSettings: MediaSettings = {
  fit: "contain",
  height: 348,
  scale: 100,
  width: 636,
  x: 0,
  y: 0,
};
const debugStyleProperties = [
  "position",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "width",
  "height",
  "max-width",
  "max-height",
  "margin",
  "flex",
  "object-fit",
  "transform",
];

export function PortfolioDebugPanel({ cases }: { cases: DebugCase[] }) {
  const { playTap } = useInteractionSound();
  const isLocalDebugHost = useSyncExternalStore(
    subscribeToDebugHost,
    getDebugHostSnapshot,
    getServerDebugHostSnapshot,
  );
  const firstCaseId = cases[0]?.id ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(firstCaseId);
  const [settings, setSettings] =
    useState<MediaSettings>(initialSettings);
  const [applyStatus, setApplyStatus] = useState<
    "idle" | "applying" | "success" | "error"
  >("idle");

  useEffect(() => {
    const savedSettings = readSavedSettings();

    for (const [caseId, caseSettings] of Object.entries(savedSettings)) {
      applyMediaSettings(caseId, caseSettings);
    }
  }, []);

  const openPanel = () => {
    setSettings(readMediaSettings(selectedCaseId));
    setIsOpen(true);
  };

  const selectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setSettings(readMediaSettings(caseId));
    setApplyStatus("idle");
  };

  const updateSettings = (nextSettings: MediaSettings) => {
    setSettings(nextSettings);
    setApplyStatus("idle");
    applyMediaSettings(selectedCaseId, nextSettings);

    const savedSettings = readSavedSettings();
    savedSettings[selectedCaseId] = nextSettings;
    window.localStorage.setItem(storageKey, JSON.stringify(savedSettings));
  };

  const resetSelectedCase = () => {
    const media = getMediaElement(selectedCaseId);

    if (media) {
      for (const property of debugStyleProperties) {
        media.style.removeProperty(property);
      }
    }

    const savedSettings = readSavedSettings();
    delete savedSettings[selectedCaseId];
    window.localStorage.setItem(storageKey, JSON.stringify(savedSettings));
    setSettings(readMediaSettings(selectedCaseId));
  };

  const applySelectedCase = async () => {
    setApplyStatus("applying");

    try {
      const response = await fetch("/api/debug/case-media", {
        body: JSON.stringify({ caseId: selectedCaseId, settings }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to apply media settings");
      }

      const media = getMediaElement(selectedCaseId);

      if (media) {
        for (const property of debugStyleProperties) {
          media.style.removeProperty(property);
        }
      }

      const savedSettings = readSavedSettings();
      delete savedSettings[selectedCaseId];
      window.localStorage.setItem(storageKey, JSON.stringify(savedSettings));
      setSettings(readMediaSettings(selectedCaseId));
      setApplyStatus("success");
      playTap();
    } catch {
      setApplyStatus("error");
    }
  };

  if (!isLocalDebugHost) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        aria-label="Open case media debug panel"
        className="fixed right-4 bottom-4 z-[2000] flex size-10 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-lg"
        onClick={openPanel}
        type="button"
      >
        <Settings2 aria-hidden="true" size={16} strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <aside className="fixed right-4 bottom-4 z-[2000] w-[300px] rounded-2xl border border-black/10 bg-white p-4 text-[#111] shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-sm font-medium">Case media debug</strong>
        <button
          aria-label="Close case media debug panel"
          className="flex size-8 items-center justify-center rounded-full bg-black/5"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          <X aria-hidden="true" size={16} strokeWidth={1.75} />
        </button>
      </div>

      <label className="mt-4 flex flex-col gap-1.5 text-xs font-medium">
        Case
        <select
          aria-label="Debug case"
          className="h-9 rounded-lg border border-black/10 bg-white px-2 text-sm font-normal"
          onChange={(event) => selectCase(event.target.value)}
          value={selectedCaseId}
        >
          {cases.map((debugCase) => (
            <option key={debugCase.id} value={debugCase.id}>
              {debugCase.label}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 flex flex-col gap-3">
        <DebugRange
          label="Scale %"
          max={500}
          min={10}
          onChange={(scale) => {
            const ratio = scale / settings.scale;
            const width = Math.round(settings.width * ratio);
            const height = Math.round(settings.height * ratio);

            updateSettings({
              ...settings,
              height,
              scale,
              width,
              x: Math.round(settings.x - (width - settings.width) / 2),
              y: Math.round(settings.y - (height - settings.height) / 2),
            });
          }}
          value={settings.scale}
        />
        <DebugRange
          label="X"
          max={700}
          min={-300}
          onChange={(x) => updateSettings({ ...settings, x })}
          value={settings.x}
        />
        <DebugRange
          label="Y"
          max={500}
          min={-300}
          onChange={(y) => updateSettings({ ...settings, y })}
          value={settings.y}
        />
        <DebugRange
          label="Width"
          max={3200}
          min={40}
          onChange={(width) => updateSettings({ ...settings, width })}
          value={settings.width}
        />
        <DebugRange
          label="Height"
          max={1800}
          min={40}
          onChange={(height) => updateSettings({ ...settings, height })}
          value={settings.height}
        />
      </div>

      <label className="mt-4 flex items-center justify-between gap-3 text-xs font-medium">
        Object fit
        <select
          aria-label="Object fit"
          className="h-8 rounded-lg border border-black/10 bg-white px-2 text-xs font-normal"
          onChange={(event) =>
            updateSettings({
              ...settings,
              fit: event.target.value as MediaFit,
            })
          }
          value={settings.fit}
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="fill">Fill</option>
        </select>
      </label>

      <button
        className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-full bg-black text-xs font-medium text-white"
        onClick={resetSelectedCase}
        type="button"
      >
        <RotateCcw aria-hidden="true" size={14} strokeWidth={1.75} />
        Reset selected case
      </button>

      <button
        className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-full bg-black text-xs font-medium text-white disabled:cursor-wait disabled:opacity-60"
        disabled={applyStatus === "applying"}
        onClick={applySelectedCase}
        type="button"
      >
        <Check aria-hidden="true" size={14} strokeWidth={1.75} />
        {applyStatus === "applying" ? "Applying…" : "Apply to code"}
      </button>
      {applyStatus === "success" ? (
        <p className="mt-2 text-center text-xs text-black/60">
          Applied to page.module.css
        </p>
      ) : null}
      {applyStatus === "error" ? (
        <p className="mt-2 text-center text-xs text-red-700">
          Couldn&apos;t apply the settings. Keep the local dev server running.
        </p>
      ) : null}
    </aside>
  );
}

function subscribeToDebugHost() {
  return () => {};
}

function getDebugHostSnapshot() {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

function getServerDebugHostSnapshot() {
  return false;
}

function DebugRange({
  label,
  max,
  min,
  onChange,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="grid grid-cols-[52px_1fr_60px] items-center gap-2 text-xs font-medium">
      {label}
      <input
        aria-label={`${label} slider`}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
      <input
        aria-label={`${label} value`}
        className="h-8 rounded-lg border border-black/10 px-2 text-right font-mono text-xs font-normal"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </label>
  );
}

function getMediaElement(caseId: string) {
  return document.querySelector<HTMLElement>(
    `[data-case-id="${caseId}"] [data-debug-media]`,
  );
}

function readMediaSettings(caseId: string): MediaSettings {
  const caseElement = document.querySelector<HTMLElement>(
    `[data-case-id="${caseId}"]`,
  );
  const frame = caseElement?.querySelector<HTMLElement>("[data-debug-frame]");
  const media = getMediaElement(caseId);

  if (!frame || !media) {
    return initialSettings;
  }

  const frameRect = frame.getBoundingClientRect();
  const mediaRect = media.getBoundingClientRect();
  const objectFit = window.getComputedStyle(media).objectFit;

  return {
    fit:
      objectFit === "cover" || objectFit === "fill" ? objectFit : "contain",
    height: Math.round(mediaRect.height),
    scale: 100,
    width: Math.round(mediaRect.width),
    x: Math.round(mediaRect.left - frameRect.left),
    y: Math.round(mediaRect.top - frameRect.top),
  };
}

function applyMediaSettings(caseId: string, settings: MediaSettings) {
  const media = getMediaElement(caseId);

  if (!media) return;

  media.style.position = "absolute";
  media.style.inset = "auto";
  media.style.top = `${settings.y}px`;
  media.style.left = `${settings.x}px`;
  media.style.width = `${settings.width}px`;
  media.style.height = `${settings.height}px`;
  media.style.maxWidth = "none";
  media.style.maxHeight = "none";
  media.style.margin = "0";
  media.style.flex = "none";
  media.style.objectFit = settings.fit;
  media.style.transform = "none";
}

function readSavedSettings(): Record<string, MediaSettings> {
  try {
    const savedSettings = window.localStorage.getItem(storageKey);

    if (!savedSettings) return {};

    const parsedSettings = JSON.parse(savedSettings) as Record<
      string,
      Partial<MediaSettings>
    >;

    return Object.fromEntries(
      Object.entries(parsedSettings).map(([caseId, settings]) => [
        caseId,
        {
          ...initialSettings,
          ...settings,
          scale: settings.scale ?? 100,
        },
      ]),
    );
  } catch {
    return {};
  }
}
