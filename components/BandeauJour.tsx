"use client";

import { estDimanche, formaterDate } from "@/lib/jour";
import { useAujourdhui } from "./useAujourdhui";
import styles from "./BandeauJour.module.css";

export default function BandeauJour() {
  const date = useAujourdhui();
  if (!date) return <p className={styles.date}>&nbsp;</p>;

  return (
    <p className={styles.date}>
      {formaterDate(date)}
      {estDimanche(date) && <span className={styles.dur}>Jour dur</span>}
    </p>
  );
}
