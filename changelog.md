# Changelog — Phandaline

## 1.3.0 (2026-11-23)

### Ajouté
- Contrôle WebGL avant le montage du Canvas : les API WebGL 2 puis WebGL 1 sont testées sur
  un canvas de 1 pixel, libéré aussitôt. Sans ce contrôle, un navigateur qui refuse tout
  contexte affichait un écran noir, sans message ni erreur, et la partie semblait cassée.
- Panneau de repli en français quand le rendu est impossible : cause probable, cinq actions
  concrètes (redémarrage complet du navigateur, `chrome://gpu`, accélération graphique,
  onglets lourds, pilote), diagnostic copiable, boutons « Réessayer » et « Recharger la page ».
- Gestion de `webglcontextlost` et `webglcontextrestored` : une perte de contexte en cours de
  partie affiche le panneau au lieu d'un écran figé, et le retour du contexte réaffiche le jeu.

### Vérifié
- Sans WebGL : panneau affiché à la place du jeu. Avec WebGL : village rendu normalement,
  canvas 1280 x 900, aucune erreur console.

## 1.2.0 (2026-08-03)

### Ajoute
- Bouton Infos dans l'en-tete du jeu, ouvrant une modale avec la stack (React Three Fiber /
  Three.js / Drei, store Zustand), les graphismes (vraie scene 3D WebGL), la musique
  (morceau principal en fichier audio, effets synthetises), les interactions, l'architecture
  et les algorithmes notables. Etape 15 du chantier de retrofit decrit dans `todo.md` racine
  du monorepo.

### Corrige
- Une dizaine de tirets longs repartis dans App.tsx, Onboarding.tsx, Characters.tsx,
  Encounters.tsx et npcData.ts (titres d'ecran, credits, libelles de mode camera,
  commentaires de code, et plusieurs repliques de dialogue PNJ) remplaces par des deux-points,
  virgules ou parentheses selon le contexte, en conformite avec la regle du depot. Trouves en
  verifiant le nouveau bouton Infos sur l'ecran de jeu, qui a conduit a relire les ecrans
  d'onboarding attenants.

### Verifie
- Build propre, modale testee a l'ouverture/fermeture, aucune erreur console, aucun
  debordement horizontal en 390x844.

## 1.1.0 (2026-07-28)
### Ajouté
- Nouvelles illustrations (4 écrans onboarding)
- Espace / clic avance le slide d'onboarding
- Fix délai 3D au chargement
- Crédit musique Pipin
- Images non-inlinées (performance)
- Boutique et forgeron interactifs
- Lore supplémentaire

## 1.0.0 (2026-07-24)
- Version initiale
- Village 3D complet de Phandaline
- 12 PNJ interactifs avec dialogues et synthèse vocale
- 3 quêtes principales
- 4 ennemis patrouilleurs
- Cycle jour/nuit
- 3 modes de caméra
- Audio synthétisé (Web Audio API)
- Intégration à Hylst.Games