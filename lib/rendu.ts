export const LARGEUR = 320;
export const HAUTEUR = 240;

/** Instants d'échantillonnage des animations (fraction de la durée). */
const FRACTIONS = [0, 0.5, 0.99];

export interface Boite {
  x: number;
  y: number;
  w: number;
  h: number;
  bg: string;
  rad: string;
  bord: number;
  bc: string;
  op: number;
  texte: boolean;
  color: string;
}
export type Snap = Boite[];

const TRANSPARENT = "rgba(0, 0, 0, 0)";
const TOLERANCE = 2;

// Script exécuté dans l'iframe isolé : mesure les boîtes à chaque instant demandé.
const SCRIPT_MESURE = `(function(){
function snap(){
  var out=[];
  document.body.querySelectorAll('*').forEach(function(el){
    if(el.tagName==='SCRIPT'||el.tagName==='STYLE')return;
    var s=getComputedStyle(el);
    if(s.display==='none')return;
    var r=el.getBoundingClientRect();
    var texte=Array.prototype.some.call(el.childNodes,function(n){return n.nodeType===3&&n.textContent.trim()!==''});
    out.push({x:r.left,y:r.top,w:r.width,h:r.height,bg:s.backgroundColor,rad:s.borderTopLeftRadius,bord:parseFloat(s.borderTopWidth)||0,bc:s.borderTopColor,op:parseFloat(s.opacity),texte:texte,color:texte?s.color:''});
  });
  return out;
}
// Prévient le parent quand la page est vraiment dessinée. Avant la première image,
// un iframe n'est pas mis en page : toutes les boîtes mesurent 0×0 et les animations
// ne sont pas appliquées. Le "load" de l'iframe ne suffit pas (il se déclenche aussi
// pour le about:blank initial). Si le navigateur ne dessine pas (onglet masqué), le
// parent abandonne au bout de 3 s.
window.addEventListener('load',function(){
  requestAnimationFrame(function(){requestAnimationFrame(function(){parent.postMessage({type:'pret'},'*')})});
});
window.addEventListener('message',async function(e){
  var d=e.data;
  if(!d||d.type!=='mesurer')return;
  // Animations en pause, chaque instant est figé par currentTime puis lu aussitôt.
  var anims=document.getAnimations();
  anims.forEach(function(a){a.pause()});
  await Promise.all(anims.map(function(a){return a.ready}));
  var res=d.fractions.map(function(f){
    anims.forEach(function(a){
      var t=a.effect.getComputedTiming();
      a.currentTime=(t.delay||0)+f*(typeof t.duration==='number'?t.duration:0);
    });
    return snap();
  });
  e.source.postMessage({type:'mesure',id:d.id,snaps:res},'*');
});
})();`;

function nonceAleatoire() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

/**
 * Page complète du cadre de jeu. La CSP bloque tout réseau et tout script
 * sauf le script de mesure (nonce) : le code du joueur ne peut rien exécuter.
 */
export function construireSrcdoc(html: string, css: string, nonce?: string) {
  const scriptSrc = nonce ? `; script-src 'nonce-${nonce}'` : "";
  const csp = `default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:${scriptSrc}`;
  const cssSur = css.replace(/<\/style/gi, "");
  const script = nonce ? `<script nonce="${nonce}">${SCRIPT_MESURE}</script>` : "";
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><style>html,body{box-sizing:border-box;margin:0;width:${LARGEUR}px;height:${HAUTEUR}px;overflow:hidden}body{font-family:system-ui,sans-serif;font-size:16px}</style><style>${cssSur}</style></head><body>${html}${script}</body></html>`;
}

/** Rend html+css dans un iframe isolé hors écran et renvoie les mesures. */
export function mesurer(html: string, css: string): Promise<Snap[]> {
  return new Promise((resolve, reject) => {
    const nonce = nonceAleatoire();
    const id = nonceAleatoire();
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("aria-hidden", "true");
    // Dans la fenêtre mais invisible : un iframe hors écran ou `visibility:hidden`
    // n'est pas mis en page (toutes les boîtes mesurent 0×0).
    iframe.style.cssText = `position:fixed;left:0;top:0;z-index:-1;opacity:0;pointer-events:none;width:${LARGEUR}px;height:${HAUTEUR}px;border:0`;

    const fin = () => {
      clearTimeout(minuteur);
      window.removeEventListener("message", surMessage);
      iframe.remove();
    };
    const surMessage = (e: MessageEvent) => {
      if (e.source !== iframe.contentWindow || !e.data) return;
      if (e.data.type === "pret") {
        iframe.contentWindow?.postMessage({ type: "mesurer", id, fractions: FRACTIONS }, "*");
      } else if (e.data.type === "mesure" && e.data.id === id) {
        fin();
        resolve(e.data.snaps as Snap[]);
      }
    };
    const minuteur = setTimeout(() => {
      fin();
      reject(new Error("Délai dépassé pendant la mesure du rendu"));
    }, 3000);

    window.addEventListener("message", surMessage);
    iframe.srcdoc = construireSrcdoc(html, css, nonce);
    document.body.appendChild(iframe);
  });
}

const visible = (b: Boite) => b.bg !== TRANSPARENT || b.bord > 0 || b.texte;
const proche = (a: number, b: number, tol = TOLERANCE) => Math.abs(a - b) <= tol;

// 50% et 9999px donnent le même arrondi visuel : on compare des pixels plafonnés.
const rayonPx = (r: string, b: Boite) => {
  const v = parseFloat(r) || 0;
  const px = r.endsWith("%") ? (v / 100) * b.w : v;
  return Math.min(px, b.w / 2, b.h / 2);
};

// Les couleurs (fond, bordure, texte) ne sont pas comparées : seules forme, position et présence comptent.
function correspond(c: Boite, j: Boite) {
  return (
    proche(c.x, j.x) &&
    proche(c.y, j.y) &&
    proche(c.w, j.w) &&
    proche(c.h, j.h) &&
    proche(c.bord, j.bord, 1) &&
    proche(rayonPx(c.rad, c), rayonPx(j.rad, j)) &&
    proche(c.op, j.op, 0.05) &&
    c.texte === j.texte
  );
}

/** Compare les rendus instant par instant. `ecarts` = boîtes sans équivalent. */
export function comparer(cible: Snap[], joueur: Snap[]) {
  let ecarts = 0;
  cible.forEach((snapCible, i) => {
    const restantes = (joueur[i] ?? []).filter(visible);
    for (const c of snapCible.filter(visible)) {
      const k = restantes.findIndex((j) => correspond(c, j));
      if (k === -1) ecarts++;
      else restantes.splice(k, 1);
    }
    ecarts += restantes.length;
  });
  return { ok: ecarts === 0, ecarts };
}
