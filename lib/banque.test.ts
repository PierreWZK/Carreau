import assert from "node:assert/strict";
import { test } from "node:test";
import { banque } from "./banque.ts";
import { defiDuJour, estDimanche } from "./jour.ts";

const niveaux = [1, 2, 3] as const;

// Dates consécutives à partir de `debut` (AAAA-MM-JJ), en UTC pour éviter les décalages d'heure d'été.
function jours(debut: string, n: number) {
  const t = Date.parse(`${debut}T00:00:00Z`);
  return Array.from({ length: n }, (_, i) => new Date(t + i * 86_400_000).toISOString().slice(0, 10));
}

test("20 défis par niveau, dont au moins 4 durs, ids uniques", () => {
  const ids = new Set<string>();
  for (const n of niveaux) {
    const liste = banque[n];
    assert.equal(liste.length, 20, `niveau ${n}`);
    assert.ok(liste.filter((d) => d.dur).length >= 4, `durs niveau ${n}`);
    for (const d of liste) {
      assert.equal(d.niveau, n, d.id);
      assert.ok(!ids.has(d.id), `id en double : ${d.id}`);
      ids.add(d.id);
      assert.ok(d.consigne && d.indice && d.titre, `champs vides : ${d.id}`);
      assert.ok(d.solution.html.trim() && d.solution.css.trim(), `solution vide : ${d.id}`);
    }
  }
});

test("niveau 1 : HTML fourni et CSS de départ différent de la solution ; niveaux 2 et 3 : page vide", () => {
  for (const d of banque[1]) {
    assert.equal(d.html, d.solution.html, d.id);
    assert.notEqual(d.css, d.solution.css, d.id);
  }
  for (const n of [2, 3] as const) {
    for (const d of banque[n]) assert.deepEqual([d.html, d.css], ["", ""], d.id);
  }
});

test("le dimanche tire un défi dur, les autres jours un défi normal", () => {
  for (const date of jours("2026-11-02", 28)) {
    for (const n of niveaux) {
      assert.equal(Boolean(defiDuJour(n, date).dur), estDimanche(date), `${date} niveau ${n}`);
    }
  }
  assert.equal(estDimanche("2026-11-08"), true);
  assert.equal(estDimanche("2026-11-09"), false);
});

test("même date, même défi", () => {
  for (const n of niveaux) assert.equal(defiDuJour(n, "2026-12-25").id, defiDuJour(n, "2026-12-25").id);
});

test("16 jours normaux d'affilée : aucun défi répété", () => {
  const normaux = jours("2026-11-09", 40).filter((d) => !estDimanche(d)).slice(0, 16);
  for (const n of niveaux) {
    assert.equal(new Set(normaux.map((d) => defiDuJour(n, d).id)).size, 16, `niveau ${n}`);
  }
});

test("4 dimanches d'affilée : aucun défi dur répété", () => {
  const dimanches = jours("2026-11-08", 28).filter(estDimanche);
  assert.equal(dimanches.length, 4);
  for (const n of niveaux) {
    assert.equal(new Set(dimanches.map((d) => defiDuJour(n, d).id)).size, 4, `niveau ${n}`);
  }
});
