"use client";

import Link from "next/link";
import { calculerSerie } from "@/lib/serie";
import { useAujourdhui } from "./useAujourdhui";
import { useResultats } from "./useResultats";
import styles from "./CartesNiveaux.module.css";

const niveaux = [
  { numero: 1, titre: "Niveau 1", aide: "CSS seul, aperçu en direct" },
  { numero: 2, titre: "Niveau 2", aide: "HTML et CSS, aperçu en direct" },
  { numero: 3, titre: "Niveau 3", aide: "HTML et CSS, 5 essais" },
] as const;

export default function CartesNiveaux() {
  const aujourdhui = useAujourdhui();
  const resultats = useResultats();
  const jour = aujourdhui && resultats ? resultats[aujourdhui] : undefined;
  const serie = aujourdhui && resultats ? calculerSerie(resultats, aujourdhui) : 0;

  return (
    <>
      <p className={styles.serie}>
        {serie > 0
          ? `Série : ${serie} jour${serie > 1 ? "s" : ""} d'affilée`
          : "Réussis un défi aujourd'hui pour lancer ta série."}
      </p>

      <ol className={styles.liste}>
        {niveaux.map((niveau) => {
          const r = jour?.[niveau.numero];
          return (
            <li key={niveau.numero}>
              <Link href={`/jouer/${niveau.numero}`} className={styles.carte}>
                <span className={styles.numero}>{niveau.numero}</span>
                <span className={styles.texte}>
                  <span className={styles.titre}>{niveau.titre}</span>
                  <span className={styles.aide}>{niveau.aide}</span>
                </span>
                {r && <span className={styles.statut}>{r.reussi ? "✓ Réussi" : "✗ Raté"}</span>}
              </Link>
            </li>
          );
        })}
      </ol>

      <Link href="/archive" className={styles.archive}>
        Archive des jours passés
      </Link>
    </>
  );
}
