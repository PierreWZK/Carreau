import type { Defi } from "@/lib/defi";
import { POINTS_BASE } from "@/lib/score";
import { etoiles, formaterTemps } from "@/lib/partage";
import type { Resultat } from "@/lib/stockage";
import styles from "./CarteResultat.module.css";

interface Props {
  defi: Defi;
  resultat: Resultat;
}

export default function CarteResultat({ defi, resultat }: Props) {
  return (
    <section className={styles.carte} aria-label="Résultat">
      <h3 className={styles.titre}>{resultat.reussi ? "Réussi" : "Raté"}</h3>
      <dl className={styles.liste}>
        <dt>Score</dt>
        <dd>
          {resultat.score} / {POINTS_BASE[defi.niveau]}
        </dd>
        {resultat.reussi && (
          <>
            <dt>CSS golf</dt>
            <dd aria-label={`${resultat.etoiles} étoiles sur 3`}>{etoiles(resultat.etoiles)}</dd>
          </>
        )}
        <dt>Essais</dt>
        <dd>{resultat.essais}</dd>
        <dt>Temps</dt>
        <dd>{formaterTemps(resultat.secondes)}</dd>
        <dt>Indice</dt>
        <dd>{resultat.indice ? "utilisé" : "non utilisé"}</dd>
      </dl>
      <details className={styles.solution} open={!resultat.reussi}>
        <summary>Voir la solution</summary>
        <pre>{defi.solution.html}</pre>
        <pre>{defi.solution.css}</pre>
      </details>
    </section>
  );
}
