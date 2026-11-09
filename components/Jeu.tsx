"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Niveau } from "@/lib/defi";
import { dateArchiveValide, defiDuJour, formaterDate } from "@/lib/jour";
import { calculerSerie } from "@/lib/serie";
import BandeauJour from "./BandeauJour";
import DefiJeu from "./DefiJeu";
import Partage from "./Partage";
import { useAujourdhui } from "./useAujourdhui";
import { useResultats } from "./useResultats";
import styles from "./Jeu.module.css";

export default function Jeu({ niveau }: { niveau: Niveau }) {
  const aujourdhui = useAujourdhui();
  const resultats = useResultats();
  const demande = useSearchParams().get("date");

  const archive = aujourdhui ? dateArchiveValide(demande, aujourdhui) : null;
  const date = archive ?? aujourdhui;
  const defi = date ? defiDuJour(niveau, date) : null;
  const jour = date && resultats ? resultats[date] : undefined;
  const suffixe = archive ? `?date=${archive}` : "";

  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Niveaux">
        <Link href="/" className={styles.lien}>
          ← Carreau
        </Link>
        {([1, 2, 3] as const).map((n) => (
          <Link
            key={n}
            href={`/jouer/${n}${suffixe}`}
            className={styles.lien}
            aria-current={n === niveau ? "page" : undefined}
          >
            Niveau {n}
          </Link>
        ))}
        <Link href="/archive" className={styles.lien}>
          Archive
        </Link>
      </nav>

      {archive ? (
        <p className={styles.archive}>
          Archive du {formaterDate(archive)}. Ce défi ne compte pas pour ta série.
        </p>
      ) : (
        <BandeauJour />
      )}

      {defi && date && resultats ? (
        <>
          <DefiJeu
            key={`${date}-${defi.id}`}
            defi={defi}
            date={date}
            enDirect={!archive}
            deja={jour?.[niveau]}
          />
          {jour && Object.keys(jour).length > 0 && aujourdhui && (
            <Partage key={JSON.stringify(jour)} date={date} jour={jour} serie={calculerSerie(resultats, aujourdhui)} />
          )}
        </>
      ) : (
        <p>Chargement du défi…</p>
      )}
    </main>
  );
}
