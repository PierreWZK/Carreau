"use client";

import { useState } from "react";
import { texteResume } from "@/lib/partage";
import type { ResultatsDuJour } from "@/lib/stockage";
import styles from "./Partage.module.css";

interface Props {
  date: string;
  jour: ResultatsDuJour;
  serie: number;
}

export default function Partage({ date, jour, serie }: Props) {
  const [etat, setEtat] = useState<"repos" | "copie" | "echec">("repos");
  const texte = texteResume(date, jour, serie);

  async function copier() {
    try {
      await navigator.clipboard.writeText(texte);
      setEtat("copie");
    } catch {
      setEtat("echec");
    }
  }

  return (
    <section className={styles.partage}>
      <h3 className={styles.titre}>Résumé du jour</h3>
      <pre className={styles.texte}>{texte}</pre>
      <button type="button" className={styles.bouton} onClick={copier}>
        {etat === "copie" ? "Copié !" : "Copier le résumé"}
      </button>
      {etat === "echec" && <p role="status">Copie impossible : sélectionne le texte ci-dessus.</p>}
    </section>
  );
}
