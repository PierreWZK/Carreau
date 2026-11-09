"use client";

import Link from "next/link";
import { datesArchive, estDimanche, formaterDate } from "@/lib/jour";
import { useAujourdhui } from "./useAujourdhui";
import { useResultats } from "./useResultats";
import styles from "./ListeArchive.module.css";

export default function ListeArchive() {
  const aujourdhui = useAujourdhui();
  const resultats = useResultats();
  if (!aujourdhui || !resultats) return <p>Chargement…</p>;

  const dates = datesArchive(aujourdhui);
  if (dates.length === 0) return <p>Pas encore d&apos;archive : reviens demain.</p>;

  return (
    <ul className={styles.liste}>
      {dates.map((date) => (
        <li key={date} className={styles.jour}>
          <span className={styles.date}>
            {formaterDate(date)}
            {estDimanche(date) && <span className={styles.dur}>dur</span>}
          </span>
          <span className={styles.niveaux}>
            {([1, 2, 3] as const).map((n) => {
              const r = resultats[date]?.[n];
              const etat = !r ? "à jouer" : r.reussi ? "réussi" : "raté";
              return (
                <Link
                  key={n}
                  href={`/jouer/${n}?date=${date}`}
                  className={styles.niveau}
                  data-etat={etat}
                  aria-label={`Niveau ${n}, ${etat}`}
                >
                  {n}
                  <span aria-hidden="true">{!r ? "" : r.reussi ? " ✓" : " ✗"}</span>
                </Link>
              );
            })}
          </span>
        </li>
      ))}
    </ul>
  );
}
