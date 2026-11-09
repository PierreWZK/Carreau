import type { Defi, Niveau } from "./defi";
import { niveau1 } from "./defis/niveau1.ts";
import { niveau2 } from "./defis/niveau2.ts";
import { niveau3 } from "./defis/niveau3.ts";

export const banque: Record<Niveau, Defi[]> = { 1: niveau1, 2: niveau2, 3: niveau3 };
