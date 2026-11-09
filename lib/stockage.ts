import type { Niveau } from "./defi";

export interface Resultat {
  reussi: boolean;
  essais: number;
  secondes: number;
  indice: boolean;
  /** Étoiles « CSS golf » : 0 si raté, 1 à 3 sinon. */
  etoiles: 0 | 1 | 2 | 3;
  score: number;
  /** Joué le jour même (compte pour la série), pas en archive. */
  enDirect: boolean;
}

export type ResultatsDuJour = Partial<Record<Niveau, Resultat>>;
export type Resultats = Record<string, ResultatsDuJour>;

const CLE = "carreau:v1";
const EVENEMENT = "carreau:maj";

export function lireBrut(): string | null {
  try {
    return localStorage.getItem(CLE);
  } catch {
    return null;
  }
}

export function analyser(brut: string | null): Resultats {
  if (!brut) return {};
  try {
    const v = JSON.parse(brut);
    return v && typeof v === "object" && v.resultats && typeof v.resultats === "object" ? v.resultats : {};
  } catch {
    return {};
  }
}

export function enregistrer(date: string, niveau: Niveau, resultat: Resultat) {
  const tous = analyser(lireBrut());
  tous[date] = { ...tous[date], [niveau]: resultat };
  try {
    localStorage.setItem(CLE, JSON.stringify({ resultats: tous }));
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    // Stockage indisponible (navigation privée) : la partie reste jouable, sans sauvegarde.
  }
}

export function abonner(rappel: () => void) {
  window.addEventListener("storage", rappel);
  window.addEventListener(EVENEMENT, rappel);
  return () => {
    window.removeEventListener("storage", rappel);
    window.removeEventListener(EVENEMENT, rappel);
  };
}
