import { formaterDate } from "./jour.ts";
import type { Resultat, ResultatsDuJour } from "./stockage.ts";

export function formaterTemps(secondes: number) {
  return `${Math.floor(secondes / 60)}:${String(secondes % 60).padStart(2, "0")}`;
}

export const etoiles = (n: number) => "★".repeat(n) + "☆".repeat(3 - n);

const emoji = (r?: Resultat) => (!r ? "⬜" : r.reussi ? "🟩" : "🟥");

/** Résumé du jour façon Wordle, à coller dans un message. */
export function texteResume(date: string, jour: ResultatsDuJour, serie: number) {
  const lignes = ([1, 2, 3] as const).map((n) => {
    const r = jour[n];
    if (!r) return `${emoji(r)} Niveau ${n}`;
    const detail = r.reussi ? `${etoiles(r.etoiles)} · ${r.essais} essai${r.essais > 1 ? "s" : ""} · ${formaterTemps(r.secondes)}` : "raté";
    return `${emoji(r)} Niveau ${n} · ${detail}`;
  });
  const points = Object.values(jour).reduce((somme, r) => somme + r.score, 0);
  return [
    `Carreau · ${formaterDate(date)}`,
    ([1, 2, 3] as const).map((n) => emoji(jour[n])).join(""),
    ...lignes,
    `${points} points${serie > 0 ? ` · série de ${serie} jour${serie > 1 ? "s" : ""}` : ""}`,
  ].join("\n");
}
