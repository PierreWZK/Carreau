import type { Metadata } from "next";
import Link from "next/link";
import BandeauJour from "@/components/BandeauJour";
import CartesNiveaux from "@/components/CartesNiveaux";
import styles from "./jouer.module.css";

export const metadata: Metadata = {
  title: "Jouer — Carreau",
  description: "Les trois défis CSS du jour : choisis ton niveau et reproduis la cible.",
};

export default function Jouer() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.retour}>
        ← Carreau
      </Link>
      <h1 className={styles.titre}>Jouer</h1>
      <BandeauJour />
      <p>Trois défis aujourd&apos;hui. Commence par celui que tu veux.</p>
      <CartesNiveaux />
    </main>
  );
}
