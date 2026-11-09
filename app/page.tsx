import Link from "next/link";
import Apercu from "@/components/Apercu";
import BandeauJour from "@/components/BandeauJour";
import { banque } from "@/lib/banque";
import { URL_SITE } from "@/lib/site";
import styles from "./page.module.css";

// Cible d'exemple pour l'aperçu du jeu : un défi animé du niveau 3.
const exemple = banque[3].find((d) => d.id === "n3-va-et-vient")!;

const niveaux = [
  { n: 1, titre: "Niveau 1", texte: "Le HTML est fourni. Tu écris le CSS et vois le résultat en direct." },
  { n: 2, titre: "Niveau 2", texte: "Tu écris le HTML et le CSS, avec l'aperçu en direct." },
  { n: 3, titre: "Niveau 3", texte: "Pas d'aperçu avant de valider, et seulement 5 essais." },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="titre">
        <div className={styles.formes} aria-hidden="true">
          <span className={styles.carre} />
          <span className={styles.rond} />
          <span className={styles.trois}>3</span>
        </div>
        <h1 id="titre" className={styles.titre}>
          Carreau
        </h1>
        <p className={styles.accroche}>Un défi CSS par jour. Une cible, un éditeur, trois niveaux.</p>
        <BandeauJour />
        <Link href="/jouer" className={styles.cta}>
          Jouer au défi du jour
          <span aria-hidden="true">→</span>
        </Link>
        <p className={styles.note}>Gratuit, sans compte, en 5 minutes.</p>
      </section>

      <section className={styles.section} aria-labelledby="principe">
        <h2 id="principe" className={styles.sousTitre}>
          Le principe
        </h2>
        <ol className={styles.etapes}>
          <li>
            <strong>Regarde la cible.</strong> Un petit dessin fait de boîtes, parfois animé.
          </li>
          <li>
            <strong>Écris le code.</strong> HTML et CSS, avec un éditeur sur le côté.
          </li>
          <li>
            <strong>Valide.</strong> Ton rendu est comparé à la cible : positions, tailles, arrondis.
          </li>
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="niveaux">
        <h2 id="niveaux" className={styles.sousTitre}>
          Trois niveaux, chaque jour
        </h2>
        <ul className={styles.niveaux}>
          {niveaux.map((niveau) => (
            <li key={niveau.n} className={styles.niveau}>
              <span className={styles.numero}>{niveau.n}</span>
              <span>
                <strong>{niveau.titre}</strong>
                <span className={styles.aide}>{niveau.texte}</span>
              </span>
            </li>
          ))}
        </ul>
        <p>Le dimanche, les trois défis sont plus durs.</p>
      </section>

      <section className={styles.section} aria-labelledby="apercu">
        <h2 id="apercu" className={styles.sousTitre}>
          Aperçu
        </h2>
        <Apercu html={exemple.solution.html} css={exemple.solution.css} titre="Exemple de cible animée" />
        <p className={styles.legende}>
          Exemple de cible (niveau 3) : le rond glisse de gauche à droite, puis revient. Le quadrillage mesure
          20 px et sert de règle.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="utilite">
        <h2 id="utilite" className={styles.sousTitre}>
          À quoi ça sert ?
        </h2>
        <p>
          Avec l&apos;arrivée des IA, on ne prend plus le temps de retenir les bases. Centrer une div, faire passer
          des éléments à la ligne avec <code>flex-wrap</code>, animer un rond : on demande, ça marche, et on oublie.
        </p>
        <p>
          Un petit rafraîchissement de mémoire ne fait pas de mal. Carreau t&apos;en sert un chaque jour, sans IA :
          toi, un éditeur et une cible.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="plus">
        <h2 id="plus" className={styles.sousTitre}>
          Et aussi
        </h2>
        <ul className={styles.points}>
          <li>Un indice par défi, un score, des étoiles « CSS golf » pour le code le plus court.</li>
          <li>Une série de jours, un résumé à copier et partager, une archive pour rattraper les jours passés.</li>
          <li>Les couleurs ne comptent pas dans la validation.</li>
          <li>Pas de compte : tout reste dans ton navigateur.</li>
        </ul>
      </section>

      <section className={styles.final} aria-labelledby="final">
        <h2 id="final" className={styles.sousTitre}>
          Prêt pour le défi du jour ?
        </h2>
        <Link href="/jouer" className={styles.cta}>
          Jouer
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className={styles.pied}>
        <p>Carreau, jour 25 du défi « 30 jours, 30 projets ». Next.js, React, CodeMirror.</p>
        <p>
          <a href={URL_SITE}>{URL_SITE.replace("https://", "")}</a> ·{" "}
          <a href="https://github.com/PierreWZK/Carreau">Code source sur GitHub</a> ·{" "}
          <Link href="/archive">Archive</Link>
        </p>
      </footer>
    </main>
  );
}
