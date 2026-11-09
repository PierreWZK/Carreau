"use client";

import { useMemo, useSyncExternalStore } from "react";
import { abonner, analyser, lireBrut, type Resultats } from "@/lib/stockage";

/** Résultats sauvegardés dans le navigateur, ou null tant que la page n'est pas côté client. */
export function useResultats(): Resultats | null {
  const brut = useSyncExternalStore<string | null | undefined>(abonner, lireBrut, () => undefined);
  return useMemo(() => (brut === undefined ? null : analyser(brut)), [brut]);
}
