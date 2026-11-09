# CLAUDE_CONTEXTE — Jour 25 : Carreau

Fichier de suivi du projet. Mis à jour à chaque étape.

## 1. Demandes de l'utilisateur (simplifié)

- Un site de **jeu journalier** : reproduire des éléments en CSS (div centrée, flex wrap, animations, etc.).
- **3 niveaux de difficulté par jour**, défis indépendants.
- Niveau 1 : cible + éditeur CSS + HTML fourni + aperçu en direct.
- Niveau 2 : cible + éditeur HTML & CSS + aperçu en direct.
- Niveau 3 : cible + éditeur HTML & CSS, sans aperçu. Bouton « Valider », 5 essais max, puis la solution s'affiche.
- Un jour par semaine (**dimanche**) est plus dur que les autres.
- Validation : comparaison des positions et styles calculés avec la cible. Animations : échantillonnage à 0 %, 50 %, 100 %.
- Banque de défis écrite à la main, tirage déterministe par date.
- Progression : temps et essais, 1 indice par défi (pénalise le score), score « CSS golf » par rang face à une solution de référence (jamais d'échec), streak, partage façon Wordle, archive des jours passés (sans effet sur le streak).
- Stockage local seulement (`localStorage`). Pas de compte ni de classement en V1.
- Stack : **Next.js**, **CodeMirror 6**.
- **Mobile first.** Interface en **français**.
- Direction visuelle : fond façon **cahier de dessin** (quadrillage). Palette : `#E8E9DF`, `#A9B887`, `#2E3D28`.
- Nom du jeu : **Carreau**.
- Déploiement : dépôt GitHub avec branche principale **`master`** (même si l'utilisateur dit « main », c'est une erreur de sa part), puis Coolify en fin de V1.
- **Règles de travail :**
  - Maximum **5 étapes** pour la V1.
  - Valider chaque étape avant de continuer.
  - Après la V1, demander à l'utilisateur de tout tester, puis attendre la liste des modifications à faire.
  - Poser toutes les questions avant de commencer.

## 2. Décisions de conception

Décisions de l'utilisateur : voir section 1.

Décisions prises par Claude (à valider) :
- Le code du joueur tourne dans un **iframe isolé** (`sandbox`).
- Niveaux 2 et 3 : validation par la **mise en page obtenue**, pas par le texte du code.
- Un défi = un objet de données : HTML de départ, solution, indice, difficulté, jour dur ou non.
- V1 : environ **20 défis par niveau** (environ 3 semaines). Il faudra en écrire davantage ensuite.

## 3. Plan V1 (5 étapes maximum)

1. Projet Next.js, `CLAUDE_CONTEXTE.md`, thème cahier quadrillé, structure mobile first.
2. Moteur de jeu : iframe isolé, éditeur CodeMirror, aperçu, validation par comparaison des positions et styles.
3. Banque de défis, tirage par date, rendu des 3 niveaux, jour dur le dimanche.
4. Score (temps, essais), indice, étoiles CSS golf, streak, partage, archive.
5. Tests, dépôt GitHub (`master`), déploiement Coolify.

## 4. État actuel

- Questions posées et réponses reçues : **fait**.
- Design validé par l'utilisateur, nom « Carreau » choisi : **fait**.
- Étape 1 : **faite** (non commitée). Next.js 16.4.5, React 19.3.0, TypeScript, ESLint. Thème cahier quadrillé `#E8E9DF` / `#A9B887` / `#2E3D28`, page d'accueil mobile first avec la date du jour et les 3 cartes de niveau (placeholders).
- Étape 2 : **faite** (non commitée). Moteur de jeu :
  - `lib/rendu.ts` : scène fixe 320×240, `construireSrcdoc`, `mesurer` (iframe `sandbox="allow-scripts"` hors écran, CSP avec nonce : le code du joueur ne peut ni exécuter de script ni accéder au réseau), `comparer`.
  - Mesure : chaque élément visible (fond, bordure ou texte) donne x, y, largeur, hauteur, fond, rayon, bordure, opacité, couleur du texte. Tolérance de 2 px. Animations échantillonnées à 0 %, 50 % et 99 % de leur durée (Web Animations API).
  - `components/EditeurCode.tsx` (CodeMirror 6), `Apercu.tsx`, `DefiJeu.tsx` (onglets HTML/CSS, bouton Valider, essais, temps, solution après 5 échecs au niveau 3).
  - `lib/defi.ts` (type d'un défi). Les défis de démo et la page de test `/essai` ont été remplacés à l'étape 3.
  - Reset de la scène : `margin: 0` et `box-sizing: border-box` sur `html` et `body` seulement. Les éléments du joueur gardent le `box-sizing` par défaut.
- Étape 3 : **faite** (non commitée). Banque et jeu du jour :
  - `lib/defis/niveau1.ts`, `niveau2.ts`, `niveau3.ts` : 20 défis par niveau, dont 4 « durs » (champ `dur`) réservés au dimanche. `lib/defis/aide.ts` : constructeurs `n1` et `libre`. `lib/banque.ts`.
  - `lib/jour.ts` : `defiDuJour(niveau, date)`. Dimanche : un défi dur par semaine. Autres jours : un défi normal de plus chaque jour, 16 jours avant répétition. Date locale du joueur.
  - Routes : `/jouer/1`, `/jouer/2`, `/jouer/3` (page `app/jouer/[niveau]/page.tsx`, composant `components/Jeu.tsx`). L'accueil renvoie vers ces pages. Badge « Jour dur » le dimanche.
  - Quadrillage de 20 px par-dessus la cible et le rendu, pour estimer les distances. Les dimensions des défis sont en multiples de 10 ou 20 px.
- Étape 4 : **faite** (non commitée). Score, indice, série, partage, archive :
  - `lib/score.ts` : score = points de base du niveau (100 / 200 / 300) − 10 par essai après le premier − 30 si l'indice est vu, jamais négatif. Étoiles CSS golf : longueur du code sans espaces ni commentaires comparée à la solution de référence (HTML compté seulement aux niveaux 2 et 3) : 3 étoiles jusqu'à 115 %, 2 jusqu'à 160 %, sinon 1. Un défi raté n'a pas d'étoile et 0 point.
  - `lib/stockage.ts` : sauvegarde `localStorage` (clé `carreau:v1`), un résultat par jour et par niveau. `components/useResultats.ts` : hook.
  - `lib/serie.ts` : un jour compte pour la série s'il a au moins un niveau réussi le jour même (`enDirect`). L'archive ne compte pas. Si aujourd'hui n'est pas encore validé, la série court jusqu'à hier.
  - `lib/partage.ts` : résumé façon Wordle (🟩 réussi, 🟥 raté, ⬜ pas joué) avec étoiles, essais, temps, points et série. Bouton « Copier le résumé » (`components/Partage.tsx`).
  - Indice : bouton « Indice (−30 points) » dans `DefiJeu`. Une fois un défi terminé (réussi ou raté), il n'est plus rejouable : on voit la carte de résultat et la solution (`CarteResultat.tsx`). Le code tapé n'est pas sauvegardé.
  - Archive : page `/archive` (jours du 2026-11-09 à hier, `DATE_DEBUT` dans `lib/jour.ts`). Un jour passé se joue sur `/jouer/N?date=AAAA-MM-JJ` avec un bandeau « ne compte pas pour ta série ». Une date invalide, future ou antérieure au début est ignorée (défi du jour).
  - Accueil (`CartesNiveaux.tsx`) : série en cours, statut « Réussi / Raté » par niveau, lien vers l'archive.
- Étape 5 : **en attente de la fusion de la PR** (déploiement pas encore lancé) :
  - Dépôt public https://github.com/PierreWZK/carreau, branche principale `master` (créée avec le dépôt, un seul commit initial). Le travail est sur `feat/carreau-v1`, PR https://github.com/PierreWZK/carreau/pull/1 (5 commits groupés par étape, dans l'état final des fichiers : un commit ne se construit pas forcément seul). L'utilisateur fusionne.
  - `Dockerfile` en trois étapes (`npm ci`, `npm run build` avec `NEXT_OUTPUT=standalone`, exécution `node server.js`, port 3000), `.dockerignore`, `next.config.ts` avec `output: "standalone"` conditionnel.
  - Coolify (`https://coolify.projectp.fr`, API) : projet « Carreau » `salqqc8yhjrefwggkpxso29s`, app « Carreau » `03ebs30yndhjcsbakqq9ixmg` (GitHub app `projectp-github`, dépôt `PierreWZK/carreau`, branche `master`, Dockerfile, port 3000, domaine `https://carreau.projectp.fr`). **Créée sans déploiement** : `master` ne contient pas encore le code.
  - Reste : fusionner la PR, lancer le déploiement (API Coolify `/deploy`, en POST), vérifier `https://carreau.projectp.fr`.
- Dépôt git local créé (branche `master`, commit initial généré par create-next-app). Pas de push.

**Point ouvert :** le dossier `day-25-connect-four` existe déjà dans `30DaysProjects` (dépôt git, `CAHIER_DES_CHARGES.md`). Ce projet n'est pas touché. Le projet Carreau est créé dans `day-25-carreau`. Confirmer ce choix.

## 5. Ce qui a été tenté / échoué

- Un `Glob` sur tout `30DaysProjects` a expiré (timeout de 20 s). Un `ls` ciblé a suffi.
- `create-next-app` refuse un dossier qui contient déjà `CLAUDE_CONTEXTE.md`. Scaffold fait dans un dossier temporaire, puis copié.
- Premier `next build` en échec : `new Date()` lu pendant le prerender. Corrigé avec un composant client `app/date-du-jour.tsx` (`useSyncExternalStore`).
- Lint `react-hooks/set-state-in-effect` sur la version avec `useEffect` + `useState`. Corrigé avec `useSyncExternalStore`.
- Étape 2, bug grave : la validation donnait « identique » à tort, car tous les éléments mesuraient 0×0 (un iframe hors écran ou `visibility:hidden` n'est pas mis en page). Corrigé : iframe placé dans la fenêtre avec `opacity:0`, et mesure lancée seulement après un message `pret` envoyé au `load` du document (le `load` de l'iframe se déclenche aussi pour le `about:blank` initial).
- Étape 3, mesure instable : sans attendre une vraie image dessinée, les boîtes mesuraient parfois 0×0 et les animations n'étaient pas appliquées, au hasard d'un lancement à l'autre (donc des défis validés ou refusés à tort). Corrigé : l'iframe n'annonce `pret` qu'après deux `requestAnimationFrame`, puis les animations sont mises en pause, `currentTime` est réglé et lu aussitôt. Conséquence : si le navigateur ne dessine pas (onglet ou volet masqué), la mesure échoue après 3 s avec « Impossible de mesurer le rendu ».
- Étape 3 : `export const dynamicParams` est refusé par Next 16 avec Cache Components (build en échec). Retiré, la page appelle `notFound()` pour un niveau invalide.
- Étape 3 : le navigateur intégré, volet masqué, ne fait pas tourner l'iframe de mesure. Vérifications faites avec Playwright.
- Étape 4 : la sauvegarde qui suit une partie remplaçait l'écran en cours par la carte « déjà jouée » (le résultat devenait une prop). Corrigé : `DefiJeu` fige `deja` au montage.
- Étape 4 : le test unitaire du golf avait un cas à 1 étoile qui donnait en réalité 2 (rapport 1,58 avec le HTML compté). Cas du test corrigé, pas la règle.
- Étape 4 : Playwright, avec l'horloge simulée, affiche « Blocked script execution in 'about:srcdoc' » dans la console : c'est le script d'horloge de Playwright injecté dans les iframes sans `allow-scripts`. Ce n'est pas un bug du jeu (0 erreur sans horloge simulée).
- Étape 5 : `create-next-app` avait créé un dépôt git local avec son propre commit initial. Supprimé (jamais poussé) et remplacé par un dépôt initialisé sur le commit initial distant, pour que `master` distant et local aient la même histoire.
- Étape 5 : l'API Coolify refuse le tiret long « — » dans la description d'un projet (422). Description sans tiret long.
- Étape 5 : Docker n'est pas installé sur cette machine, l'image n'a donc pas été construite. À la place : `NEXT_OUTPUT=standalone npm run build`, puis exécution de `server.js` avec `public` et `.next/static` copiés, comme dans le Dockerfile.
- Étape 5 : `/jouer/9` (niveau inexistant) répond 200 au lieu de 404 avec Cache Components : la page appelle `notFound()` après le début du streaming. Contenu « introuvable » affiché, statut HTTP non corrigé.
- `node --test lib/` ne marche pas sur Node 22 : le script utilise le glob `lib/**/*.test.ts`.
- Piloter CodeMirror par `.cm-content.cmView.view` n'a pas marché. Les tests dans le navigateur passent par de vraies frappes.

## 6. Tests effectués

- `npm run build` : OK (route `/` statique).
- `npm run lint` : OK, aucun problème.
- `npx tsc --noEmit` : OK.
- Rendu dans le navigateur intégré (`npm run start`, port 3000), viewport 375x812 : titre, date, 3 cartes, fond quadrillé visibles. Console : aucune erreur.
- Non testé : desktop au-delà de 640 px, autres navigateurs.
- Étape 2 : `npm test` (6 tests unitaires sur `comparer`) OK, `tsc` OK, lint OK, build OK (routes `/` et `/essai`).
- Étape 2, navigateur intégré à 375×812 (`next dev`, port 3001), console sans erreur :
  - Niveau 1 : CSS de départ refusé, puis solution tapée au clavier acceptée.
  - Niveau 2 : seulement affiché, pas validé.
  - Niveau 3 : 5 validations vides, message « Plus d'essais » et solution affichée. Animation correcte tapée au clavier acceptée.
- Étape 3 : `npm test` 12 tests OK (banque : 20 défis par niveau, ids uniques, niveau 1 avec HTML fourni, dimanche dur, pas de répétition sur 16 jours normaux et 4 dimanches). `tsc`, lint, build OK.
- Étape 3, Playwright (page de contrôle temporaire, supprimée) : les 60 solutions rendues sans élément invisible ni hors scène, CSS de départ du niveau 1 différent de la solution, chaque défi animé bouge entre 0 % et 50 %, et 3 passes de 60 mesures donnent des résultats identiques (360 mesures, 0 écart).
- Étape 3, Playwright à 375×812 : `/jouer/1` refuse le CSS de départ, puis accepte la solution tapée (« Bravo, c'est identique ! »). `/jouer/3` s'affiche avec la cible et le quadrillage.
- Étape 4 : `npm test` 18 tests OK (score, golf, série, dates et archive, lecture du stockage, texte de partage). `tsc`, lint, build OK (routes `/`, `/archive`, `/jouer/[niveau]`).
- Étape 4, Playwright à 375×812 sur le build de production : niveau 1 avec indice (message, essai raté puis réussi : score 60 / 100, 3 étoiles, sauvegarde `enDirect: true`), résumé de partage correct, rechargement de la page : carte de résultat sans éditeur, accueil avec « Série : 1 jour » et « ✓ Réussi », niveau 3 raté après 5 essais (score 0, solution ouverte). Avec l'horloge simulée au 2026-11-12 : série à 0, archive avec 3 jours et les statuts ✓ / ✗, bandeau d'archive, date invalide ignorée, défi d'archive réussi enregistré avec `enDirect: false` sans lancer la série.
- Étape 5 : build `standalone` lancé hors Docker (port 3100) : `/`, `/archive`, `/jouer/1`, `/jouer/3` et un fichier CSS statique répondent 200. Pas de CI GitHub configurée (aucun check sur la PR).
- Non testé à l'étape 5 : l'image Docker, le déploiement Coolify, le domaine `carreau.projectp.fr` (DNS et certificat).
- Non testé à l'étape 4 : bouton « Copier » (presse-papiers) réel, partage sur téléphone, navigation privée (stockage refusé), deux onglets ouverts en même temps, série sur plusieurs vrais jours, changement d'heure.
- Non testé à l'étape 3 : chaque défi résolu à la main par un humain (seules les solutions de référence sont vérifiées), le niveau 2 et le niveau 3 joués en entier, les autres solutions possibles d'un même défi (une solution valide mais différente peut être refusée), Safari/Firefox, vrai téléphone, changement de jour pendant une partie, le dimanche (jour dur) à l'écran.
- Non testé à l'étape 2 : niveau 2 complet, animation avec une mauvaise courbe (`linear`), erreurs de syntaxe CSS/HTML, très petits écrans (< 356 px, la scène défile), Safari/Firefox, jeu au clavier mobile réel.
- Limites connues : la durée d'une animation n'est pas comparée (seulement la progression à 0, 50 et 99 %). Une cible sans aucun élément visible validerait n'importe quel rendu vide.
