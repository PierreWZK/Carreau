import type { Niveau } from "./defi";

export const POINTS_BASE: Record<Niveau, number> = { 1: 100, 2: 200, 3: 300 };
export const PENALITE_ESSAI = 10;
export const PENALITE_INDICE = 30;

/** Points de base du niveau, moins 10 par essai en plus du premier, moins 30 si l'indice est vu. */
export function calculerScore(niveau: Niveau, essais: number, indice: boolean) {
  return Math.max(0, POINTS_BASE[niveau] - PENALITE_ESSAI * (essais - 1) - (indice ? PENALITE_INDICE : 0));
}

// Longueur sans espaces ni commentaires : la mise en forme ne compte pas.
const nettoyer = (s: string) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, "");

/** Au niveau 1 le HTML est fourni : seul le CSS compte. */
export function longueurCode(niveau: Niveau, html: string, css: string) {
  return nettoyer(css).length + (niveau === 1 ? 0 : nettoyer(html).length);
}

/** 3 étoiles jusqu'à 115 % de la solution de référence, 2 jusqu'à 160 %, sinon 1. */
export function etoilesGolf(
  niveau: Niveau,
  solution: { html: string; css: string },
  html: string,
  css: string,
): 1 | 2 | 3 {
  const rapport = longueurCode(niveau, html, css) / longueurCode(niveau, solution.html, solution.css);
  return rapport <= 1.15 ? 3 : rapport <= 1.6 ? 2 : 1;
}
