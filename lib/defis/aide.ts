import type { Defi } from "../defi";

/**
 * Niveau 1 : HTML fourni. `depart` est le CSS donné au joueur, `ajout` ce qu'il doit écrire.
 * La solution est `depart` suivie de `ajout` (la cascade donne le même rendu).
 */
export const n1 = (
  id: string,
  titre: string,
  consigne: string,
  html: string,
  depart: string,
  ajout: string,
  indice: string,
  dur = false,
): Defi => ({
  id: `n1-${id}`,
  niveau: 1,
  titre,
  consigne,
  html,
  css: depart,
  solution: { html, css: `${depart}\n${ajout}` },
  indice,
  ...(dur ? { dur } : {}),
});

/** Niveaux 2 et 3 : le joueur part d'une page vide. */
export const libre =
  (niveau: 2 | 3) =>
  (
    id: string,
    titre: string,
    consigne: string,
    html: string,
    css: string,
    indice: string,
    dur = false,
  ): Defi => ({
    id: `n${niveau}-${id}`,
    niveau,
    titre,
    consigne,
    html: "",
    css: "",
    solution: { html, css },
    indice,
    ...(dur ? { dur } : {}),
  });
