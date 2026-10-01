"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { MOBILE_QUERY, useMediaQuery } from "@/lib/media";

interface SoundContextValue {
  isSoundEnabled: boolean;
  playTap: () => void;
  toggleSound: () => void;
}

const interactionSounds = {
  tap: "/sounds/tap_05.wav",
  toggleOff: "/sounds/toggle_off.wav",
  toggleOn: "/sounds/toggle_on.wav",
} as const;

type InteractionSound = keyof typeof interactionSounds;

const soundPreferenceStorageKey = "portfolio-interaction-sound-enabled";
const soundPreferenceChangeEvent = "portfolio-sound-preference-change";
const SoundContext = createContext<SoundContextValue | null>(null);

function getSoundPreferenceSnapshot() {
  try {
    return window.localStorage.getItem(soundPreferenceStorageKey) !== "false";
  } catch {
    return true;
  }
}

function getServerSoundPreferenceSnapshot() {
  return true;
}

function subscribeToSoundPreference(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === soundPreferenceStorageKey) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(soundPreferenceChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(soundPreferenceChangeEvent, onStoreChange);
  };
}

function saveSoundPreference(isEnabled: boolean) {
  try {
    window.localStorage.setItem(
      soundPreferenceStorageKey,
      String(isEnabled),
    );
  } catch {
    // Keep the in-page interaction working when storage is unavailable.
  }

  window.dispatchEvent(new Event(soundPreferenceChangeEvent));
}

export function SoundProvider({ children }: PropsWithChildren) {
  const audioRefs = useRef<Record<InteractionSound, HTMLAudioElement | null>>({
    tap: null,
    toggleOff: null,
    toggleOn: null,
  });
  const isSoundEnabled = useSyncExternalStore(
    subscribeToSoundPreference,
    getSoundPreferenceSnapshot,
    getServerSoundPreferenceSnapshot,
  );
  // Sounds are desktop-only; the server assumes mobile so no audio is rendered up front.
  const isMobileDevice = useMediaQuery(MOBILE_QUERY, true);

  const playAudio = useCallback((sound: InteractionSound) => {
    const audio = audioRefs.current[sound];

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => {
      // A blocked audio request should never interrupt the UI action.
    });
  }, []);

  const playTap = useCallback(() => {
    if (isSoundEnabled && !isMobileDevice) {
      playAudio("tap");
    }
  }, [isMobileDevice, isSoundEnabled, playAudio]);

  const toggleSound = useCallback(() => {
    if (isMobileDevice) {
      return;
    }

    const nextIsEnabled = !isSoundEnabled;

    saveSoundPreference(nextIsEnabled);
    playAudio(nextIsEnabled ? "toggleOn" : "toggleOff");
  }, [isMobileDevice, isSoundEnabled, playAudio]);

  const value = useMemo(
    () => ({ isSoundEnabled, playTap, toggleSound }),
    [isSoundEnabled, playTap, toggleSound],
  );

  return (
    <SoundContext.Provider value={value}>
      {!isMobileDevice
        ? Object.entries(interactionSounds).map(([sound, src]) => (
            <audio
              aria-hidden="true"
              key={sound}
              preload="auto"
              ref={(element) => {
                audioRefs.current[sound as InteractionSound] = element;
              }}
              src={src}
            />
          ))
        : null}
      {children}
    </SoundContext.Provider>
  );
}

export function useInteractionSound() {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error(
      "useInteractionSound must be used inside SoundProvider.",
    );
  }

  return context;
}
