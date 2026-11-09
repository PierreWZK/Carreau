import { ajouterJours } from "./jour.ts";
import type { Resultats, ResultatsDuJour } from "./stockage.ts";

/** Un jour compte pour la série s'il a au moins un niveau réussi le jour même (pas en archive). */
export function jourValide(jour?: ResultatsDuJour) {
  return Object.values(jour ?? {}).some((r) => r.reussi && r.enDirect);
}

/** Jours consécutifs validés. Si aujourd'hui n'est pas encore validé, la série court jusqu'à hier. */
export function calculerSerie(resultats: Resultats, aujourdhui: string) {
  let jour = jourValide(resultats[aujourdhui]) ? aujourdhui : ajouterJours(aujourdhui, -1);
  let serie = 0;
  while (jourValide(resultats[jour])) {
    serie++;
    jour = ajouterJours(jour, -1);
  }
  return serie;
}
