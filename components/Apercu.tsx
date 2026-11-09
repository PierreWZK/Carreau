import { HAUTEUR, LARGEUR, construireSrcdoc } from "@/lib/rendu";
import styles from "./Apercu.module.css";

interface Props {
  html: string;
  css: string;
  titre: string;
}

export default function Apercu({ html, css, titre }: Props) {
  return (
    <div className={styles.defilement}>
      <div className={styles.cadre}>
        <iframe
          title={titre}
          sandbox=""
          srcDoc={construireSrcdoc(html, css)}
          width={LARGEUR}
          height={HAUTEUR}
          className={styles.iframe}
        />
      </div>
    </div>
  );
}
