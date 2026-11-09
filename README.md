# Carreau

Un jeu CSS quotidien. Chaque jour, trois défis : reproduis la cible en HTML/CSS. Jour 25 du défi « 30 jours, 30 projets ».

- **Niveau 1** : HTML fourni, éditeur CSS, aperçu en direct.
- **Niveau 2** : éditeurs HTML et CSS, aperçu en direct.
- **Niveau 3** : éditeurs HTML et CSS, sans aperçu avant validation, 5 essais.
- Le dimanche, les trois défis sont plus durs.
- Score (essais, indice), étoiles « CSS golf », série de jours, partage façon Wordle, archive des jours passés. Tout est stocké dans le navigateur (`localStorage`).

La validation compare, instant par instant, les positions et les styles des éléments du joueur avec ceux de la cible, dans un iframe isolé (`sandbox`, CSP sans réseau ni script du joueur).

## Développer

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # tests unitaires (Node)
npm run lint
npm run build
```

Pile : Next.js 16, React 19, TypeScript, CodeMirror 6. Interface mobile first, en français.

## Contenu

Les défis sont écrits à la main dans `lib/defis/` (20 par niveau, dont 4 « durs »). Le défi du jour est tiré de la date (`lib/jour.ts`). Les dimensions des défis sont en multiples de 10 ou 20 px, pour le quadrillage de la cible.

## Déploiement

`Dockerfile` en trois étapes (sortie Next.js `standalone`), port 3000. Déployé sur Coolify, branche `master`.

Le suivi détaillé du projet (demandes, décisions, tests, échecs) est dans `CLAUDE_CONTEXTE.md`.
