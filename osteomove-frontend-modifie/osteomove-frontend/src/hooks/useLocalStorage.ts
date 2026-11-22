import { useCallback, useEffect, useState } from "react";

export const KEYS = {
  user: "osteomove_user",
  profile: "osteomove_profile",
  logs: "osteomove_activity_logs",
  goals: "osteomove_goals",
  saved: "osteomove_saved",
  seeded: "osteomove_seeded",
} as const;

const SYNC_EVENT = "osteomove:storage";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: key }));
  } catch {
    // Stockage indisponible (mode privé, quota) : l'application continue sans persistance.
  }
}

/** Valeur persistée dans localStorage, synchronisée entre les composants qui utilisent la même clé. */
export function useLocalStorage<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readStorage(key, initial));

  useEffect(() => {
    const onSync = (event: Event) => {
      if ((event as CustomEvent<string>).detail === key) {
        setValue(readStorage(key, initial));
      }
    };
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = readStorage(key, initial);
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      writeStorage(key, resolved);
      setValue(resolved);
    },
    [key], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return [value, set];
}
