import assert from "node:assert/strict";
import { test } from "node:test";
import { comparer, type Boite } from "./rendu.ts";

const boite = (o: Partial<Boite> = {}): Boite => ({
  x: 10,
  y: 10,
  w: 60,
  h: 60,
  bg: "rgb(169, 184, 135)",
  rad: "0px",
  bord: 0,
  bc: "rgb(0, 0, 0)",
  op: 1,
  texte: false,
  color: "",
  ...o,
});

test("rendus identiques : ok", () => {
  assert.equal(comparer([[boite()]], [[boite()]]).ok, true);
});

test("décalage de 5px : refusé", () => {
  assert.equal(comparer([[boite()]], [[boite({ x: 15 })]]).ok, false);
});

test("décalage de 1px : toléré", () => {
  assert.equal(comparer([[boite()]], [[boite({ x: 11 })]]).ok, true);
});

test("50% et rayon énorme : équivalents", () => {
  const a = boite({ rad: "50%" });
  const b = boite({ rad: "9999px" });
  assert.equal(comparer([[a]], [[b]]).ok, true);
});

test("boîte en trop ou manquante : refusé", () => {
  assert.equal(comparer([[boite()]], [[boite(), boite({ x: 100 })]]).ecarts, 1);
  assert.equal(comparer([[boite(), boite({ x: 100 })]], [[boite()]]).ecarts, 1);
});

test("différence à un instant de l'animation : refusé", () => {
  const cible = [[boite()], [boite({ x: 110 })]];
  const joueur = [[boite()], [boite({ x: 10 })]];
  assert.equal(comparer(cible, joueur).ok, false);
});
