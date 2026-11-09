"use client";

import { useEffect, useRef, useState } from "react";
import type { Defi } from "@/lib/defi";
import { comparer, mesurer } from "@/lib/rendu";
import { PENALITE_INDICE, calculerScore, etoilesGolf } from "@/lib/score";
import { enregistrer, type Resultat } from "@/lib/stockage";
import Apercu from "./Apercu";
import CarteResultat from "./CarteResultat";
import EditeurCode from "./EditeurCode";
import styles from "./DefiJeu.module.css";

const ESSAIS_MAX_N3 = 5;

type Onglet = "html" | "css";
interface Code {
  html: string;
  css: string;
}

interface Props {
  defi: Defi;
  /** Jour du défi (AAAA-MM-JJ), pour la sauvegarde. */
  date: string;
  /** Joué le jour même : compte pour la série. */
  enDirect: boolean;
  /** Résultat déjà enregistré : le défi n'est plus rejouable. */
  deja?: Resultat;
}

export default function DefiJeu({ defi, date, enDirect, deja: dejaRecu }: Props) {
  // Figé au montage : la sauvegarde qui suit une partie ne doit pas remplacer l'écran en cours.
  const [deja] = useState(dejaRecu);
  const [code, setCode] = useState<Code>({ html: defi.html, css: defi.css });
  const [onglet, setOnglet] = useState<Onglet>(defi.niveau === 1 ? "css" : "html");
  const [essais, setEssais] = useState(0);
  const [resultat, setResultat] = useState<Resultat | null>(deja ?? null);
  const [indiceVu, setIndiceVu] = useState(false);
  const [message, setMessage] = useState("");
  const [occupe, setOccupe] = useState(false);
  // Aperçu en direct (niveaux 1 et 2) : retardé de 300 ms pour ne pas recharger à chaque touche.
  const [differe, setDiffere] = useState<Code>(code);
  // Niveau 3 : rendu du dernier code validé.
  const [fige, setFige] = useState<Code | null>(null);
  const debut = useRef(0);

  useEffect(() => {
    debut.current = Date.now();
  }, []);

  useEffect(() => {
    if (defi.niveau === 3) return;
    const minuteur = setTimeout(() => setDiffere(code), 300);
    return () => clearTimeout(minuteur);
  }, [code, defi.niveau]);

  async function valider() {
    if (occupe || resultat) return;
    setOccupe(true);
    try {
      const [cible, joueur] = await Promise.all([
        mesurer(defi.solution.html, defi.solution.css),
        mesurer(code.html, code.css),
      ]);
      const juste = comparer(cible, joueur).ok;
      const n = essais + 1;
      setEssais(n);
      if (defi.niveau === 3) setFige(code);

      const perdu = !juste && defi.niveau === 3 && n >= ESSAIS_MAX_N3;
      if (!juste && !perdu) {
        setMessage("Pas encore : ton rendu ne correspond pas à la cible.");
        return;
      }
      const fini: Resultat = {
        reussi: juste,
        essais: n,
        secondes: Math.round((Date.now() - debut.current) / 1000),
        indice: indiceVu,
        etoiles: juste ? etoilesGolf(defi.niveau, defi.solution, code.html, code.css) : 0,
        score: juste ? calculerScore(defi.niveau, n, indiceVu) : 0,
        enDirect,
      };
      setResultat(fini);
      setMessage(juste ? "Bravo, c'est identique !" : "Plus d'essais. Voici la solution.");
      enregistrer(date, defi.niveau, fini);
    } catch {
      setMessage("Impossible de mesurer le rendu, réessaie.");
    } finally {
      setOccupe(false);
    }
  }

  const apercu = defi.niveau === 3 ? fige : differe;
  const htmlFixe = defi.niveau === 1;
  const termine = resultat !== null;

  return (
    <section className={styles.defi}>
      <header>
        <h2 className={styles.titre}>
          Niveau {defi.niveau} — {defi.titre}
        </h2>
        {defi.dur && <p className={styles.dur}>Jour dur</p>}
        <p>{defi.consigne}</p>
      </header>

      <div className={styles.bloc}>
        <h3 className={styles.etiquette}>Cible</h3>
        <Apercu html={defi.solution.html} css={defi.solution.css} titre="Cible à reproduire" />
      </div>

      {deja ? (
        <CarteResultat defi={defi} resultat={deja} />
      ) : (
        <>
          <div className={styles.bloc}>
            <div className={styles.onglets}>
              {(["html", "css"] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  className={styles.onglet}
                  aria-pressed={onglet === o}
                  onClick={() => setOnglet(o)}
                >
                  {o.toUpperCase()}
                  {o === "html" && htmlFixe ? " (fourni)" : ""}
                </button>
              ))}
            </div>
            {onglet === "html" ? (
              <EditeurCode
                key="html"
                langage="html"
                etiquette="Éditeur HTML"
                valeur={code.html}
                lectureSeule={htmlFixe || termine}
                onChange={(html) => setCode((c) => ({ ...c, html }))}
              />
            ) : (
              <EditeurCode
                key="css"
                langage="css"
                etiquette="Éditeur CSS"
                valeur={code.css}
                lectureSeule={termine}
                onChange={(css) => setCode((c) => ({ ...c, css }))}
              />
            )}
          </div>

          <div className={styles.bloc}>
            <h3 className={styles.etiquette}>Ton rendu</h3>
            {apercu ? (
              <Apercu html={apercu.html} css={apercu.css} titre="Ton rendu" />
            ) : (
              <p className={styles.vide}>L&apos;aperçu apparaît après ta première validation.</p>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.valider} onClick={valider} disabled={occupe || termine}>
              {occupe ? "Mesure…" : "Valider"}
            </button>
            <button type="button" className={styles.onglet} onClick={() => setIndiceVu(true)} disabled={termine || indiceVu}>
              {indiceVu ? "Indice vu" : `Indice (−${PENALITE_INDICE} points)`}
            </button>
            <span className={styles.essais}>
              {essais} essai{essais > 1 ? "s" : ""}
              {defi.niveau === 3 ? ` sur ${ESSAIS_MAX_N3}` : ""}
            </span>
          </div>

          {indiceVu && <p className={styles.indice}>Indice : {defi.indice}</p>}

          <p className={styles.message} role="status">
            {message}
          </p>

          {resultat && <CarteResultat defi={defi} resultat={resultat} />}
        </>
      )}
    </section>
  );
}
