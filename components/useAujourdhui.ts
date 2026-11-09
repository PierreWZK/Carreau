"use client";

import { useSyncExternalStore } from "react";
import { dateLocale } from "@/lib/jour";

const jamaisChange = () => () => {};

/** Date locale du joueur (AAAA-MM-JJ), ou null pendant le rendu serveur. */
export function useAujourdhui() {
  return useSyncExternalStore(jamaisChange, () => dateLocale(), () => null);
}
