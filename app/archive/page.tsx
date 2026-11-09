import Link from "next/link";
import ListeArchive from "@/components/ListeArchive";
import styles from "./archive.module.css";

export default function Archive() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.retour}>
        ← Carreau
      </Link>
      <h1 className={styles.titre}>Archive</h1>
      <p>Rattrape les jours passés. Ils ne comptent pas pour ta série.</p>
      <ListeArchive />
    </main>
  );
}
