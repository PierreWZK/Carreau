import Apercu from "@/components/Apercu";
import BandeauJour from "@/components/BandeauJour";
import CartesNiveaux from "@/components/CartesNiveaux";
import { banque } from "@/lib/banque";
import styles from "./page.module.css";

// Cible d'exemple pour l'aperçu du jeu : un défi animé du niveau 3.
const exemple = banque[3].find((d) => d.id === "n3-va-et-vient")!;

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.entete}>
        <h1 className={styles.titre}>Carreau</h1>
        <BandeauJour />
        <p className={styles.accroche}>
          Un défi CSS par jour : une cible s&apos;affiche, tu la reproduis en HTML et en CSS.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="utilite">
        <h2 id="utilite" className={styles.sousTitre}>
          À quoi ça sert ?
        </h2>
        <p>
          Avec l&apos;arrivée des IA, on ne prend plus le temps de retenir les bases. Centrer une div,
          faire passer des éléments à la ligne avec <code>flex-wrap</code>, animer un rond : on demande,
          ça marche, et on oublie.
        </p>
        <p>
          Un petit rafraîchissement de mémoire ne fait pas de mal. Carreau t&apos;en sert un en quelques
          minutes par jour, sans IA : toi, un éditeur et une cible.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="defis">
        <h2 id="defis" className={styles.sousTitre}>
          Les défis du jour
        </h2>
        <CartesNiveaux />
      </section>

      <section className={styles.section} aria-labelledby="fonctionnement">
        <h2 id="fonctionnement" className={styles.sousTitre}>
          Comment ça marche
        </h2>
        <ul className={styles.points}>
          <li>Trois défis par jour, de plus en plus libres : le niveau 3 n&apos;affiche ton rendu qu&apos;à la validation.</li>
          <li>Le dimanche, les trois défis sont plus durs.</li>
          <li>Ton rendu est comparé à la cible : positions, tailles, arrondis. Les couleurs ne comptent pas.</li>
          <li>Un indice par défi, un score, des étoiles « CSS golf » pour le code le plus court.</li>
          <li>Une série de jours, un résumé à partager, une archive pour rattraper les jours passés.</li>
          <li>Pas de compte : tout reste dans ton navigateur.</li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="apercu">
        <h2 id="apercu" className={styles.sousTitre}>
          Aperçu du jeu
        </h2>
        <Apercu html={exemple.solution.html} css={exemple.solution.css} titre="Exemple de cible animée" />
        <p className={styles.legende}>
          Exemple de cible (niveau 3) : le rond glisse de gauche à droite, puis revient. À toi d&apos;écrire le
          CSS qui la reproduit. Le quadrillage mesure 20 px et sert de règle.
        </p>
      </section>
    </main>
  );
}
