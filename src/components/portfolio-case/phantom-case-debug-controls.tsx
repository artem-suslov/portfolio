"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { PhantomGlowSettings } from "@/components/phantom/phantom-mark";
import styles from "./phantom-case-debug-controls.module.css";

type PhantomCaseSettings = PhantomGlowSettings;

interface PhantomCaseDebugControlsProps {
  onUpdateSetting: <Key extends keyof PhantomCaseSettings>(
    key: Key,
    value: PhantomCaseSettings[Key],
  ) => void;
  settings: PhantomCaseSettings;
}

export function PhantomCaseDebugControls({
  onUpdateSetting,
  settings,
}: PhantomCaseDebugControlsProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <button
        aria-label="Open DBA panel"
        className={styles.toggle}
        onClick={() => setIsVisible(true)}
        type="button"
      >
        <SlidersHorizontal aria-hidden="true" size={16} strokeWidth={1.8} />
      </button>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>DBA panel</span>
        <button
          aria-label="Close DBA panel"
          className={styles.iconButton}
          onClick={() => setIsVisible(false)}
          type="button"
        >
          <X aria-hidden="true" size={14} strokeWidth={1.8} />
        </button>
      </div>

      <DebugColorInput
        label="logo"
        onChange={(value) => onUpdateSetting("logoColor", value)}
        value={settings.logoColor}
      />
      <DebugColorInput
        label="glow"
        onChange={(value) => onUpdateSetting("glowColor", value)}
        value={settings.glowColor}
      />
      <DebugBooleanInput
        checked={settings.isOutlineGlow}
        label="outline"
        onChange={(value) => onUpdateSetting("isOutlineGlow", value)}
      />
      <DebugSlider
        label="outline"
        max={24}
        min={1}
        onChange={(value) => onUpdateSetting("outlineWidth", value)}
        step={1}
        suffix="px"
        value={settings.outlineWidth}
      />
      <DebugSlider
        label="radius"
        max={340}
        min={40}
        onChange={(value) => onUpdateSetting("radius", value)}
        step={1}
        suffix="px"
        value={settings.radius}
      />
      <DebugSlider
        label="opacity"
        max={1}
        min={0}
        onChange={(value) => onUpdateSetting("opacity", value)}
        step={0.01}
        value={settings.opacity}
      />
      <DebugSlider
        label="blur"
        max={60}
        min={0}
        onChange={(value) => onUpdateSetting("blur", value)}
        step={1}
        suffix="px"
        value={settings.blur}
      />
      <DebugSlider
        label="bright"
        max={2}
        min={0.6}
        onChange={(value) => onUpdateSetting("brightness", value)}
        step={0.05}
        value={settings.brightness}
      />
      <DebugSlider
        label="sat"
        max={2.5}
        min={0.2}
        onChange={(value) => onUpdateSetting("saturation", value)}
        step={0.05}
        value={settings.saturation}
      />
      <DebugSlider
        label="scale"
        max={1.8}
        min={0.45}
        onChange={(value) => onUpdateSetting("scale", value)}
        step={0.01}
        value={settings.scale}
      />
    </div>
  );
}

function DebugColorInput({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className={styles.colorRow}>
      <span>{label}</span>
      <input
        onChange={(event) => onChange(event.target.value)}
        type="color"
        value={value}
      />
      <span>{value}</span>
    </label>
  );
}

function DebugBooleanInput({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className={styles.booleanRow}>
      <span>{label}</span>
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span>{checked ? "on" : "off"}</span>
    </label>
  );
}

function DebugSlider({
  label,
  max,
  min,
  onChange,
  step,
  suffix = "",
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  suffix?: string;
  value: number;
}) {
  return (
    <label className={styles.sliderRow}>
      <span>{label}</span>
      <input
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <span>
        {Number.isInteger(value) ? value : value.toFixed(2)}
        {suffix}
      </span>
    </label>
  );
}
