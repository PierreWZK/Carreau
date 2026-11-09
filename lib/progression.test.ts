import assert from "node:assert/strict";
import { test } from "node:test";
import { ajouterJours, dateArchiveValide, datesArchive } from "./jour.ts";
import { texteResume } from "./partage.ts";
import { calculerScore, etoilesGolf, longueurCode } from "./score.ts";
import { calculerSerie } from "./serie.ts";
import { analyser, type Resultat } from "./stockage.ts";

const r = (o: Partial<Resultat> = {}): Resultat => ({
  reussi: true,
  essais: 1,
  secondes: 42,
  indice: false,
  etoiles: 3,
  score: 100,
  enDirect: true,
  ...o,
});

test("score : pénalités par essai et par indice, jamais négatif", () => {
  assert.equal(calculerScore(1, 1, false), 100);
  assert.equal(calculerScore(2, 3, false), 180);
  assert.equal(calculerScore(3, 1, true), 270);
  assert.equal(calculerScore(1, 20, true), 0);
});

test("golf : espaces et commentaires ignorés, étoiles selon le rapport", () => {
  const solution = { html: "<div></div>", css: ".b { width: 10px; }" };
  assert.equal(longueurCode(1, "<p>long html ignoré</p>", ".b { width: 10px; }"), 15);
  assert.equal(etoilesGolf(2, solution, solution.html, ".b{width:10px}/* commentaire */"), 3);
  assert.equal(etoilesGolf(2, solution, solution.html, ".b { width: 10px; } .b { height: 5px; } .b { color: red; }"), 1);
  assert.equal(etoilesGolf(2, solution, solution.html, ".b { width: 10px; } .c{}"), 2);
});

test("série : jours consécutifs, archive ignorée, aujourd'hui pas encore joué ne casse pas", () => {
  const resultats = {
    "2026-11-07": { 1: r() },
    "2026-11-08": { 2: r() },
    "2026-11-09": { 1: r({ reussi: false }) },
  };
  assert.equal(calculerSerie(resultats, "2026-11-09"), 2);
  assert.equal(calculerSerie({ ...resultats, "2026-11-09": { 1: r() } }, "2026-11-09"), 3);
  assert.equal(calculerSerie({ ...resultats, "2026-11-08": { 2: r({ enDirect: false }) } }, "2026-11-09"), 0);
  assert.equal(calculerSerie({}, "2026-11-09"), 0);
});

test("dates : ajout de jours à travers un changement de mois, archive et validation", () => {
  assert.equal(ajouterJours("2026-11-30", 1), "2026-12-01");
  assert.equal(ajouterJours("2026-01-01", -1), "2025-12-31");
  assert.deepEqual(datesArchive("2026-11-12"), ["2026-11-11", "2026-11-10", "2026-11-09"]);
  assert.deepEqual(datesArchive("2026-11-09"), []);
  assert.equal(dateArchiveValide("2026-11-10", "2026-11-12"), "2026-11-10");
  assert.equal(dateArchiveValide("2026-11-12", "2026-11-12"), null);
  assert.equal(dateArchiveValide("2026-11-08", "2026-11-12"), null);
  assert.equal(dateArchiveValide("n'importe quoi", "2026-11-12"), null);
  assert.equal(dateArchiveValide(null, "2026-11-12"), null);
});

test("stockage : contenu illisible ignoré", () => {
  assert.deepEqual(analyser(null), {});
  assert.deepEqual(analyser("pas du json"), {});
  assert.deepEqual(analyser('{"resultats":42}'), {});
  assert.deepEqual(analyser('{"resultats":{"2026-11-09":{}}}'), { "2026-11-09": {} });
});

test("partage : emojis par niveau, détail, points et série", () => {
  const texte = texteResume("2026-11-09", { 1: r(), 3: r({ reussi: false, etoiles: 0, score: 0, essais: 5 }) }, 2);
  const lignes = texte.split("\n");
  assert.equal(lignes[1], "🟩⬜🟥");
  assert.match(lignes[2], /^🟩 Niveau 1 · ★★★ · 1 essai · 0:42$/);
  assert.equal(lignes[3], "⬜ Niveau 2");
  assert.equal(lignes[4], "🟥 Niveau 3 · raté");
  assert.equal(lignes[5], "100 points · série de 2 jours");
  assert.equal(lignes[6], "https://carreau.projectp.fr");
  assert.equal(lignes.length, 7);
});
