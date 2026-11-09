import type { Defi, Niveau } from "./defi";
import { banque } from "./banque.ts";

const JOUR_MS = 86_400_000;

/** Date locale au format AAAA-MM-JJ. */
export function dateLocale(d = new Date()) {
  const deux = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;
}

export function joursDepuisEpoch(date: string) {
  const [a, m, j] = date.split("-").map(Number);
  return Math.round(Date.UTC(a, m - 1, j) / JOUR_MS);
}

// Le 1er janvier 1970 était un jeudi : (jours + 4) % 7 vaut 0 le dimanche.
export function estDimanche(date: string) {
  return (joursDepuisEpoch(date) + 4) % 7 === 0;
}

export function formaterDate(date: string) {
  const [a, m, j] = date.split("-").map(Number);
  const texte = new Date(a, m - 1, j).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** Premier jour du jeu : l'archive commence ici. */
export const DATE_DEBUT = "2026-11-09";

export function ajouterJours(date: string, n: number) {
  return new Date((joursDepuisEpoch(date) + n) * JOUR_MS).toISOString().slice(0, 10);
}

/** Jours passés jouables en archive, du plus récent au plus ancien (aujourd'hui exclu). */
export function datesArchive(aujourdhui: string) {
  const dates: string[] = [];
  for (let d = ajouterJours(aujourdhui, -1); d >= DATE_DEBUT; d = ajouterJours(d, -1)) dates.push(d);
  return dates;
}

/** Date demandée dans l'URL si elle est valide et déjà passée, sinon null. */
export function dateArchiveValide(demande: string | null, aujourdhui: string) {
  if (!demande || !/^\d{4}-\d{2}-\d{2}$/.test(demande)) return null;
  return demande >= DATE_DEBUT && demande < aujourdhui ? demande : null;
}

const modulo =(n: number, m: number) => ((n % m) + m) % m;

/**
 * Défi d'un niveau pour une date. Le dimanche tire dans les défis durs
 * (un par semaine), les autres jours dans les défis normaux (un de plus chaque jour).
 */
export function defiDuJour(niveau: Niveau, date: string): Defi {
  const jours = joursDepuisEpoch(date);
  const semaines = Math.floor((jours + 4) / 7);
  const dimanche = estDimanche(date);
  const pool = banque[niveau].filter((d) => Boolean(d.dur) === dimanche);
  return pool[modulo(dimanche ? semaines : jours - semaines, pool.length)];
}
