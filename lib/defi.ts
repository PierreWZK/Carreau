export type Niveau = 1 | 2 | 3;

export interface Defi {
  id: string;
  niveau: Niveau;
  titre: string;
  consigne: string;
  /** HTML de départ. Niveau 1 : fourni et non modifiable. */
  html: string;
  /** CSS de départ. */
  css: string;
  solution: { html: string; css: string };
  indice: string;
  /** Défi du jour dur (dimanche). */
  dur?: boolean;
}
