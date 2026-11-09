import BandeauJour from "@/components/BandeauJour";
import CartesNiveaux from "@/components/CartesNiveaux";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.entete}>
        <h1 className={styles.titre}>Carreau</h1>
        <BandeauJour />
      </header>

      <p className={styles.intro}>
        Reproduis la cible en CSS. Trois défis par jour.
      </p>

      <CartesNiveaux />
    </main>
  );
}
